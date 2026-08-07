/* Shared Homebase helpers: archive (30-day soft-delete), dark mode, toast, Settings panel. */
(function (global) {
  const ARCHIVE_URL = '/api/archive';
  const ARCHIVE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  const DARK_KEY = 'ppc-dark-mode';
  const ARCHIVE_OPEN_KEY = 'ppc-archive-open';

  const COLUMN_LABELS = {
    backlog: 'Backlog',
    waiting: 'Waiting',
    active: 'Active',
    done: 'Done'
  };
  const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function uid() {
    return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function purge(items) {
    const cutoff = Date.now() - ARCHIVE_TTL_MS;
    return (Array.isArray(items) ? items : []).filter(e => {
      if (!e || !e.deletedAt) return false;
      const t = new Date(e.deletedAt).getTime();
      return !Number.isNaN(t) && t >= cutoff;
    });
  }

  async function loadArchive() {
    const res = await fetch(ARCHIVE_URL);
    const data = await res.json().catch(() => ({}));
    const raw = data.items || [];
    const items = purge(raw);
    if (items.length !== raw.length) await saveArchive(items);
    return items;
  }

  async function saveArchive(items) {
    await fetch(ARCHIVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: purge(items) })
    });
  }

  async function archivePush({ source, item, restoreMeta, label }) {
    const items = await loadArchive();
    const entry = {
      id: uid(),
      source,
      deletedAt: new Date().toISOString(),
      label: label || (item && (item.title || item.body)) || 'Untitled',
      restoreMeta: restoreMeta || {},
      item
    };
    if (typeof entry.label === 'string' && entry.label.length > 80) {
      entry.label = entry.label.replace(/<[^>]+>/g, '').slice(0, 80);
    }
    items.unshift(entry);
    await saveArchive(items);
    return entry;
  }

  async function archiveRecover(id) {
    const items = await loadArchive();
    const idx = items.findIndex(e => e.id === id);
    if (idx < 0) return null;
    const [entry] = items.splice(idx, 1);
    await saveArchive(items);
    return entry;
  }

  function showToast(msg) {
    let el = document.getElementById('ppcToast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ppcToast';
      el.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:100000;background:#2C2C2C;color:#F7F5F2;font-family:DM Sans,sans-serif;font-size:13px;padding:10px 18px;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,0.2);max-width:90vw;opacity:0;transition:opacity 0.2s;pointer-events:none;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { el.style.opacity = '0'; }, 3400);
  }

  function isDark() {
    return localStorage.getItem(DARK_KEY) === '1';
  }

  function applyStoredDark() {
    const on = isDark();
    document.body.classList.toggle('dark', on);
    return on;
  }

  function setDark(on) {
    localStorage.setItem(DARK_KEY, on ? '1' : '0');
    document.body.classList.toggle('dark', !!on);
    document.querySelectorAll('[data-ppc-dark-toggle]').forEach(btn => {
      btn.textContent = on ? 'Dark mode · On' : 'Dark mode · Off';
    });
    return !!on;
  }

  function toggleDark() {
    return setDark(!isDark());
  }

  function plannerWhere(item) {
    if (!item) return 'Annual Planner';
    const mi = item.m;
    let month = 'timeline';
    if (typeof mi === 'number') {
      const calMonth = (6 + mi) % 12;
      month = MONTH_SHORT[calMonth];
    }
    if (typeof item.day === 'number') return 'Annual Planner → ' + month + ' ' + item.day;
    return 'Annual Planner → ' + month;
  }

  function kanbanWhere(item) {
    const col = item && item.column;
    return 'Task Board → ' + (COLUMN_LABELS[col] || col || 'Board');
  }

  function marketingWhere(meta) {
    const kind = (meta && meta.kind) || 'idea';
    if (kind === 'prep') return 'Marketing → Preparation';
    if (kind === 'exec') return 'Marketing → Execution';
    if (kind === 'review') return 'Marketing → Review';
    if (kind === 'schedule') return 'Marketing → Calendar';
    if (kind === 'anchor') return 'Marketing → Events';
    return 'Marketing → Ideas';
  }

  async function restoreEntry(entry) {
    if (!entry || !entry.item) throw new Error('Nothing to restore');
    const item = entry.item;
    const meta = entry.restoreMeta || {};

    if (entry.source === 'kanban') {
      const res = await fetch('/api/kanban');
      const board = await res.json().catch(() => ({}));
      if (!Array.isArray(board.cards)) board.cards = [];
      if (!board.cards.some(c => c.id === item.id)) board.cards.push(item);
      await fetch('/api/kanban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(board)
      });
      return kanbanWhere(item);
    }

    if (entry.source === 'planner') {
      const res = await fetch('/api/data');
      const data = await res.json().catch(() => ({}));
      if (!Array.isArray(data.events)) data.events = [];
      if (!item.id) item.id = 'e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const dup = data.events.some(e => e.id === item.id);
      if (!dup) data.events.push(item);
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return plannerWhere(item);
    }

    if (entry.source === 'marketing') {
      const res = await fetch('/api/marketing');
      const data = await res.json().catch(() => ({}));
      if (!data.ideas) data.ideas = [];
      if (!data.sections) data.sections = { preparation: [], execution: [], review: [], schedule: [] };
      if (!Array.isArray(data.sections.preparation)) data.sections.preparation = [];
      if (!Array.isArray(data.sections.execution)) data.sections.execution = [];
      if (!Array.isArray(data.sections.review)) data.sections.review = [];
      if (!Array.isArray(data.sections.schedule)) data.sections.schedule = [];
      if (!Array.isArray(data.anchors)) data.anchors = [];

      const kind = meta.kind || 'idea';
      if (kind === 'idea') {
        if (!data.ideas.some(i => i.id === item.id)) data.ideas.push(item);
      } else if (kind === 'prep') {
        if (!data.sections.preparation.some(c => c.id === item.id)) data.sections.preparation.push(item);
      } else if (kind === 'exec') {
        if (!data.sections.execution.some(c => c.id === item.id)) data.sections.execution.push(item);
      } else if (kind === 'review') {
        if (!data.sections.review.some(c => c.id === item.id)) data.sections.review.push(item);
      } else if (kind === 'schedule') {
        if (!data.sections.schedule.some(c => c.id === item.id)) data.sections.schedule.push(item);
      } else if (kind === 'anchor') {
        if (!data.anchors.some(a => a.id === item.id)) data.anchors.push(item);
      }
      await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return marketingWhere(meta);
    }

    throw new Error('Unknown archive source');
  }

  function ensureStyles() {
    let style = document.getElementById('ppc-homebase-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'ppc-homebase-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
.ppc-settings-overlay {
  position: fixed; inset: 0; background: rgba(20,18,16,0.28); z-index: 9000;
  opacity: 0; pointer-events: none; transition: opacity 0.18s;
}
.ppc-settings-overlay.open { opacity: 1; pointer-events: auto; }
.ppc-settings-panel {
  position: fixed; top: 0; right: 0; width: min(380px, 100vw); height: 100vh;
  background: #F7F5F2; border-left: 1px solid #E2DDD5; z-index: 9001;
  transform: translateX(100%); transition: transform 0.2s ease;
  display: flex; flex-direction: column; font-family: 'DM Sans', sans-serif;
  overscroll-behavior: contain;
}
.ppc-settings-panel.open { transform: translateX(0); }
.ppc-settings-head {
  flex-shrink: 0; padding: 22px 20px 14px; font-size: 15px; font-weight: 700; color: #2C2C2C;
  border-bottom: 1px solid #E2DDD5; letter-spacing: 0.02em;
}
.ppc-settings-close {
  position: absolute; top: 14px; right: 14px; border: none; background: transparent;
  font-size: 22px; line-height: 1; color: #6B7A8D; cursor: pointer; z-index: 2;
}
.ppc-settings-body {
  flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
.ppc-settings-section {
  padding: 16px 20px; border-bottom: 1px solid #E2DDD5;
}
.ppc-settings-section h3 {
  margin: 0 0 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: #6B7A8D;
}
.ppc-settings-btn {
  display: block; width: 100%; text-align: left; padding: 10px 12px; margin-bottom: 8px;
  border: 1px solid #E2DDD5; border-radius: 8px; background: #fff; color: #2C2C2C;
  font: inherit; font-size: 12.5px; cursor: pointer;
}
.ppc-settings-btn:hover { border-color: #6B7A8D; }
.ppc-settings-btn:last-child { margin-bottom: 0; }
.ppc-settings-list { padding: 4px 0 8px; }
#ppcSettingsExtra[hidden] { display: none !important; }
.ppc-colour-toggle,
.ppc-archive-toggle,
.ppc-colour-section-toggle {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  width: 100%; margin: 0; padding: 0; border: none; background: transparent;
  font: inherit; cursor: pointer; text-align: left;
}
.ppc-colour-toggle,
.ppc-archive-toggle {
  margin: 0 0 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: #6B7A8D;
}
.ppc-archive-toggle { margin-bottom: 0; }
.ppc-colour-toggle .ppc-colour-chev,
.ppc-archive-toggle .ppc-colour-chev,
.ppc-colour-section-toggle .ppc-colour-chev {
  flex-shrink: 0; font-size: 10px; color: #9a958d; width: 12px; text-align: center;
}
.ppc-colour-panel[hidden],
.ppc-archive-panel[hidden],
.ppc-colour-section-body[hidden] { display: none !important; }
.ppc-archive-panel { margin-top: 6px; }
.ppc-colour-block { margin-bottom: 8px; border: 1px solid #E2DDD5; border-radius: 8px; background: #fff; overflow: hidden; }
.ppc-colour-section-toggle {
  padding: 8px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: #2C2C2C;
}
.ppc-colour-section-toggle:hover { background: #faf9f7; }
.ppc-colour-section-body { padding: 2px 10px 8px; border-top: 1px solid #E2DDD5; }
.ppc-colour-row {
  display: flex; align-items: center; gap: 8px; padding: 4px 0; position: relative;
}
.ppc-colour-row span {
  flex: 1; min-width: 0; font-size: 12px; font-weight: 600; color: #2C2C2C;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ppc-type-row {
  display: flex; align-items: center; gap: 6px; padding: 4px 0;
}
.ppc-type-input {
  flex: 1; min-width: 0; box-sizing: border-box;
  font: inherit; font-size: 12px; font-weight: 600; color: #2C2C2C;
  border: 1px solid transparent; border-radius: 5px;
  background: transparent; padding: 5px 8px;
}
.ppc-type-input:hover { border-color: #E2DDD5; background: #faf9f7; }
.ppc-type-input:focus {
  outline: none; border-color: #6B7A8D; background: #fff;
}
.ppc-type-del {
  flex-shrink: 0; width: 24px; height: 24px; padding: 0; border: none;
  border-radius: 4px; background: transparent; color: #b5b0a8;
  font-size: 16px; line-height: 1; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.ppc-type-del:hover { color: #8B3A3A; background: rgba(139, 58, 58, 0.08); }
.ppc-type-add {
  display: block; width: 100%; margin-top: 4px; padding: 6px 8px;
  border: 1px dashed #E2DDD5; border-radius: 6px; background: transparent;
  font: inherit; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
  color: #6B7A8D; cursor: pointer; text-align: left;
}
.ppc-type-add:hover { border-color: #6B7A8D; color: #2C2C2C; background: #faf9f7; }
.ppc-type-add[hidden] { display: none !important; }
.ppc-type-add-form {
  display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-wrap: wrap;
}
.ppc-type-add-form .ppc-type-input {
  flex: 1 1 120px; border-color: #E2DDD5; background: #fff;
}
.ppc-type-add-save,
.ppc-type-add-cancel {
  flex-shrink: 0; padding: 5px 10px; border-radius: 5px; font: inherit;
  font-size: 11px; font-weight: 600; cursor: pointer;
}
.ppc-type-add-save {
  border: 1px solid #2C2C2C; background: #2C2C2C; color: #fff;
}
.ppc-type-add-save:hover { background: #1a1a1a; }
.ppc-type-add-cancel {
  border: 1px solid #E2DDD5; background: #fff; color: #6B7A8D;
}
.ppc-type-add-cancel:hover { border-color: #6B7A8D; color: #2C2C2C; }
.ppc-colour-swatch {
  width: 28px; height: 28px; flex-shrink: 0; border: 1px solid #E2DDD5; border-radius: 6px;
  padding: 0; cursor: pointer; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35);
}
.ppc-colour-swatch:hover { border-color: #6B7A8D; }
.ppc-colour-swatch.is-open {
  outline: 2px solid #2C2C2C; outline-offset: 1px; border-color: #fff;
}
.ppc-colour-popover {
  position: fixed; z-index: 9500;
  width: 248px; padding: 10px; border: 1px solid #E2DDD5; border-radius: 10px;
  background: #F7F5F2; box-shadow: 0 10px 28px rgba(44,44,44,0.14);
  max-height: min(420px, calc(100vh - 24px)); overflow-y: auto;
}
.ppc-colour-popover-label {
  font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  color: #6B7A8D; margin: 0 0 8px;
}
.ppc-colour-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px;
}
.ppc-colour-grid button {
  width: 100%; aspect-ratio: 1; border-radius: 5px; border: 1.5px solid transparent;
  padding: 0; cursor: pointer; background-clip: padding-box;
}
.ppc-colour-grid button:hover { transform: scale(1.08); }
.ppc-colour-grid button.is-selected {
  border-color: #fff; outline: 2px solid #2C2C2C; outline-offset: -1px;
}
.ppc-archive-item {
  display: flex; gap: 10px; align-items: flex-start; padding: 12px 10px;
  border-bottom: 1px solid #E2DDD5;
}
.ppc-archive-meta { flex: 1; min-width: 0; }
.ppc-archive-title { font-size: 12.5px; font-weight: 600; color: #2C2C2C; line-height: 1.35; }
.ppc-archive-sub { font-size: 10px; color: #6B7A8D; margin-top: 3px; }
.ppc-archive-recover {
  flex-shrink: 0; border: 1px solid #E2DDD5; background: #fff; border-radius: 6px;
  padding: 6px 10px; font-size: 11px; cursor: pointer; color: #2C2C2C;
}
.ppc-archive-recover:hover { border-color: #6B7A8D; }
.ppc-archive-empty { padding: 22px 10px; font-size: 12px; color: #6B7A8D; }
body.ppc-settings-open { overflow: hidden; }
body.dark .ppc-settings-panel { background: #1e2538; border-left-color: #2e3a55; }
body.dark .ppc-settings-head, body.dark .ppc-archive-title { color: #f0ede8; }
body.dark .ppc-settings-head, body.dark .ppc-settings-section, body.dark .ppc-archive-item { border-color: #2e3a55; }
body.dark .ppc-settings-btn, body.dark .ppc-archive-recover { background: #141d2e; border-color: #2e3a55; color: #f0ede8; }
body.dark .ppc-archive-sub, body.dark .ppc-archive-empty, body.dark .ppc-settings-section h3,
body.dark .ppc-colour-toggle, body.dark .ppc-archive-toggle, body.dark .ppc-colour-popover-label { color: #8a8580; }
body.dark .ppc-colour-block, body.dark .ppc-colour-popover { background: #141d2e; border-color: #2e3a55; }
body.dark .ppc-colour-section-toggle { color: #f0ede8; }
body.dark .ppc-colour-section-toggle:hover { background: #1a2233; }
body.dark .ppc-colour-section-body { border-top-color: #2e3a55; }
body.dark .ppc-colour-row span { color: #f0ede8; }
body.dark .ppc-type-input { color: #f0ede8; }
body.dark .ppc-type-input:hover { background: #1a2233; border-color: #2e3a55; }
body.dark .ppc-type-input:focus { background: #141d2e; border-color: #6B7A8D; }
body.dark .ppc-type-del { color: #8a8580; }
body.dark .ppc-type-del:hover { color: #d48a8a; background: rgba(212, 138, 138, 0.12); }
body.dark .ppc-type-add { border-color: #2e3a55; color: #8a8580; }
body.dark .ppc-type-add:hover { border-color: #6B7A8D; color: #f0ede8; background: #1a2233; }
body.dark .ppc-type-add-form .ppc-type-input { background: #141d2e; border-color: #2e3a55; }
body.dark .ppc-type-add-save { border-color: #f0ede8; background: #f0ede8; color: #141d2e; }
body.dark .ppc-type-add-cancel { background: #141d2e; border-color: #2e3a55; color: #8a8580; }
body.dark .ppc-colour-swatch.is-open { outline-color: #f0ede8; }
body.dark .ppc-colour-grid button.is-selected { outline-color: #f0ede8; }
body.dark { background: #0f141f; color: #f0ede8; }
body.dark .header,
body.dark .nav-row,
body.dark .toolbar { background: #1a1f2e; border-color: #2e3a55; }
body.dark .nav-link { color: #8a8580; border: none; background: transparent; }
body.dark .nav-link:hover,
body.dark .nav-link.active { color: #f0ede8; background: transparent; }
body.dark .nav-settings-btn { color: #8a8580; border: none; background: transparent; }
body.dark .nav-settings-btn:hover { color: #f0ede8; background: transparent; }
body.dark .header-title,
body.dark .sub,
body.dark .board,
body.dark .section-title,
body.dark .section-row { color: #f0ede8; }
`;
  }

  function sourceLabel(source) {
    if (source === 'kanban') return 'Task Board';
    if (source === 'planner') return 'Annual Planner';
    if (source === 'marketing') return 'Marketing';
    return source || 'Unknown';
  }

  function daysLeft(deletedAt) {
    const left = ARCHIVE_TTL_MS - (Date.now() - new Date(deletedAt).getTime());
    return Math.max(0, Math.ceil(left / (24 * 60 * 60 * 1000)));
  }

  let _opts = { onRefresh: null, onAfterRecover: null };

  function isArchiveOpen() {
    try { return localStorage.getItem(ARCHIVE_OPEN_KEY) === '1'; }
    catch (e) { return false; }
  }

  function setArchiveOpen(open) {
    try { localStorage.setItem(ARCHIVE_OPEN_KEY, open ? '1' : '0'); }
    catch (e) { /* ignore */ }
  }

  function syncArchiveToggle(count) {
    const toggle = document.getElementById('ppcArchiveToggle');
    const panel = document.getElementById('ppcArchivePanel');
    if (!toggle || !panel) return;
    const open = isArchiveOpen();
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    const label = toggle.querySelector('.ppc-archive-label');
    const chev = toggle.querySelector('.ppc-colour-chev');
    if (label) {
      let n = count;
      if (typeof n !== 'number') {
        const m = (label.textContent || '').match(/·\s*(\d+)\s*$/);
        n = m ? Number(m[1]) : 0;
      }
      label.textContent = n > 0 ? 'Archive · ' + n : 'Archive';
    }
    if (chev) chev.textContent = open ? '▾' : '▸';
  }

  async function renderArchiveList() {
    const list = document.getElementById('ppcArchiveList');
    if (!list) return;
    list.innerHTML = '';
    let items = [];
    try { items = await loadArchive(); }
    catch (e) {
      syncArchiveToggle(0);
      list.innerHTML = '<div class="ppc-archive-empty">Could not load archive.</div>';
      return;
    }
    syncArchiveToggle(items.length);
    if (!items.length) {
      list.innerHTML = '<div class="ppc-archive-empty">Nothing in the archive. Deleted items stay here for 30 days.</div>';
      return;
    }
    items.forEach(entry => {
      const row = document.createElement('div');
      row.className = 'ppc-archive-item';
      const meta = document.createElement('div');
      meta.className = 'ppc-archive-meta';
      const title = document.createElement('div');
      title.className = 'ppc-archive-title';
      title.textContent = entry.label || 'Untitled';
      const sub = document.createElement('div');
      sub.className = 'ppc-archive-sub';
      sub.textContent = sourceLabel(entry.source) + ' · ' + daysLeft(entry.deletedAt) + 'd left';
      meta.appendChild(title);
      meta.appendChild(sub);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ppc-archive-recover';
      btn.textContent = 'Recover';
      btn.onclick = async () => {
        btn.disabled = true;
        try {
          const recovered = await archiveRecover(entry.id);
          if (!recovered) return;
          const where = await restoreEntry(recovered);
          showToast('Recovered to ' + where.replace(/^Recovered to /, ''));
          if (typeof _opts.onAfterRecover === 'function') await _opts.onAfterRecover(recovered);
          await renderArchiveList();
        } catch (err) {
          showToast('Recover failed');
          btn.disabled = false;
        }
      };
      row.appendChild(meta);
      row.appendChild(btn);
      list.appendChild(row);
    });
  }

  function openSettings() {
    ensureStyles();
    ensureDom();
    applyStoredDark();
    document.body.classList.add('ppc-settings-open');
    document.getElementById('ppcSettingsOverlay').classList.add('open');
    document.getElementById('ppcSettingsPanel').classList.add('open');
    const darkBtn = document.querySelector('[data-ppc-dark-toggle]');
    if (darkBtn) darkBtn.textContent = isDark() ? 'Dark mode · On' : 'Dark mode · Off';
    renderArchiveList();
    if (typeof _opts.onSettingsOpen === 'function') {
      try { _opts.onSettingsOpen(document.getElementById('ppcSettingsPanel')); }
      catch (err) { console.warn('Settings extra failed:', err); }
    }
  }

  function closeSettings() {
    document.body.classList.remove('ppc-settings-open');
    const o = document.getElementById('ppcSettingsOverlay');
    const p = document.getElementById('ppcSettingsPanel');
    if (o) o.classList.remove('open');
    if (p) p.classList.remove('open');
  }

  function ensureDom() {
    const existing = document.getElementById('ppcSettingsPanel');
    if (existing && existing.querySelector('#ppcSettingsBody') && existing.querySelector('#ppcArchiveToggle')) {
      ensureStyles();
      return;
    }
    if (existing) existing.remove();
    const oldOverlay = document.getElementById('ppcSettingsOverlay');
    if (oldOverlay) oldOverlay.remove();
    ensureStyles();
    const overlay = document.createElement('div');
    overlay.className = 'ppc-settings-overlay';
    overlay.id = 'ppcSettingsOverlay';
    overlay.onclick = closeSettings;
    const panel = document.createElement('div');
    panel.className = 'ppc-settings-panel';
    panel.id = 'ppcSettingsPanel';
    const archiveOpen = isArchiveOpen();
    panel.innerHTML = `
      <button type="button" class="ppc-settings-close" aria-label="Close">&times;</button>
      <div class="ppc-settings-head">Settings</div>
      <div class="ppc-settings-body" id="ppcSettingsBody">
        <div class="ppc-settings-section">
          <h3>Preferences</h3>
          <button type="button" class="ppc-settings-btn" data-ppc-dark-toggle>Dark mode · Off</button>
          <button type="button" class="ppc-settings-btn" data-ppc-refresh>Refresh</button>
        </div>
        <div class="ppc-settings-section" id="ppcSettingsExtra" hidden></div>
        <div class="ppc-settings-section" style="border-bottom:none;">
          <button type="button" class="ppc-archive-toggle" id="ppcArchiveToggle" aria-expanded="${archiveOpen ? 'true' : 'false'}">
            <span class="ppc-archive-label">Archive</span>
            <span class="ppc-colour-chev">${archiveOpen ? '▾' : '▸'}</span>
          </button>
          <div class="ppc-archive-panel" id="ppcArchivePanel"${archiveOpen ? '' : ' hidden'}>
            <div class="ppc-settings-list" id="ppcArchiveList"></div>
          </div>
        </div>
      </div>
    `;
    panel.querySelector('.ppc-settings-close').onclick = closeSettings;
    panel.querySelector('[data-ppc-dark-toggle]').onclick = () => toggleDark();
    panel.querySelector('[data-ppc-refresh]').onclick = async () => {
      closeSettings();
      if (typeof _opts.onRefresh === 'function') await _opts.onRefresh();
      else location.reload();
    };
    panel.querySelector('#ppcArchiveToggle').onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const next = !isArchiveOpen();
      setArchiveOpen(next);
      syncArchiveToggle();
    };
    panel.addEventListener('wheel', e => { e.stopPropagation(); }, { passive: true });
    panel.addEventListener('touchmove', e => { e.stopPropagation(); }, { passive: true });
    document.body.appendChild(overlay);
    document.body.appendChild(panel);
  }

  function mountSettings(opts) {
    _opts = opts || {};
    ensureStyles();
    applyStoredDark();
    ensureDom();

    let btn = document.getElementById('settingsBtn');
    if (!btn) {
      const nav = document.querySelector('.nav-row');
      if (nav) {
        if (getComputedStyle(nav).position === 'static') nav.style.position = 'relative';
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-settings-btn';
        btn.id = 'settingsBtn';
        btn.title = 'Settings';
        btn.setAttribute('aria-label', 'Settings');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
        nav.appendChild(btn);
      }
    }
    if (btn) {
      btn.onclick = (e) => { e.preventDefault(); openSettings(); };
    }
  }

  global.PPC = {
    archivePush,
    archiveRecover,
    loadArchive,
    restoreEntry,
    showToast,
    applyStoredDark,
    setDark,
    toggleDark,
    isDark,
    openSettings,
    closeSettings,
    mountSettings,
    plannerWhere,
    kanbanWhere,
    marketingWhere
  };
})(window);
