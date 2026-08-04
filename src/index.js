const KV_KEYS = {
  '/api/data': 'main',
  '/api/kanban': 'kanban',
  '/api/marketing': 'marketing',
  '/api/archive': 'archive'
};

const ARCHIVE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
/** Legacy monolithic bag (full boards × N) — never JSON.parse; delete only. */
const MARKETING_SNAPSHOT_LEGACY_KEY = 'marketing-snapshots';
const MARKETING_SNAP_INDEX_KEY = 'marketing-snap-index';
const MARKETING_SNAP_PREFIX = 'marketing-snap:';
const MARKETING_SNAP_MIGRATED_KEY = 'marketing-snap-migrated-v2';
const MARKETING_SNAPSHOT_MAX = 5;
const MARKETING_SNAPSHOT_MIN_INTERVAL_MS = 15 * 60 * 1000;

function purgeArchiveItems(items) {
  const cutoff = Date.now() - ARCHIVE_TTL_MS;
  return (Array.isArray(items) ? items : []).filter(e => {
    if (!e || !e.deletedAt) return false;
    const t = new Date(e.deletedAt).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}

function scheduleCount(data) {
  const s = data && data.sections && data.sections.schedule;
  return Array.isArray(s) ? s.length : 0;
}

function filledScheduleCount(data) {
  const s = data && data.sections && data.sections.schedule;
  if (!Array.isArray(s)) return 0;
  let n = 0;
  for (const c of s) {
    const t = String((c && c.body) || '').replace(/<[^>]+>/g, '').trim();
    if (t) n++;
  }
  return n;
}

function boardRev(data) {
  const r = data && data._rev;
  const n = Number(r);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function anchorCount(data) {
  return Array.isArray(data && data.anchors) ? data.anchors.length : 0;
}

function ideaCount(data) {
  return Array.isArray(data && data.ideas) ? data.ideas.length : 0;
}

/** True when an incoming save would silently gut a non-trivial board. */
function isCatastrophicMarketingOverwrite(prev, incoming) {
  if (!prev || typeof prev !== 'object') return false;
  if (!incoming || typeof incoming !== 'object') return true;
  const prevSched = scheduleCount(prev);
  const nextSched = scheduleCount(incoming);
  const prevAnchors = anchorCount(prev);
  const nextAnchors = anchorCount(incoming);
  const prevFilled = filledScheduleCount(prev);
  const nextFilled = filledScheduleCount(incoming);
  if (prevSched >= 5 && nextSched === 0) return true;
  if (prevSched >= 10 && nextSched < Math.floor(prevSched * 0.4)) return true;
  if (prevAnchors >= 2 && nextAnchors === 0 && nextSched <= prevSched) return true;
  // Never drop filled content cards via a thinner/stale save
  if (prevFilled >= 1 && nextFilled < prevFilled) return true;
  // Never drop events/cadences via a thinner concurrent save
  if (prevAnchors >= 1 && nextAnchors < prevAnchors) return true;
  return false;
}

/** Drop base64 embeds so snapshots stay small enough for Worker memory. */
function stripHeavyMedia(value) {
  if (Array.isArray(value)) return value.map(stripHeavyMedia);
  if (!value || typeof value !== 'object') return value;
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if ((k === 'imageData' || k === 'reviewMedia') && typeof v === 'string' && v.startsWith('data:')) {
      out[k] = null;
      continue;
    }
    out[k] = stripHeavyMedia(v);
  }
  return out;
}

/** One-shot: delete legacy fat snapshot bag without parsing it (can be 100MB+). */
async function ensureSnapshotsMigrated(env) {
  const done = await env.PLANNER_KV.get(MARKETING_SNAP_MIGRATED_KEY);
  if (done) return;
  try { await env.PLANNER_KV.delete(MARKETING_SNAPSHOT_LEGACY_KEY); } catch (_) {}
  await env.PLANNER_KV.put(MARKETING_SNAP_MIGRATED_KEY, '1');
}

async function readSnapIndex(env) {
  const bag = (await env.PLANNER_KV.get(MARKETING_SNAP_INDEX_KEY, 'json')) || { items: [] };
  if (!Array.isArray(bag.items)) bag.items = [];
  return bag;
}

/** Keep recoverable lightweight copies of the previous marketing board. */
async function maybeSnapshotMarketing(env, prev, incoming) {
  if (!prev || typeof prev !== 'object') return;
  await ensureSnapshotsMigrated(env);
  const bag = await readSnapIndex(env);
  const last = bag.items[0];
  const age = last ? Date.now() - new Date(last.at).getTime() : Infinity;
  const prevSched = scheduleCount(prev);
  const nextSched = scheduleCount(incoming);
  const prevAnchors = anchorCount(prev);
  const nextAnchors = anchorCount(incoming);
  const bigDrop = nextSched < prevSched - 2 || nextAnchors < prevAnchors;
  if (!bigDrop && Number.isFinite(age) && age < MARKETING_SNAPSHOT_MIN_INTERVAL_MS) return;

  const id = 'snap-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const light = stripHeavyMedia(prev);
  await env.PLANNER_KV.put(MARKETING_SNAP_PREFIX + id, JSON.stringify(light));

  bag.items.unshift({
    id,
    at: new Date().toISOString(),
    scheduleCount: prevSched,
    anchorCount: prevAnchors,
    ideaCount: ideaCount(prev)
  });
  const dropped = bag.items.slice(MARKETING_SNAPSHOT_MAX);
  bag.items = bag.items.slice(0, MARKETING_SNAPSHOT_MAX);
  await env.PLANNER_KV.put(MARKETING_SNAP_INDEX_KEY, JSON.stringify(bag));
  for (const old of dropped) {
    if (!old || !old.id) continue;
    try { await env.PLANNER_KV.delete(MARKETING_SNAP_PREFIX + old.id); } catch (_) {}
  }
}

async function loadSnapshotData(env, snapId) {
  if (!snapId) return null;
  const fromKey = await env.PLANNER_KV.get(MARKETING_SNAP_PREFIX + snapId, 'json');
  if (fromKey) return fromKey;
  return null;
}

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-PPC-Force-Overwrite'
    };
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    /* List marketing board snapshots (metadata only). */
    if (url.pathname === '/api/marketing/snapshots') {
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: cors });
      try { await ensureSnapshotsMigrated(env); } catch (_) {}
      const bag = await readSnapIndex(env);
      const items = bag.items.map(s => ({
        id: s.id,
        at: s.at,
        scheduleCount: s.scheduleCount,
        anchorCount: s.anchorCount,
        ideaCount: s.ideaCount
      }));
      return new Response(JSON.stringify({ items }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    /* Emergency: drop legacy fat snapshot bag without parsing. */
    if (url.pathname === '/api/marketing/snapshots/purge') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });
      try { await env.PLANNER_KV.delete(MARKETING_SNAPSHOT_LEGACY_KEY); } catch (_) {}
      await env.PLANNER_KV.put(MARKETING_SNAP_MIGRATED_KEY, '1');
      return new Response(JSON.stringify({ ok: true, purged: MARKETING_SNAPSHOT_LEGACY_KEY }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    /* Restore a marketing snapshot over the live board (snapshots current first). */
    if (url.pathname === '/api/marketing/restore') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });
      try { await ensureSnapshotsMigrated(env); } catch (_) {}
      let body = {};
      try { body = await request.json(); } catch (e) {}
      const snapId = body && body.snapshotId;
      if (!snapId) return new Response(JSON.stringify({ error: 'snapshotId required' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' }
      });
      const snapData = await loadSnapshotData(env, snapId);
      if (!snapData) return new Response(JSON.stringify({ error: 'snapshot not found' }), {
        status: 404, headers: { ...cors, 'Content-Type': 'application/json' }
      });
      const current = await env.PLANNER_KV.get('marketing', 'json');
      await maybeSnapshotMarketing(env, current, snapData);
      const restored = { ...snapData, _rev: boardRev(current) + 1, _savedAt: new Date().toISOString() };
      await env.PLANNER_KV.put('marketing', JSON.stringify(restored));
      const bag = await readSnapIndex(env);
      const meta = bag.items.find(s => s && s.id === snapId);
      return new Response(JSON.stringify({
        ok: true,
        restoredAt: meta && meta.at,
        rev: restored._rev,
        scheduleCount: scheduleCount(restored),
        anchorCount: anchorCount(restored)
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    /* Surgical card patch. The Annual Planner and the Task Board are separate
       pages sharing one blob — if both do read-modify-write on the whole board,
       whichever saves last silently drops the other's edits. This does the
       read-modify-write server-side against a single card, so the vulnerable
       window is milliseconds instead of however long a tab has been open.
       Body: { upsert: [card, ...], remove: [id, ...] } */
    if (url.pathname === '/api/kanban/patch') {
      if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

      let patch = {};
      try { patch = await request.json(); } catch (e) {}
      const board = (await env.PLANNER_KV.get('kanban', 'json')) || {};
      if (!Array.isArray(board.cards)) board.cards = [];

      const removeIds = new Set(Array.isArray(patch.remove) ? patch.remove : []);
      if (removeIds.size) board.cards = board.cards.filter(c => !removeIds.has(c.id));

      (Array.isArray(patch.upsert) ? patch.upsert : []).forEach(incoming => {
        if (!incoming || !incoming.id) return;
        const i = board.cards.findIndex(c => c.id === incoming.id);
        // Merge, so fields the caller didn't send (column, assignees…) survive.
        if (i >= 0) board.cards[i] = { ...board.cards[i], ...incoming };
        else board.cards.push(incoming);
      });

      await env.PLANNER_KV.put('kanban', JSON.stringify(board));
      return new Response(JSON.stringify({ ok: true, cards: board.cards.length }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    const kvKey = KV_KEYS[url.pathname];
    if (!kvKey) {
      return new Response('Not found', { status: 404 });
    }
    if (request.method === 'GET') {
      if (kvKey === 'marketing') {
        try { await ensureSnapshotsMigrated(env); } catch (_) {}
      }
      const data = await env.PLANNER_KV.get(kvKey, 'json');
      if (kvKey === 'archive') {
        const items = purgeArchiveItems(data && data.items);
        if (data && Array.isArray(data.items) && items.length !== data.items.length) {
          await env.PLANNER_KV.put('archive', JSON.stringify({ items }));
        }
        return new Response(JSON.stringify({ items }), { headers: { ...cors, 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify(data || {}), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (request.method === 'POST') {
      const body = await request.json();
      if (kvKey === 'archive') {
        const items = purgeArchiveItems(body && body.items);
        await env.PLANNER_KV.put('archive', JSON.stringify({ items }));
        return new Response(JSON.stringify({ ok: true, items: items.length }), {
          headers: { ...cors, 'Content-Type': 'application/json' }
        });
      }
      if (kvKey === 'marketing') {
        try { await ensureSnapshotsMigrated(env); } catch (_) {}
        const prev = await env.PLANNER_KV.get('marketing', 'json');
        const force = request.headers.get('X-PPC-Force-Overwrite') === '1'
          || url.searchParams.get('force') === '1';
        const prevRev = boardRev(prev);
        const incomingRev = boardRev(body);
        // Only hard-reject when a stale/concurrent save would gut the board.
        // Matching-rev saves and non-destructive concurrent edits (card moves)
        // last-write-wins after a snapshot — rapid drags must not 409.
        if (!force && isCatastrophicMarketingOverwrite(prev, body)) {
          try { await maybeSnapshotMarketing(env, prev, body); } catch (_) {}
          return new Response(JSON.stringify({
            ok: false,
            error: 'rejected_thin_overwrite',
            message: 'Save rejected: would wipe calendar cards/events. Hard-refresh, then retry. Use force only for intentional resets.',
            prevRev,
            incomingRev,
            prevSchedule: scheduleCount(prev),
            nextSchedule: scheduleCount(body),
            prevAnchors: anchorCount(prev),
            nextAnchors: anchorCount(body)
          }), {
            status: 409,
            headers: { ...cors, 'Content-Type': 'application/json' }
          });
        }
        try {
          await maybeSnapshotMarketing(env, prev, body);
        } catch (_) {}
        body._rev = prevRev + 1;
        body._savedAt = new Date().toISOString();
      }
      await env.PLANNER_KV.put(kvKey, JSON.stringify(body));
      return new Response(JSON.stringify({
        ok: true,
        ...(kvKey === 'marketing' ? { rev: body._rev } : {})
      }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    return new Response('Method not allowed', { status: 405 });
  }
};
