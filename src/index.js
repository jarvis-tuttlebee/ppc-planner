const KV_KEYS = { '/api/data': 'main', '/api/kanban': 'kanban' };

export default {
  async fetch(request, env) {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
    const url = new URL(request.url);

    /* Surgical card patch. The Annual Planner and the Task Board are separate
       pages sharing one blob — if both do read-modify-write on the whole board,
       whichever saves last silently drops the other's edits. This does the
       read-modify-write server-side against a single card, so the vulnerable
       window is milliseconds instead of however long a tab has been open.
       Body: { upsert: [card, ...], remove: [id, ...] } */
    if (url.pathname === '/api/kanban/patch') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
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

      // Board metadata (column order, projects, staff) has a single writer
      // (the Task Board page) so it's safe to overwrite outright — unlike
      // `cards`, nothing else concurrently patches these fields.
      if (Array.isArray(patch.order)) board.order = patch.order;
      if (Array.isArray(patch.projects)) board.projects = patch.projects;
      if (Array.isArray(patch.staff)) board.staff = patch.staff;

      await env.PLANNER_KV.put('kanban', JSON.stringify(board));
      return new Response(JSON.stringify({ ok: true, cards: board.cards.length }), {
        headers: { ...cors, 'Content-Type': 'application/json' }
      });
    }

    const kvKey = KV_KEYS[url.pathname];
    if (!kvKey) {
      return new Response('Not found', { status: 404 });
    }
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method === 'GET') {
      const data = await env.PLANNER_KV.get(kvKey, 'json');
      return new Response(JSON.stringify(data || {}), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    if (request.method === 'POST') {
      const body = await request.json();
      await env.PLANNER_KV.put(kvKey, JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    return new Response('Method not allowed', { status: 405 });
  }
};
