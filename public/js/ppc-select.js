/* Shared Homebase custom select + date — lift menus, optional per-option colour. */
(function (global) {
  if (global.createPpcSelect) return;

  const STYLE_ID = 'ppc-select-styles';
  const CSS = `
.ppc-select { position: relative; width: 100%; }
.ppc-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid #EAE2D6;
  border-radius: 7px;
  padding: 6px 9px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  color: #2C2C2C;
  transition: border-color 0.12s, box-shadow 0.12s;
  min-height: 34px;
  box-sizing: border-box;
}
.ppc-select.open .ppc-select-trigger,
.ppc-select-trigger:hover {
  border-color: #cfc8bc;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.ppc-select-trigger .ppc-label { flex: 1; min-width: 0; }
.ppc-select-trigger .ppc-chev {
  flex-shrink: 0;
  font-size: 10px;
  color: #9a958d;
  line-height: 1;
}
.ppc-select-menu {
  display: none;
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border: 1px solid #EAE2D6;
  border-radius: 8px;
  box-shadow: 0 10px 28px rgba(44,44,44,0.12);
  padding: 5px;
  max-height: 260px;
  overflow-y: auto;
}
.ppc-select.open .ppc-select-menu { display: block; }
.ppc-select-option {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  text-align: left;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #2C2C2C;
  transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}
.ppc-select-option:hover,
.ppc-select-option.is-selected {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  background: var(--opt-tint, rgba(0,0,0,0.04));
}
.ppc-select.ppc-select--bare .ppc-select-trigger {
  border: none;
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 500;
  background: transparent;
  box-shadow: none;
  min-height: 0;
}
.ppc-select.ppc-select--bare.open .ppc-select-trigger,
.ppc-select.ppc-select--bare .ppc-select-trigger:hover {
  background: #f8f6f3;
  border: none;
  box-shadow: none;
}
body.dark .ppc-select-trigger {
  background: transparent;
  color: #f0ede8;
  border-color: #3a4560;
}
body.dark .ppc-select.ppc-select--bare.open .ppc-select-trigger,
body.dark .ppc-select.ppc-select--bare .ppc-select-trigger:hover {
  background: #252e45;
}
body.dark .ppc-select-menu {
  background: #1e2638;
  border-color: #3a4560;
  box-shadow: 0 10px 28px rgba(0,0,0,0.35);
}
body.dark .ppc-select-option { color: #f0ede8; }

.ppc-date { position: relative; width: 100%; }
.ppc-date-menu {
  display: none;
  position: fixed;
  z-index: 9200;
  width: 280px;
  background: #fff;
  border: 1px solid #E5E1DA;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(44,44,44,0.10);
  padding: 12px;
  box-sizing: border-box;
}
.ppc-date.open .ppc-date-menu,
.ppc-date-menu.is-open { display: block; }
.ppc-date-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 10px;
}
.ppc-date-nav-title {
  flex: 1;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: #3a3a3a;
  text-align: center;
  letter-spacing: 0.01em;
}
.ppc-date-nav button {
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  width: 30px;
  height: 30px;
  border: 1px solid #E5E1DA;
  border-radius: 7px;
  background: #fff;
  color: #8a8580;
  cursor: pointer;
}
.ppc-date-nav button:hover {
  border-color: #cfc8bc;
  color: #2C2C2C;
}
.ppc-date-dow,
.ppc-date-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}
.ppc-date-dow span {
  font-family: 'DM Sans', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9a958d;
  text-align: center;
  padding: 6px 0 8px;
}
.ppc-date-day {
  font-family: 'DM Sans', sans-serif;
  font-size: 12.5px;
  font-weight: 600;
  border: none;
  background: transparent;
  border-radius: 7px;
  height: 32px;
  color: #2C2C2C;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px transparent;
}
.ppc-date-day:hover { background: #f7f5f2; }
.ppc-date-day.is-other { color: #c4bfb7; font-weight: 500; }
.ppc-date-day.is-today { box-shadow: inset 0 0 0 1px #4E6E6C; }
.ppc-date-day.is-selected {
  background: #fff;
  color: #2C2C2C;
  box-shadow: inset 0 0 0 1.5px #4E6E6C;
}
.ppc-date-day.is-selected:hover { background: #f4f7f6; color: #2C2C2C; }
.ppc-date-day.is-selected.is-today { box-shadow: inset 0 0 0 1.5px #4E6E6C; }
.ppc-date-footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #EFEBE4;
}
.ppc-date-footer button {
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  background: transparent;
  color: #5B6B8C;
  cursor: pointer;
  padding: 4px 2px;
}
.ppc-date-footer button:hover { color: #2C2C2C; }
.ppc-datetime {
  display: flex;
  gap: 8px;
  align-items: stretch;
  width: 100%;
}
.ppc-datetime .ppc-date { flex: 1; min-width: 0; }
.ppc-datetime-time {
  width: 104px;
  flex-shrink: 0;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  border: 1px solid #EAE2D6;
  border-radius: 6px;
  padding: 8px 10px;
  background: #fff;
  color: #2C2C2C;
  box-sizing: border-box;
}
body.dark .ppc-date-menu {
  background: #1e2638;
  border-color: #3a4560;
  box-shadow: 0 10px 28px rgba(0,0,0,0.35);
}
body.dark .ppc-date-nav-title { color: #f0ede8; }
body.dark .ppc-date-nav button {
  background: transparent;
  border-color: #3a4560;
  color: #c8c4bc;
}
body.dark .ppc-date-day { color: #f0ede8; }
body.dark .ppc-date-day:hover { background: #252e45; }
body.dark .ppc-date-day.is-other { color: #6B7A8D; }
body.dark .ppc-date-day.is-today { box-shadow: inset 0 0 0 1px #4E6E6C; }
body.dark .ppc-date-day.is-selected {
  background: transparent;
  color: #f0ede8;
  box-shadow: inset 0 0 0 1.5px #4E6E6C;
}
body.dark .ppc-date-footer { border-top-color: #3a4560; }
body.dark .ppc-date-footer button { color: #8fa0b8; }
body.dark .ppc-datetime-time {
  background: #141d2e;
  border-color: #2e3a55;
  color: #f0ede8;
}
`;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function hexToRgba(hex, alpha) {
    const raw = String(hex || '').replace('#', '');
    const full = raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw;
    if (full.length !== 6) return 'rgba(0,0,0,' + alpha + ')';
    const n = parseInt(full, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alpha + ')';
  }

  function closePpcSelects(except) {
    document.querySelectorAll('.ppc-select.open, .ppc-date.open').forEach(el => {
      if (el !== except) {
        el.classList.remove('open');
        // Return portaled date menus to their wrap
        if (el.classList.contains('ppc-date')) {
          const menu = el._ppcDateMenu;
          if (menu) {
            menu.classList.remove('is-open');
            if (menu.parentElement !== el) el.appendChild(menu);
            menu.style.left = '';
            menu.style.top = '';
          }
        }
      }
    });
  }

  function normalizeOptions(options, includeNone, noneLabel) {
    const all = [];
    if (includeNone) all.push({ id: '', label: noneLabel || 'None', color: null });
    (options || []).forEach(opt => {
      if (typeof opt === 'string') {
        all.push({ id: opt, label: opt, color: null });
      } else {
        all.push({
          id: opt.id != null ? String(opt.id) : '',
          label: opt.label != null ? String(opt.label) : String(opt.id || ''),
          color: opt.color || null
        });
      }
    });
    return all;
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function isoFromParts(y, m0, d) {
    return y + '-' + pad2(m0 + 1) + '-' + pad2(d);
  }

  function parseIsoDate(iso) {
    if (!iso) return null;
    const s = String(iso).slice(0, 10);
    const parts = s.split('-').map(Number);
    if (parts.length < 3 || !parts[0]) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  function formatDisplayDate(iso) {
    const d = parseIsoDate(iso);
    if (!d) return '';
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function createPpcDate({ id, value, placeholder, onChange }) {
    ensureStyles();
    const wrap = document.createElement('div');
    wrap.className = 'ppc-date';
    wrap.dataset.ppcDateId = id || '';

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    if (id) hidden.id = id;
    hidden.value = value ? String(value).slice(0, 10) : '';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ppc-select-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');

    const labelEl = document.createElement('span');
    labelEl.className = 'ppc-label';
    const chev = document.createElement('span');
    chev.className = 'ppc-chev';
    chev.textContent = '▾';
    trigger.appendChild(labelEl);
    trigger.appendChild(chev);

    const menu = document.createElement('div');
    menu.className = 'ppc-date-menu';

    const seed = parseIsoDate(hidden.value) || new Date();
    let viewYear = seed.getFullYear();
    let viewMonth = seed.getMonth();

    function syncLabel() {
      const text = formatDisplayDate(hidden.value);
      labelEl.textContent = text || (placeholder || 'Pick a date');
      labelEl.style.color = text ? '' : '#9a958d';
      labelEl.style.fontWeight = text ? '' : '500';
    }

    function positionMenu() {
      if (!wrap.classList.contains('open')) return;
      const rect = trigger.getBoundingClientRect();
      const menuW = 280;
      const pad = 8;
      const mh = menu.offsetHeight || 320;
      let left = rect.left;
      let top = rect.bottom + 5;
      if (left + menuW > window.innerWidth - pad) {
        left = Math.max(pad, rect.right - menuW);
      }
      if (left < pad) left = pad;
      if (top + mh > window.innerHeight - pad) {
        top = Math.max(pad, rect.top - mh - 5);
      }
      menu.style.left = Math.round(left) + 'px';
      menu.style.top = Math.round(top) + 'px';
    }

    function setOpen(open) {
      wrap.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        closePpcSelects(wrap);
        const cur = parseIsoDate(hidden.value);
        if (cur) {
          viewYear = cur.getFullYear();
          viewMonth = cur.getMonth();
        }
        // Portal to body — panel uses transform, which breaks position:fixed + clips overflow.
        if (menu.parentElement !== document.body) document.body.appendChild(menu);
        menu.classList.add('is-open');
        rebuildCalendar();
        positionMenu();
      } else {
        menu.classList.remove('is-open');
        if (menu.parentElement !== wrap) wrap.appendChild(menu);
        menu.style.left = '';
        menu.style.top = '';
      }
    }

    function setValue(iso, fire) {
      hidden.value = iso ? String(iso).slice(0, 10) : '';
      syncLabel();
      if (fire && typeof onChange === 'function') onChange(hidden.value);
    }

    function rebuildCalendar() {
      menu.innerHTML = '';
      const nav = document.createElement('div');
      nav.className = 'ppc-date-nav';
      const prev = document.createElement('button');
      prev.type = 'button';
      prev.textContent = '‹';
      prev.setAttribute('aria-label', 'Previous month');
      const next = document.createElement('button');
      next.type = 'button';
      next.textContent = '›';
      next.setAttribute('aria-label', 'Next month');
      const title = document.createElement('div');
      title.className = 'ppc-date-nav-title';
      title.textContent = new Date(viewYear, viewMonth, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      prev.addEventListener('click', e => {
        e.stopPropagation();
        viewMonth -= 1;
        if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
        rebuildCalendar();
        positionMenu();
      });
      next.addEventListener('click', e => {
        e.stopPropagation();
        viewMonth += 1;
        if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
        rebuildCalendar();
        positionMenu();
      });
      nav.appendChild(prev);
      nav.appendChild(title);
      nav.appendChild(next);
      menu.appendChild(nav);

      const dow = document.createElement('div');
      dow.className = 'ppc-date-dow';
      ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach(d => {
        const s = document.createElement('span');
        s.textContent = d;
        dow.appendChild(s);
      });
      menu.appendChild(dow);

      const grid = document.createElement('div');
      grid.className = 'ppc-date-grid';
      const first = new Date(viewYear, viewMonth, 1);
      const startPad = (first.getDay() + 6) % 7;
      const today = new Date();
      const todayKey = isoFromParts(today.getFullYear(), today.getMonth(), today.getDate());
      const selected = hidden.value;

      for (let i = 0; i < 42; i++) {
        const dayNum = i - startPad + 1;
        const cellDate = new Date(viewYear, viewMonth, dayNum);
        const y = cellDate.getFullYear();
        const m = cellDate.getMonth();
        const d = cellDate.getDate();
        const key = isoFromParts(y, m, d);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ppc-date-day';
        btn.textContent = String(d);
        if (m !== viewMonth) btn.classList.add('is-other');
        if (key === todayKey) btn.classList.add('is-today');
        if (selected && key === selected) btn.classList.add('is-selected');
        btn.addEventListener('click', e => {
          e.stopPropagation();
          setValue(key, true);
          setOpen(false);
        });
        grid.appendChild(btn);
      }
      menu.appendChild(grid);

      const foot = document.createElement('div');
      foot.className = 'ppc-date-footer';
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.textContent = 'Clear';
      clearBtn.addEventListener('click', e => {
        e.stopPropagation();
        setValue('', true);
        setOpen(false);
      });
      const todayBtn = document.createElement('button');
      todayBtn.type = 'button';
      todayBtn.textContent = 'Today';
      todayBtn.addEventListener('click', e => {
        e.stopPropagation();
        setValue(todayKey, true);
        viewYear = today.getFullYear();
        viewMonth = today.getMonth();
        setOpen(false);
      });
      foot.appendChild(clearBtn);
      foot.appendChild(todayBtn);
      menu.appendChild(foot);
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      setOpen(!wrap.classList.contains('open'));
    });

    wrap.appendChild(hidden);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    wrap._ppcDateMenu = menu;
    syncLabel();

    wrap._ppcSetDate = function (iso) {
      setValue(iso || '', false);
      const cur = parseIsoDate(hidden.value);
      if (cur) {
        viewYear = cur.getFullYear();
        viewMonth = cur.getMonth();
      }
    };

    return wrap;
  }

  function setPpcDateValue(id, value) {
    const hidden = document.getElementById(id);
    if (!hidden) return false;
    const wrap = hidden.closest('.ppc-date');
    if (wrap && typeof wrap._ppcSetDate === 'function') {
      wrap._ppcSetDate(value || '');
      return true;
    }
    hidden.value = value ? String(value).slice(0, 10) : '';
    return true;
  }

  /** Swap a native <input type="date"> for the shared ppc-date picker. */
  function replaceNativeDate(inputEl, opts) {
    if (!inputEl || inputEl.tagName !== 'INPUT') return null;
    if (inputEl.closest('.ppc-date') || inputEl.dataset.ppcDateReplaced === '1') return null;
    const options = opts || {};
    const id = inputEl.id;
    const wrap = createPpcDate({
      id,
      value: inputEl.value || '',
      placeholder: options.placeholder || inputEl.getAttribute('placeholder') || 'Pick a date',
      onChange: val => {
        if (typeof options.onChange === 'function') options.onChange(val);
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    if (inputEl.className) wrap.className = (wrap.className + ' ' + inputEl.className).trim();
    if (inputEl.style && inputEl.style.cssText) wrap.style.cssText = inputEl.style.cssText;
    inputEl.dataset.ppcDateReplaced = '1';
    inputEl.replaceWith(wrap);
    return wrap;
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function splitDateTimeLocal(value) {
    const raw = String(value || '');
    const m = raw.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
    if (!m) return { date: '', time: '17:00' };
    return { date: m[1], time: (m[2] != null ? m[2] + ':' + m[3] : '17:00') };
  }

  /** Date + time control that keeps a datetime-local-compatible hidden value. */
  function createPpcDateTime({ id, value, placeholder, onChange, defaultTime }) {
    ensureStyles();
    const initial = splitDateTimeLocal(value);
    const fallbackTime = defaultTime || '17:00';
    const outer = document.createElement('div');
    outer.className = 'ppc-datetime';

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    if (id) hidden.id = id;

    const dateId = (id || 'ppcDt') + '__date';
    const dateWrap = createPpcDate({
      id: dateId,
      value: initial.date,
      placeholder: placeholder || 'Pick a date',
      onChange: () => syncFromParts(true)
    });

    const time = document.createElement('input');
    time.type = 'time';
    time.className = 'ppc-datetime-time';
    time.value = initial.time || fallbackTime;
    time.setAttribute('aria-label', 'Time');
    time.addEventListener('change', () => syncFromParts(true));
    time.addEventListener('input', () => syncFromParts(false));

    function syncFromParts(fire) {
      const dateEl = document.getElementById(dateId);
      const date = dateEl ? dateEl.value : '';
      const t = time.value || fallbackTime;
      hidden.value = date ? (date + 'T' + t) : '';
      if (fire && typeof onChange === 'function') onChange(hidden.value);
    }

    syncFromParts(false);
    outer.appendChild(hidden);
    outer.appendChild(dateWrap);
    outer.appendChild(time);

    outer._ppcSetDateTime = function (isoLocal) {
      const parts = splitDateTimeLocal(isoLocal);
      setPpcDateValue(dateId, parts.date);
      time.value = parts.time || fallbackTime;
      syncFromParts(false);
    };

    return outer;
  }

  function setPpcDateTimeValue(id, value) {
    const hidden = document.getElementById(id);
    if (!hidden) return false;
    const wrap = hidden.closest('.ppc-datetime');
    if (wrap && typeof wrap._ppcSetDateTime === 'function') {
      wrap._ppcSetDateTime(value || '');
      return true;
    }
    hidden.value = value || '';
    return true;
  }

  /** Swap a native <input type="datetime-local"> for ppc-date + time. */
  function replaceNativeDateTimeLocal(inputEl, opts) {
    if (!inputEl || inputEl.tagName !== 'INPUT') return null;
    if (inputEl.closest('.ppc-datetime') || inputEl.dataset.ppcDateReplaced === '1') return null;
    const options = opts || {};
    const id = inputEl.id;
    const wrap = createPpcDateTime({
      id,
      value: inputEl.value || '',
      placeholder: options.placeholder || 'Pick a date',
      defaultTime: options.defaultTime,
      onChange: val => {
        if (typeof options.onChange === 'function') options.onChange(val);
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    inputEl.dataset.ppcDateReplaced = '1';
    inputEl.replaceWith(wrap);
    return wrap;
  }

  function createPpcSelect({
    id,
    options,
    value,
    includeNone,
    noneLabel,
    onChange,
    onRename,
    renamable,
    colored,
    bare
  }) {
    ensureStyles();
    const wrap = document.createElement('div');
    wrap.className = 'ppc-select' + (bare ? ' ppc-select--bare' : '');
    wrap.dataset.ppcSelectId = id || '';

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    if (id) hidden.id = id;
    hidden.value = value != null ? String(value) : '';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'ppc-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const labelEl = document.createElement('span');
    labelEl.className = 'ppc-label';
    const chev = document.createElement('span');
    chev.className = 'ppc-chev';
    chev.textContent = '▾';
    trigger.appendChild(labelEl);
    trigger.appendChild(chev);

    const menu = document.createElement('div');
    menu.className = 'ppc-select-menu';
    menu.setAttribute('role', 'listbox');

    let allOpts = normalizeOptions(options, includeNone, noneLabel);
    let renameFn = typeof onRename === 'function' ? onRename : null;
    let canRename = !!renamable || !!renameFn;

    function useColor(opt) {
      return !!(colored && opt && opt.color);
    }

    function optionRenamable(opt) {
      if (!canRename || !opt) return false;
      if (opt.id === '' || String(opt.id).indexOf('__') === 0) return false;
      return true;
    }

    function syncUI() {
      const cur = allOpts.find(o => o.id === hidden.value) || allOpts[0] || { label: noneLabel || 'None', color: null };
      labelEl.textContent = cur.label;
      labelEl.style.color = useColor(cur) ? cur.color : '';
      menu.querySelectorAll('.ppc-select-option').forEach(el => {
        el.classList.toggle('is-selected', el.dataset.value === hidden.value);
      });
    }

    function setOpen(open) {
      wrap.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) closePpcSelects(wrap);
    }

    function startOptionRename(btn, opt) {
      if (!optionRenamable(opt) || !renameFn) return;
      const prev = opt.label;
      btn.contentEditable = 'true';
      btn.focus();
      try {
        const range = document.createRange();
        range.selectNodeContents(btn);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } catch (_) {}

      let done = false;
      function finish(commit) {
        if (done) return;
        done = true;
        btn.contentEditable = 'false';
        btn.removeEventListener('blur', onBlur);
        btn.removeEventListener('keydown', onKey);
        const next = (btn.textContent || '').trim().slice(0, 40);
        if (!commit || !next || next === prev) {
          btn.textContent = prev;
          syncUI();
          return;
        }
        const result = renameFn(opt.id, next);
        if (result === false) {
          btn.textContent = prev;
          syncUI();
          return;
        }
        opt.label = next;
        const hit = allOpts.find(o => o.id === opt.id);
        if (hit) hit.label = next;
        syncUI();
      }
      function onBlur() { finish(true); }
      function onKey(e) {
        e.stopPropagation();
        if (e.key === 'Enter') {
          e.preventDefault();
          finish(true);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          finish(false);
        }
      }
      btn.addEventListener('blur', onBlur);
      btn.addEventListener('keydown', onKey);
    }

    function rebuildMenu() {
      menu.innerHTML = '';
      allOpts.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'ppc-select-option';
        btn.dataset.value = opt.id;
        btn.textContent = opt.label;
        if (useColor(opt)) {
          btn.style.color = opt.color;
          btn.style.setProperty('--opt-tint', hexToRgba(opt.color, 0.12));
        }
        btn.setAttribute('role', 'option');
        if (optionRenamable(opt)) {
          btn.title = (btn.title || '') + (btn.title ? ' · ' : '') + 'Double-click to rename';
        }
        btn.addEventListener('click', e => {
          if (btn.isContentEditable) {
            e.stopPropagation();
            return;
          }
          e.stopPropagation();
          hidden.value = opt.id;
          syncUI();
          setOpen(false);
          if (typeof onChange === 'function') onChange(hidden.value);
        });
        btn.addEventListener('dblclick', e => {
          if (!optionRenamable(opt)) return;
          e.preventDefault();
          e.stopPropagation();
          startOptionRename(btn, opt);
        });
        menu.appendChild(btn);
      });
      syncUI();
    }

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      setOpen(!wrap.classList.contains('open'));
    });

    wrap.appendChild(hidden);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    rebuildMenu();

    wrap._ppcUpdate = function ({ options: nextOpts, value: nextVal, includeNone: nextNone, noneLabel: nextNoneLabel, colored: nextColored, onRename: nextRename, renamable: nextRenamable }) {
      if (nextColored != null) colored = nextColored;
      if (nextRename !== undefined) renameFn = typeof nextRename === 'function' ? nextRename : null;
      if (nextRenamable != null) canRename = !!nextRenamable || !!renameFn;
      else canRename = !!renamable || !!renameFn;
      if (nextOpts) allOpts = normalizeOptions(nextOpts, nextNone != null ? nextNone : includeNone, nextNoneLabel || noneLabel);
      if (nextVal != null) hidden.value = String(nextVal);
      rebuildMenu();
    };

    return wrap;
  }

  function updatePpcSelect(id, patch) {
    const hidden = document.getElementById(id);
    if (!hidden) return false;
    const wrap = hidden.closest('.ppc-select');
    if (!wrap || typeof wrap._ppcUpdate !== 'function') return false;
    wrap._ppcUpdate(patch || {});
    return true;
  }

  function setPpcSelectValue(id, value) {
    return updatePpcSelect(id, { value: value != null ? String(value) : '' });
  }

  function replaceNativeSelect(selectEl, opts) {
    if (!selectEl || selectEl.tagName !== 'SELECT') return null;
    const options = Array.from(selectEl.options).map(o => ({
      id: o.value,
      label: o.textContent,
      color: opts && opts.colorMap ? opts.colorMap[o.value] : null
    }));
    const wrap = createPpcSelect({
      id: selectEl.id,
      options,
      value: selectEl.value,
      includeNone: false,
      colored: !!(opts && opts.colored),
      bare: !!(opts && opts.bare),
      onChange: opts && opts.onChange
    });
    selectEl.replaceWith(wrap);
    return wrap;
  }

  if (!global._ppcSelectClickBound) {
    global._ppcSelectClickBound = true;
    document.addEventListener('click', e => {
      if (!e.target.closest('.ppc-select, .ppc-date, .ppc-date-menu, .ppc-datetime')) closePpcSelects();
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const open = document.querySelector('.ppc-select.open, .ppc-date.open');
      if (open) {
        closePpcSelects();
        e.preventDefault();
      }
    });
  }

  global.createPpcSelect = createPpcSelect;
  global.createPpcDate = createPpcDate;
  global.createPpcDateTime = createPpcDateTime;
  global.updatePpcSelect = updatePpcSelect;
  global.setPpcSelectValue = setPpcSelectValue;
  global.setPpcDateValue = setPpcDateValue;
  global.setPpcDateTimeValue = setPpcDateTimeValue;
  global.replaceNativeSelect = replaceNativeSelect;
  global.replaceNativeDate = replaceNativeDate;
  global.replaceNativeDateTimeLocal = replaceNativeDateTimeLocal;
  global.closePpcSelects = closePpcSelects;
})(typeof window !== 'undefined' ? window : globalThis);
