/* Shared Homebase custom select — lift menu, optional per-option colour. */
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
    document.querySelectorAll('.ppc-select.open').forEach(el => {
      if (el !== except) el.classList.remove('open');
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

  function createPpcSelect({
    id,
    options,
    value,
    includeNone,
    noneLabel,
    onChange,
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

    function useColor(opt) {
      return !!(colored && opt && opt.color);
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
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const prev = hidden.value;
          hidden.value = opt.id;
          syncUI();
          setOpen(false);
          if (prev !== hidden.value) {
            hidden.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof onChange === 'function') onChange(hidden.value);
          }
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

    wrap._ppcUpdate = function ({ options: nextOpts, value: nextVal, includeNone: nextNone, noneLabel: nextNoneLabel, colored: nextColored }) {
      if (nextColored != null) colored = nextColored;
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
      if (!e.target.closest('.ppc-select')) closePpcSelects();
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      const open = document.querySelector('.ppc-select.open');
      if (open) {
        open.classList.remove('open');
        e.preventDefault();
      }
    });
  }

  global.createPpcSelect = createPpcSelect;
  global.updatePpcSelect = updatePpcSelect;
  global.setPpcSelectValue = setPpcSelectValue;
  global.replaceNativeSelect = replaceNativeSelect;
  global.closePpcSelects = closePpcSelects;
})(typeof window !== 'undefined' ? window : globalThis);
