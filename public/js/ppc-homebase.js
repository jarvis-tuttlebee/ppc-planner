/* Shared Homebase helpers: archive (30-day soft-delete), dark mode, toast, Settings panel. */
(function (global) {
  const ARCHIVE_URL = '/api/archive';
  const ARCHIVE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
  const DARK_KEY = 'ppc-dark-mode';

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
    if (document.getElementById('ppc-homebase-styles')) return;
    const style = document.createElement('style');
    style.id = 'ppc-homebase-styles';
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
}
.ppc-settings-panel.open { transform: translateX(0); }
.ppc-settings-head {
  padding: 22px 20px 14px; font-size: 15px; font-weight: 700; color: #2C2C2C;
  border-bottom: 1px solid #E2DDD5; letter-spacing: 0.02em;
}
.ppc-settings-close {
  position: absolute; top: 14px; right: 14px; border: none; background: transparent;
  font-size: 22px; line-height: 1; color: #6B7A8D; cursor: pointer;
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
.ppc-settings-list { flex: 1; overflow-y: auto; padding: 8px 12px 24px; }
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
body.dark .ppc-settings-panel { background: #1e2538; border-left-color: #2e3a55; }
body.dark .ppc-settings-head, body.dark .ppc-archive-title { color: #f0ede8; }
body.dark .ppc-settings-head, body.dark .ppc-settings-section, body.dark .ppc-archive-item { border-color: #2e3a55; }
body.dark .ppc-settings-btn, body.dark .ppc-archive-recover { background: #141d2e; border-color: #2e3a55; color: #f0ede8; }
body.dark .ppc-archive-sub, body.dark .ppc-archive-empty, body.dark .ppc-settings-section h3 { color: #8a8580; }
/* Lightweight dark surfaces for apps without a full theme */
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
    document.head.appendChild(style);
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

  async function renderArchiveList() {
    const list = document.getElementById('ppcArchiveList');
    if (!list) return;
    list.innerHTML = '';
    let items = [];
    try { items = await loadArchive(); }
    catch (e) {
      list.innerHTML = '<div class="ppc-archive-empty">Could not load archive.</div>';
      return;
    }
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
    document.getElementById('ppcSettingsOverlay').classList.add('open');
    document.getElementById('ppcSettingsPanel').classList.add('open');
    const darkBtn = document.querySelector('[data-ppc-dark-toggle]');
    if (darkBtn) darkBtn.textContent = isDark() ? 'Dark mode · On' : 'Dark mode · Off';
    renderArchiveList();
  }

  function closeSettings() {
    const o = document.getElementById('ppcSettingsOverlay');
    const p = document.getElementById('ppcSettingsPanel');
    if (o) o.classList.remove('open');
    if (p) p.classList.remove('open');
  }

  function ensureDom() {
    if (document.getElementById('ppcSettingsPanel')) return;
    ensureStyles();
    const overlay = document.createElement('div');
    overlay.className = 'ppc-settings-overlay';
    overlay.id = 'ppcSettingsOverlay';
    overlay.onclick = closeSettings;
    const panel = document.createElement('div');
    panel.className = 'ppc-settings-panel';
    panel.id = 'ppcSettingsPanel';
    panel.innerHTML = `
      <button type="button" class="ppc-settings-close" aria-label="Close">&times;</button>
      <div class="ppc-settings-head">Settings</div>
      <div class="ppc-settings-section">
        <h3>Preferences</h3>
        <button type="button" class="ppc-settings-btn" data-ppc-dark-toggle>Dark mode · Off</button>
        <button type="button" class="ppc-settings-btn" data-ppc-refresh>Refresh</button>
      </div>
      <div class="ppc-settings-section" style="border-bottom:none;padding-bottom:4px;">
        <h3>Archive</h3>
      </div>
      <div class="ppc-settings-list" id="ppcArchiveList"></div>
    `;
    panel.querySelector('.ppc-settings-close').onclick = closeSettings;
    panel.querySelector('[data-ppc-dark-toggle]').onclick = () => toggleDark();
    panel.querySelector('[data-ppc-refresh]').onclick = async () => {
      closeSettings();
      if (typeof _opts.onRefresh === 'function') await _opts.onRefresh();
      else location.reload();
    };
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
