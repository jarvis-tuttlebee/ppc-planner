# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or Cursor. Keep entries short. Newest session at the top.

---

## 2026-08-03 — Cal labels wrap + multi assignees (Cursor)

### What was built or decided
- Marketing **`0.11.81`**: Calendar card titles / meta / event labels use
  2-line clamp (less cutoff on longer text). Slot label max 40 chars.
- Schedule cards support **multiple assignees** (`assignees[]`, migrates
  legacy `assignee` string). Panel uses Task Board-style multi-tick picker;
  card footer shows `Name, Name` or `A, B +N`.

### Deployed
- No — ask before `wrangler deploy`.

### Branch
- `cursor/cal-labels-multi-assignee-95d6`

### Open / next
1. Hard-refresh `/marketing` after deploy; assign 2 people on a filled card.
2. Confirm long Need type labels wrap to 2 lines instead of hard ellipsis.

---

## 2026-08-03 — EOD (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.80`** — Version ID `da843831-7c38-43c2-b968-e5616d2dc6d2`
- Board ~41 schedule / 2 anchors / 22 ideas (rev 64)

### Shipped today (high level)
- Wipe safeguards: Archive-first deletes, snapshots API, catastrophic thin
  overwrite reject; soft LWW for normal concurrent saves (no false drag toasts).
- Deleted events no longer re-seed Ode/FDW.
- Discover: lite panel, Posted sticky, preview × clear; lighter image embeds.
- Shared **ppc-date** theme on Marketing / Planner / Kanban (`ppc-select.js?v=7`).
- Empty Photoshoot colour section hidden in Settings.

### Branch / git
- `cursor/cloud-agent-1785725967651-xf056` — commits through Marketing 0.11.78
  polish; later 0.11.79–0.11.80 may be local/deployed only — commit if needed.

### Open / next
1. Confirm drag toasts gone on v0.11.80 (one Marketing tab only).
2. Optional: Settings UI for snapshot restore; Fill from Ideas; R2 for images.
3. Prefer Drive links over dropped photos for heavy assets.
4. Don’t reopen Marketing inside Obsidian while editing.

---

## 2026-08-03 — Stop false conflict toasts on drags (Cursor)

### What was built or decided
- Marketing `0.11.80` + Worker: revision mismatch no longer 409s for normal
  concurrent edits. Only **catastrophic thin overwrites** are rejected.
  Card moves debounce via `scheduleSave`; save loop won’t drop a trailing save.

### Deployed
- Version ID: `da843831-7c38-43c2-b968-e5616d2dc6d2` (Marketing 0.11.80)

### Open / next
1. Hard-refresh v0.11.80; drag several cards — no “updated elsewhere” toast.

---

## 2026-08-03 — Quiet revision retries on card moves (Cursor)

### What was built or decided
- Marketing `0.11.79`: serialize Marketing saves; on `revision_conflict` from
  overlapping drags/saves, adopt server rev and retry silently instead of
  toasting “Calendar updated elsewhere” and refreshing.

### Deployed
- Version ID: `188217ba-a51d-46e7-9726-04a32f275c67` (Marketing 0.11.79)

### Open / next
1. Hard-refresh; drag calendar cards — no false conflict toast.

---

## 2026-08-03 — Shared ppc-date theme everywhere (Cursor)

### What was built or decided
- Marketing `0.11.78` + shared `ppc-select.js?v=7`:
  - Date picker restyled to match the outline/sage calendar (selected ring,
    Clear/Today, Mo–Su).
  - Planner exact date + Kanban due date use **ppc-date** (no native OS picker).
  - Marketing datetime fields use **ppc-date + time**.

### Deployed
- Version ID: `ff8f7c71-124a-41fa-9e27-b44b6f7f3a02` (Marketing 0.11.78 + ppc-select v7)

### Open / next
1. Hard-refresh Marketing / Planner / Task Board — open any date field.

---

## 2026-08-03 — Drop Photoshoot formats from Settings (Cursor)

### What was built or decided
- Marketing `0.11.77`: Colour settings skip pillars with no formats (empty
  “Photoshoot formats” accordion). Removed live custom pillar `photoshoot`.

### Deployed
- Version ID: `690dd08b-3382-4025-95f9-5ce2fc6bb3ac` (Marketing 0.11.77)

### Open / next
1. Hard-refresh Settings → Colour settings — no empty Photoshoot formats block.

---

## 2026-08-03 — Posted sticks + lighter embeds (Cursor)

### What was built or decided
- Marketing `0.11.76`:
  - Discover/calendar **Posted** no longer gets overwritten by a stale Status
    control on Save/Close; panel select stays in sync; Close auto-saves schedule.
  - Discover preview **×** clear (from 0.11.75).
  - Embedded images shrink harder (max edge 720, JPEG ~0.72) so Ideas/Discover
    previews weigh less in KV. Prefer Drive links for the real file.

### Deployed
- Version ID: `a04ea53c-ce2f-4682-a174-657559c4b209` (Marketing 0.11.76)

### Open / next
1. Hard-refresh `/marketing` — set Discover to Posted; confirm it sticks.
2. Later: optional image URL field / R2 for Ideas if board still grows heavy.

---

## 2026-08-03 — Discover preview remove (Cursor)

### What was built or decided
- Marketing `0.11.75`: Discover post thumb gets a **×** to clear the dropped
  preview (`imageData`) so heavy embeds can be removed without deleting the card.

### Deployed
- Pending

### Open / next
1. Deploy when asked; hard-refresh `/marketing`.

---

## 2026-08-03 — Stop deleted events from resurrecting (Cursor)

### What was built or decided
- Root cause of “deleted events come back”: `seedAnchorsIfEmpty()` re-injected
  Ode + FDW whenever `anchors` was empty (refresh / conflict reload / init).
- Now a no-op; defaults only via `defaultData()` for brand-new boards.
- Marketing `0.11.74`. Cleared live calendar + events so rebuild can start clean
  (ideas kept; deleted items in Archive).

### Why Obsidian broke the board
- Obsidian’s webview kept **old localStorage** for the same origin. Pasting the
  new URL still ran recovery that preferred the fat local copy and overwrote cloud.

### Deployed
- Version ID: `0102f5b4-6398-4a28-8231-59525ec85791` (Marketing 0.11.74)

### Open / next
1. Hard-refresh Marketing (close Obsidian embed / old tabs). Confirm v0.11.74.
2. Rebuild events/cards on empty calendar.

---

## 2026-08-03 — Marketing snapshots + never silent-wipe (Cursor)

### What was built or decided
- Marketing `0.11.73` + Worker:
  - **Revision lock** (`_rev`): stale tabs can't overwrite newer cloud boards (409).
  - **Reject thin/gutting saves** (empty schedule, big card drops, losing filled cards).
  - **Cloud snapshots** on save (~15m / always on big drops). List/restore APIs.
  - Archive-first prune/event delete; client hydrate gate + conflict refresh.
  - Calendar baseline: 2 filled + Ode 6 / FDW 8 / Discover 12 Needs + 4 events.

### Deployed
- Version ID: `b4878399-70b7-4cf2-b143-6eb14fdbe96d` (Marketing 0.11.73)

### Open / next
1. **Hard-refresh** live `/marketing` (close extra tabs) — must show **v0.11.73**.
2. Smoke: edit event, drag Need, Discover status Need→Posted.
3. Optional Settings UI for snapshot restore.

---

## 2026-08-03 — Deploy Marketing 0.11.70 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.70`** — Version ID `39f7ce61-9e44-4c0d-98b0-808f3d2229ed`
- Ready removed · status save fix · Discover-lite · fill empty Need

### Deployed
- `npx wrangler deploy` — asset: marketing.html

---

## 2026-08-03 — Drop Ready status; keep Scheduled (Cursor)

### What was built or decided
- Marketing `0.11.70`: Removed **Ready** from calendar status.
  Flow is now **Need → Prep → Execute → Scheduled → Posted**
  (Discover: Need → Scheduled → Posted). Legacy `ready` migrates to
  `scheduled`. Review → Calendar lands on Scheduled.
- Save no longer forces status back to Need — respects the Status control.
  Drive/media counts as content for Need detection.

### Deployed
- Yes — Version ID `39f7ce61-9e44-4c0d-98b0-808f3d2229ed`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — Posted sticks; no Ready option.
2. Merge / commit when asked.

---

## 2026-08-03 — Discover-lite schedule panel (Cursor)

### What was built or decided
- Marketing `0.11.69`: Pinterest/Cosmos calendar cards use a **Discover-lite**
  panel — “Discover post”, note field, Drive link, drop/paste preview; hides
  Browse Ideas / Details / Music. Status options: Need → Ready → Scheduled →
  Posted (skips Prep/Execute).

### Deployed
- Pending deploy this turn

### Open / next
1. Hard-refresh `/marketing` — open a Pinterest/Cosmos Need.
2. Merge / commit when asked.

---

## 2026-08-03 — Deploy Marketing 0.11.68 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.68`** — Version ID `8c928814-898d-477d-80fb-1060e3594157`
- Review → Calendar fills empty Need (same day + format)

### Deployed
- `npx wrangler deploy` — asset: marketing.html

---

## 2026-08-03 — Fill empty Need on Schedule handoff (Cursor)

### What was built or decided
- Marketing `0.11.68`: Review → Calendar **fills** an empty Need on the same
  day + format (prefer same pillar) instead of stacking a new card.
  Keeps Need id / day / anchor; status Ready. Toast: “Filled Need on calendar”.

### Deployed
- Yes — Version ID `8c928814-898d-477d-80fb-1060e3594157`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — Schedule into a dated empty Need.
2. Merge / commit when asked.
3. Parked: Discover-lite panel for Pinterest/Cosmos.

---

## 2026-08-03 — Deploy Marketing 0.11.67 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.67`** — Version ID `f7e09f93-8d15-46f5-9879-3af98c88fada`
- Also ships `0.11.66` production statuses (Need → Prep → Execute → Ready →
  Scheduled → Posted). Other / Shoot day removed.

### Deployed
- `npx wrangler deploy` — asset: marketing.html

---

## 2026-08-03 — Remove Other / Shoot day from Marketing (Cursor)

### What was built or decided
- Marketing `0.11.67`: Removed built-in **Other** pillar and formats
  (BTS · Shoot day · Other). Shoot / content days belong on Planner +
  Task Board; Marketing stays publish-focused.
- Existing Other cards/ideas migrate to Organic.

### Deployed
- Yes — Version ID `f7e09f93-8d15-46f5-9879-3af98c88fada`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — Other gone; new status chips.
2. Merge / commit when asked.

---

## 2026-08-03 — Calendar production statuses (Cursor)

### What was built or decided
- Marketing `0.11.66`: Calendar card status is now production flow —
  **Need → Prep → Execute → Ready → Scheduled → Posted**.
  - Scheduled = queued in the social app; Posted = live/done.
  - Review → Calendar lands on **Ready** (not Scheduled).
  - Empty Needs default to **Need**; filled content bumps off Need → Prep.
  - Legacy: unscheduled/open → Need; in-progress → Execute; complete → Posted.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. Smoke: cycle status on filled card; Review→Schedule shows Ready; empty Need.
2. Deploy when asked.
3. Later: Fill from Ideas / send Need into Prep without losing the date.

---

## 2026-08-03 — Deploy Marketing 0.11.65 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.65`** — Version ID `7d7e640f-bada-44a7-9ce5-ddaad6393b2d`
- Content outcome removed from schedule panel (still in Details / Review)

### Deployed
- `npx wrangler deploy` — asset: marketing.html

---

## 2026-08-03 — Drop schedule Content outcome field (Cursor)

### What was built or decided
- Marketing `0.11.65`: Removed editable **Content outcome** from the calendar
  schedule panel — outcome stays in Review and in schedule **Details**.

### Deployed
- Yes — Version ID `7d7e640f-bada-44a7-9ce5-ddaad6393b2d`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — no Content outcome on calendar cards.
2. Merge / commit when asked.

---

## 2026-08-03 — Deploy Marketing 0.11.64 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.64`** — Version ID `b69f7c1c-f164-4a61-a773-7a29e8140845`
- Ships: Schedule Details · Prep cover thumbs · Review→Schedule caption/tags/music
  · calendar assignee/status · pillar rename · Add format · Other pillars

### Deployed
- `npx wrangler deploy` — assets: marketing.html, kanban.html, planner.html

---

## 2026-08-03 — Schedule panel Details (Cursor)

### What was built or decided
- Marketing `0.11.64`: Schedule panel **Details** toggle under Scheduled content
  expands idea · plan · requirements · execution · outcome · tweaks (carried
  from Prep → Exec → Review onto the calendar card).

### Deployed
- Yes — Version ID `b69f7c1c-f164-4a61-a773-7a29e8140845`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — Details on scheduled cards.
2. Merge / commit when asked.

---

## 2026-08-03 — Prep thumbs fill width (Cursor)

### What was built or decided
- Marketing `0.11.63`: Prep card images use `object-fit: cover` and size height
  from the real lane width (rAF) so portraits no longer leave white side bars.
  Thumb background is neutral grey, not white.
- Also: Review save now writes caption/tags/music before Schedule handoff
  (Browse Ideas hide + Add pillar Cancel `[hidden]` were already in place).

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. Smoke: drop a portrait into Prep — image fills card width.
2. Smoke: Review → Schedule carries caption/tags/music; filled calendar hides Browse Ideas.
3. Deploy when asked.

---

## 2026-08-03 — Pillar rename + Add format everywhere (Cursor)

### What was built or decided
- Marketing `0.11.62`:
  - **Rename pillars** — double-click Prep pillar title, or double-click a
    pillar option in panel selects. Built-ins use `pillarLabels` overrides;
    custom pillars update their label.
  - **+ Add format** on Prep (per open pillar), Need menu (format step),
    and Format selects (`+ Add format…`). Works for Other + custom + built-ins.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. Smoke: rename Organic; + Add format under Other; Need menu + Add format.
2. Deploy when asked (also ships pending `0.11.61` calendar assignee/status).

---

## 2026-08-03 — Calendar cards: status + assignee + View details (Cursor)

### What was built or decided
- Marketing `0.11.61`: Filled calendar cards show **View details**, Assignee,
  and status chip (Unscheduled / In progress / Scheduled / Complete).
  Panel: Assignee select (+ Add person) above Status. Staff persisted as
  `DATA.staff` (Jarvis / Louis / Gregor).
- Renamed **Loui → Louis** across Homebase (Task Board staff + migrate,
  Planner sample copy, Marketing notes). Louise unchanged.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing (+ Task Board)

### Open / next
1. Smoke: filled card footer; View details; cycle status; assign Louis; + Add.
2. Deploy when asked.
3. Parked: Fill from Ideas link, project delete, dark theme, Unassigned
   rollover, “+ Add more” dates.

---

## 2026-08-03 — Deploy schedule panel + Other pillars (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.60`** — Version ID `2848667f-3cf2-452e-8634-b4931df14374`
- Browse Ideas · publish above caption · Status bottom · Scheduled badge
- Other pillar + custom pillars (`+ Add pillar`)

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Schedule panel + Other pillars (Cursor)

### What was built or decided
- Marketing `0.11.60`:
  - Schedule card panel: **Browse Ideas** jumps to Pipeline → Content Ideas;
    Publish date moved above Caption; Status moved to bottom.
  - Filled calendar cards: status badge bottom-right — **Scheduled** / Open.
  - New **Other** pillar (BTS · Shoot day · Other formats).
  - **+ Add pillar** (Prep board, Need menu, Pillar selects) — custom pillars
    persist in KV `customPillars` (+ starter format with same name).

### Deployed
- Yes — Version ID `2848667f-3cf2-452e-8634-b4931df14374`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh live `/marketing` — Other pillar; Browse Ideas; Scheduled badge.
2. Merge / commit when asked.
3. Parked: Fill from Ideas (link a specific idea into a Need), project delete,
   dark theme, Unassigned rollover, “+ Add more” dates.

---

## 2026-08-03 — End of day (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.59`** — Version ID `f520ce76-3729-4322-9551-b84b6a46c98c`
- Branch `cursor/cloud-agent-1785725967651-xf056` pushed (`bf013d6`). Clean tree.

### Shipped today (high level)
- Colour settings + 50-swatch picker; Settings Archive accordion; scrollable Settings
- Calendar cards match planner outlines; sharper week dividers
- Black titles/dropdowns (Need menus, pillars, Status/Category)
- Website formats: Landing page · Blog · Feature page
- Event days: full column wash by event-type colour

### Open / next
1. Merge branch → `main` when ready
2. Parked earlier: Fill from Ideas, project delete UI, dark theme polish,
   Unassigned rollover, “+ Add more” dates
3. Optional: event wash only behind date number (not full column) if too strong

---

## 2026-08-03 — Deploy event day wash (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.59`** — Version ID `f520ce76-3729-4322-9551-b84b6a46c98c`
- Event days: full column wash by event-type colour (no thin pin chips).

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Event day date wash (Cursor)

### What was built or decided
- Marketing `0.11.59`: Event days wash the **whole date column** with the
  event-type colour (replacing thin pin chip bars). Event name stays as
  plain text under the date number (click to edit). Card format left-bars
  unchanged.

### Deployed
- Included in live `0.11.59` deploy above.

---

## 2026-08-03 — Deploy website format labels (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.58`** — Version ID `79af0bed-39b4-4f06-8d47-a317c4f299e5`
- Website formats: Landing page · Blog · Feature page.

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Website format labels (Cursor)

### What was built or decided
- Marketing `0.11.58`: Website formats renamed for clarity — **Design →
  Landing page**, **Features → Feature page** (ids unchanged so existing
  cards keep working). Blog unchanged.

### Deployed
- Included in live `0.11.58` deploy above.

---

## 2026-08-03 — Deploy black dropdowns (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.57`** — Version ID `af0ae94d-84eb-4edc-8432-7ed55256ae64`
- Status + Category selects: black text.

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Black dropdown text (Cursor)

### What was built or decided
- Marketing `0.11.57`: Status + Category selects use black text (`colored:
  false`) — Unscheduled/Scheduled no longer gold/teal in the panel.

### Deployed
- Included in live `0.11.57` deploy above.

---

## 2026-08-03 — Deploy black titles (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.56`** — Version ID `baed2f3d-fe9c-4ee6-abf7-40bffca3e2aa`
- Need menu / Prep lanes / Pillar selects: black titles (no coloured labels).

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Black pillar/format titles (Cursor)

### What was built or decided
- Marketing `0.11.56`: Need menu pillars + formats, Prep lane titles, and
  Pillar selects render **black** (`#2C2C2C`) — no more per-pillar/format
  text colour. Accents stay on card bars/washes + Colour settings only.

### Deployed
- Included in live `0.11.56` deploy above.

---

## 2026-08-03 — Deploy calendar outline polish (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.55`** — Version ID `a2344534-8b94-4592-ae4a-d25c3f9c38cc`
- Calendar cards: planner-style `#E2DDD5` outline; sharper week dividers.

### Deployed
- `npx wrangler deploy` — asset: `marketing.html`

---

## 2026-08-03 — Calendar cards match planner (Cursor)

### What was built or decided
- Marketing `0.11.55`: Calendar Need/content cards use planner-style
  **`#E2DDD5` outline** (empty Needs no longer transparent-border). Left
  accent bar stays format colour. Week row separators sharpened to
  `#E2DDD5` (was `#f0ede8`), including earlier-weeks nested rows.

### Deployed
- Included in live `0.11.55` deploy above.

---

## 2026-08-03 — Deploy archive accordion + 50 colours (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.54`** — Version ID `5608470d-c76d-4b5d-80c5-a96b9dbed6ab`
- Settings Archive collapsible (`0.11.53`); colour picker **50** swatches
  with clearer hue spread (steel/blue, wine/rose, terracotta, olive, teal).

### Deployed
- `npx wrangler deploy` — assets: `marketing.html`, `ppc-homebase.js`

---

## 2026-08-03 — Wider colour palette (Cursor)

### What was built or decided
- Marketing `0.11.54`: Brand colour picker expanded **30 → 50** swatches.
  Added clearer hue families (steel/blue, wine/rose, terracotta/coral,
  olive/moss, teal/indigo) so options aren’t mostly near-neighbours.

### Deployed
- Included in live `0.11.54` deploy above.

---

## 2026-08-03 — Settings Archive accordion (Cursor)

### What was built or decided
- Marketing `0.11.53` / shared `ppc-homebase.js`: Settings → **Archive** is
  collapsible (▸/▾), like Colour settings. Open/closed remembered in
  `localStorage` (`ppc-archive-open`). Header shows count when items exist
  (`Archive · 3`). Defaults collapsed.

### Deployed
- Included in live `0.11.54` deploy above.

---

## 2026-08-03 — Deploy colour popover + settings (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.52`** — Version ID `774f0d2f-b7e8-4ccf-9abe-81a708c4525b`
- Colour popover portals to `body` (not clipped by accordion). Muted sage
  `#4a8a5c`. Brand 30-swatch picker + scrollable Settings from `0.11.51`.

### Deployed
- `npx wrangler deploy` — assets: `marketing.html`, `ppc-homebase.js`

---

## 2026-08-03 — Colour popover portal (Cursor)

### What was built or decided
- Marketing `0.11.52`: Brand colour picker portals to `body` (fixed) so it
  isn’t clipped inside format accordion boxes. Bright green `#58c280`
  swapped for muted sage `#4a8a5c`.

### Deployed
- Superseded by live `0.11.52` deploy above.

---

## 2026-08-03 — Brand colour picker + settings scroll (Cursor)

### What was built or decided
- Marketing `0.11.51`: Settings panel scrolls itself (body lock + scroll
  body). **Colour settings** is a collapsible section with expandable
  Event types / per-pillar format groups.
- Native OS colour dialog replaced by a Homebase-branded popover with
  **30 palette swatches** (graphite / purple / sage / gold / neutrals).

### Deployed
- Included in live `0.11.52` deploy.

---

## 2026-08-03 — Colour settings + no day wash (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.50`** — Version ID `c7f6922a-6c23-4bb4-86a1-9da1d913fc17`
- Settings → **Colours**: edit format + event-type accents (persisted in
  marketing KV `colourPrefs`). Reset colours button.
- Removed grey lead-up / weekend day-body washes — cards carry the colour.
- Event chips / day pins use live event-type colour washes.

### Open / next
1. Hard-refresh live `/marketing` — Settings → Colours; calendar days flat.
2. Commit/push when asked.

---

## 2026-08-03 — Per-format colours (Cursor)

### What was built or decided
- Marketing `0.11.49`: Prep pillar titles stay **black** (no longer pillar-
  coloured). Each format gets its own Homebase-palette accent (~16 mid-tones
  + hash fallback for customs). Calendar Need bar/wash + Prep cards/lane
  titles use `formatColor`. Format title text on Needs stays black; event
  names keep event-type colour.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. Confirm calendar Pins/Posts/Stories/Reels/TikTok read as distinct washes.
2. Commit/push when asked.

---

## 2026-08-03 — Deploy 0.11.48 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.48`** — Version ID `dd943ee1-3cb9-407d-b715-a61e1ce4e778`
- Need cards: pillar-colour wash background.

### Open / next
1. Hard-refresh live `/marketing`.
2. Commit/push when asked.

---

## 2026-08-03 — Need chip pillar wash (Cursor)

### What was built or decided
- Marketing `0.11.48`: Need cards get a soft background wash of the left-bar
  (pillar) colour — same weight as day pins / event chips (~12% alpha).

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

---

## 2026-08-03 — Deploy 0.11.47 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.47`** — Version ID `49ef19ca-59e1-40b2-a923-dcac611dfac4`
- Default publish time 5pm + earlier 0.11.46 calendar polish.

### Open / next
1. Hard-refresh live `/marketing`.
2. Commit/push when asked.

---

## 2026-08-03 — Default publish time 5pm (Cursor)

### What was built or decided
- Marketing `0.11.47`: New calendar publish stamps default to **5:00pm**
  local (was 10am) — drag-to-day, + Need, lead-up slot create. Existing
  times still preserved on move.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Deploy 0.11.46 (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.46`** — Version ID `3bd6a1df-1e19-4cba-a6f8-2a2d621b1857`
- Ships: format title black + pillar bar; event name type colour; no day
  targets; date-range Event date hide fix; Events chips title-only; no
  event-title click on Need cards.

### Open / next
1. Hard-refresh live `/marketing`.
2. Commit/push when asked (local still dirty).

---

## 2026-08-03 — Event chips title-only (Cursor)

### What was built or decided
- Marketing `0.11.46`: Events bar chips show **title only** for all types
  (not just cadence). Date stays in hover tooltip; click opens the panel.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

---

## 2026-08-03 — Need chips: black format + pillar bar (Cursor)

### What was built or decided
- Marketing `0.11.45`: Reverted per-format chip colours (too busy). Need cards:
  format title **black**, left bar = **pillar** colour, event name keeps
  event-type colour (Event gold / Release graphite / Cadence purple).

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. Confirm black format titles + purple Organic bars; Ode event names gold.
2. Commit/push when asked.

---

## 2026-08-03 — Date range hides Event date (Cursor)

### What was built or decided
- Marketing `0.11.44`: Date range mode correctly hides the single **Event
  date** field (`.cal-anchor-field { display:flex }` was overriding
  `[hidden]`). Range = Start / End / optional Event night only.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing

### Open / next
1. New event → Date range — no orphan Event date field.
2. Commit/push when asked.

---

## 2026-08-03 — Format colours + drop day targets (Cursor)

### What was built or decided
- Marketing `0.11.43`: Calendar Need chips colour by **format** (not Organic
  pillar) — IG Post graphite, Story green, Reel gold, Pinterest purple,
  TikTok slate. Prep boards still use pillar colours.
- Removed day targets (Grid / Story / Discover right-click + cues/tints/×).
  Right-click a day = Need content menu only. Edit events via Events chips.
- Event name on Need cards is display-only again (no click → event panel);
  frees the chip for drag.

### Deployed
- Local only — hard-refresh http://127.0.0.1:8787/marketing
- Deploy when asked.

### Open / next
1. Preview format colours + no day-target menu + no event-title click.
2. Commit/push when asked.
3. Parked: Fill from Ideas, project delete UI, dark theme, Unassigned
   rollover, “+ Add more” extra dates.

---

## 2026-08-03 — End of day (Cursor)

### Live
- Site: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.41`** — Version ID `9d7c8a5d-b78e-4d9e-b7bc-bdf0e5b89e0c`
- `ppc-select.js` **v6** (date menus)

### Shipped today (high level)
- Event panel: Single night | Date range; removed Post on weekdays
- Quotas → Unscheduled Needs; drag to days; compact Unscheduled chips
- Adjacent-month overflow days (faded + editable)
- Two-step Need menu (pillar → format)
- Home menu: no dividers, tighter tracking, hover green/purple/gold
- Need cards: event-title colour by type; `format - slot label`; no Content layer
- Schedule panel: caption/tags/music load+save per card (leak fixed)
- Date pickers: portal + `.is-open` (work inside event panel)
- Re-drag Needs on lead-up days; Pinterest/Cosmos full label; no drag opacity fade
- Cadence Events chips: title only (no date)

### Open / next
1. Smoke hard-refresh home + `/marketing` (dates, drag twice, cadence chip).
2. Commit/push when asked (local git still dirty: `HANDOFF.md`,
   `public/index.html`, `public/js/ppc-select.js`, `public/marketing.html`).
3. Parked earlier: Fill from Ideas, project delete UI, dark theme, Unassigned
   rollover, “+ Add more” extra dates.

### Prefer
- Local `wrangler dev` on `:8787`; deploy only when asked.

---

## 2026-08-03 — Cadence chips without dates (Cursor)

### What was built or decided
- Marketing `0.11.41`: Events bar chips for **cadence** types show title only
  (no `· MM-DD` date span). Event / release chips unchanged.

### Deployed
- Yes — Version ID `9d7c8a5d-b78e-4d9e-b7bc-bdf0e5b89e0c`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — Discover Flow chip title-only.
2. Commit/push when asked.

---

## 2026-08-03 — Date pickers + re-drag Needs (Cursor)

### What was built or decided
- Marketing `0.11.40` / `ppc-select.js` v6: date menus portal to `body` **and**
  use `.is-open` so they actually display (v5 left them `display:none` because
  CSS required nesting under `.ppc-date.open`).
- Day-body drag no longer cancels Need slot drags on tinted days.
- Full **Pinterest/Cosmos** label; drag without opacity fade.

### Deployed
- Yes — Version ID `560e0f21-2346-4a7c-888e-6e49bc16f49a`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — event date fields must open calendars.
2. Commit/push when asked.

---

## 2026-08-03 — Full Pinterest label + drag fade fix (Cursor)

### What was built or decided
- Marketing `0.11.38`: Need glance label uses full format name
  (**Pinterest/Cosmos**, not “Pin”); prefers `formatLabel` for all formats.
- Drag no longer fades slots with opacity (was sticking grey sometimes);
  dashed outline while dragging + clearer drag-style cleanup on move/end.

### Deployed
- Local only — deploy when asked.

### Open / next
1. Hard-refresh `/marketing` — Pinterest/Cosmos full title; move a card —
   should not stay grey.
2. Commit/push when asked.

---

## 2026-08-03 — Date picker not clipped by panel (Cursor)

### What was built or decided
- `ppc-select.js` v4: date menus use **fixed** positioning + viewport clamp
  (flip left/up as needed) so End date etc. aren’t cut off by
  `cal-anchor-panel` overflow. Marketing `0.11.37`.

### Deployed
- Yes — Version ID `9ef6b05e-8f06-4cab-9e7a-f17f6f3d8115`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — open event Date range → End date calendar
   fully visible.
2. Commit/push when asked.

---

## 2026-08-03 — Schedule panel per-card fields (Cursor)

### What was built or decided
- Marketing `0.11.36`: Schedule card panel now **loads and saves** Caption,
  Tags, and Music per card (were DOM-only and leaked across opens).
  Content outcome clear/reload hardened when switching cards. Switching to
  another schedule card while the panel is open silently saves the previous.

### Deployed
- Yes — Version ID `45da494a-46d6-4cb4-8ba6-48793c5bb349`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — edit tags on one Need, open another → fields
   should match that card only; Save persists caption/tags/music.
2. Commit/push when asked.

---

## 2026-08-03 — Slot label keeps format type (Cursor)

### What was built or decided
- Marketing `0.11.35` (was 0.11.34): Need card type line shows
  **format - slot label** when a custom slot label is set.
- Removed **Content layer** from the schedule card panel (field kept in
  data if present; no longer shown or edited).

### Deployed
- Yes — Version ID `580fdfd7-83f5-4e8d-b8ee-e6089c1a22c5`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — labelled Need e.g. `IG Post - …`; no Content
   layer in card panel.
2. Commit/push when asked.

---

## 2026-08-03 — Event title colour on Need cards (Cursor)

### What was built or decided
- Marketing `0.11.33`: Event name on Need cards uses event-type colour
  directly (Event gold `#C29A3B`, Release graphite, Cadence purple) —
  was forced to black via `accentTextColor` for gold.

### Deployed
- Yes — Version ID `da79c611-03fa-4f3d-a224-851f0fdc10ea`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — “Ode to Sirens” on Needs should be gold.
2. Commit/push when asked.

---

## 2026-08-03 — Home menu tighter stack (Cursor)

### What was built or decided
- Home (`index.html`): no divider rules; tighter letter-spacing (brand-like);
  more gap between titles; hover colours — Planner green `#4E6E6C`, Task
  Board purple `#564A5E`, Marketing gold `#C29A3B`.

### Deployed
- Yes — Version ID `da79c611-03fa-4f3d-a224-851f0fdc10ea`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh home — per-title hover colours.
2. Commit/push when asked.

---

## 2026-08-03 — Two-step Need content menu (Cursor)

### What was built or decided
- Marketing `0.11.32`: Day `+` / right-click Need / Change format use a
  two-step picker — **pillar**, then **format** (includes custom formats).
  No more hardcoded 4 organic-only options. Menu clamps to viewport.

### Deployed
- Yes — Version ID `aa082a99-6615-4678-a816-ad1873456f19`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — + on a day → Organic/Email/Ads/Website → format.
2. Commit/push when asked.

---

## 2026-08-03 — Adjacent-month overflow days (Cursor)

### What was built or decided
- Marketing `0.11.31`: Month grid overflow cells show previous/next month
  dates (faded) and are fully editable — drag/drop, +, pins, targets —
  so month edges work without switching view.

### Deployed
- Yes — Version ID `56e7264f-ef81-44b7-ba8a-e5f83dc1fb92`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — Aug 31 row should show Sep 1–5 faded + usable.
2. Commit/push when asked.

---

## 2026-08-03 — Compact Unscheduled cards (Cursor)

### What was built or decided
- Marketing `0.11.30`: Unscheduled queue uses the same compact `cal-slot`
  chips as calendar days (planner Any-column scale), wrapping in a row —
  no more large thumbnail schedule-cards.

### Deployed
- Yes — Version ID `96bb65cd-6770-4b11-9c24-86f87b2493b4`
  (redeploy; assets unchanged from `aef9f559…`)
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — Unscheduled Needs should look like small pills.
2. Commit/push when asked.

---

## 2026-08-03 — Single night / Date range + drop Post on (Cursor)

### What was built or decided
- Marketing `0.11.29`: Event panel **Dates** mode — **Single night** (one Event
  date) or **Date range** (Start / End / optional Event night).
- Removed **Post on** weekdays — Needs stay unscheduled; place by dragging.
- Events chips show single date or start–end span. Defaults: Ode = single,
  FDW = range. Migrate: same start/end (+ night) → single.

### Deployed
- Yes — Version ID `eb11983f-5afc-4739-ad1d-1405796421cc`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` to verify Single night / Date range + no Post on.
2. Commit/push when asked.

---

## 2026-08-03 — Content needed + Add opens list (Cursor)

### What was built or decided
- Marketing `0.11.27`: **+ Add** under Content needed opens the format list
  immediately (no nested select click).

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Quotas → Unscheduled + no Edit event btn (Cursor)

### What was built or decided
- Marketing `0.11.26`: Content schedule quotas create **unscheduled** Need
  cards (not auto-dated). Drag from Unscheduled onto calendar days.
- Removed **Edit event** from schedule panel — edit via Events chips or
  event title on Need cards.
- Day tints follow placed cards only (no auto-spread highlights).

### Deployed
- Yes — Version ID `587baa7a-2e3a-4d23-89ab-ec9845bd64b5`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — save event quotas → Needs appear in
   Unscheduled; drag onto days; edit event via chip / event title only.
2. Commit/push when asked.

## 2026-08-03 — Calendar Need card colours (Cursor)

### What was built or decided
- Marketing `0.11.25`: Empty Need cards — **format** + left bar use pillar
  colour (Organic purple / Email green / Ads gold / Website graphite);
  **event title** uses event-type colour (Event gold / Release graphite /
  Cadence purple). Filled cards: format meta + bar match pillar too.
- Also ships `0.11.24` compact Content needed rows (+ Add).

### Deployed
- Yes — Version ID `4165dc01-981c-465a-bb9d-314cfc1931ec`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — confirm colours + compact quotas.
2. Commit/push when asked.

---

## 2026-08-03 — Content needed compact rows (Cursor)

### What was built or decided
- Marketing `0.11.24`: Content needed shows only active rows (new events:
  4 organic starters). **+ Add** picks another format (or Create format…);
  hover × removes a row.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Event content quotas (Cursor)

### What was built or decided
- Marketing `0.11.23`: Event panel **Content schedule** (renamed from Place Need
  slots). Dropped Density + single Slot format.
- Per-event **content quotas** for all Prep formats (+ Add format… →
  `customFormats`). Prep weeks (lead-up) or start→end window; Post on weekdays;
  Save spreads Need slots by format totals (still draggable).
- `+ Event` moved into Events bar chip row.
- ppc-select **double-click rename** (Type custom / When to place labels).
- Fix: schedule panel Save no longer clobbers Need body from stale `pDesc`;
  format/pillar persist; format change clears `needLabel`.

### Deployed
- Yes — Version ID `69f02512-eccb-4f90-b11e-06653200132f`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — confirm `v0.11.23`; open event → set quotas →
  Save; confirm slots; Need format Save sticks.
2. Commit/push when asked.

---

## 2026-08-03 — Need cards: no event-open on title (Cursor)

### What was built or decided
- Marketing `0.11.22`: Empty Need event-name line is display-only (no click →
  event panel). Edit events via Events chips / panel only.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Need cards: type-first + dropdown + × (Cursor)

### What was built or decided
- Marketing `0.11.21`: Empty Need cards flipped — **format/type is primary**
  (`IG Post` / `Story` / `Pin` / `Reel`), event name is secondary quiet line.
- Click the type line → same Need-format dropdown (Change format); no panel
  required. `+` add no longer auto-opens the side panel.
- Hover **×** on empty Need cards deletes (archives) the slot.

### Deployed
- Local only — deploy when asked (PC: `npx wrangler deploy`).

### Open / next
1. Hard-refresh `/marketing` — slots read type then event; click type to
   change; hover × to remove.

---

## 2026-08-03 — Need card glance labels (Cursor)

### What was built or decided
- Marketing `0.11.20`: Empty Need cards always show a short glance prefix —
  format (`IG` / `Story` / `Pin` / `Reel`) or optional `needLabel` override —
  then ` · ` + event name. Click card → schedule panel: Format + **Slot label**
  (max 24 chars). Create/migrate paths set `needLabel: ''`.

### Deployed
- Yes — Version ID `af4ede4e-92c4-4a9d-8332-95b163174e2a`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh `/marketing` — empty Ode slots read `IG · Ode…`; open a slot,
   set Slot label to `Reel` or `BTS`, Save; confirm card updates.
2. Commit/push handoff deploy note when convenient.

---

## 2026-08-03 — Twilight Indigo trial removal (Cursor)

### What was built or decided
- Section / board titles stay **Graphite** when open (no indigo flash).
- Visited Home + nav links stay graphite/slate (no browser purple).
- Trial: removed **Twilight Indigo** `#344364` from Homebase UI chrome and
  palette. Accents → Graphite `#2C2C2C`; soft washes → graphite rgba;
  week labels → Slate `#6B7A8D`. Navys row dropped from category colour
  picker. Stockists + Website pillar + Calendar swatch temporarily Graphite
  (Stockists shares with Personal — reassign if trial sticks).
- Cloud cat migration: `#344364` → `#2C2C2C` (Planner).
- Versions: Marketing `0.11.19` · Planner `2.10.9` · Task Board `1.10.5`.

### Deployed
- Yes — Version ID `0187ec1a-8b5d-4e79-ac12-c32c179774b9`
  https://ppc-homebase.pressplaycollective.workers.dev

### Open / next
1. Hard-refresh — titles stay black; no indigo/purple on nav/section open.
2. Decide: keep indigo out, and pick a distinct Stockists colour if needed.
3. Commit/push when asked.

---

## 2026-08-03 — Branch rename (Cursor)

### What was built or decided
- Renamed working branch `cursor/pressplay-logo-assets` → `cursor/homebase`
  (local + GitHub). Old remote branch deleted. Uncommitted Marketing/Planner
  work unchanged on the new name.

### Deployed
- No — git-only.

---

## 2026-08-03 — End of day (Cursor)

### Live now
- Marketing **`0.11.18`** — Version ID `1a2a5247-52c5-47fc-a1a4-319573852964`
  https://ppc-homebase.pressplaycollective.workers.dev
- Planner **`2.10.8`** · Task Board **`1.10.4`**
- Today’s Marketing ship: **ppc-date** picker + minimal empty Need slots;
  earlier calendar UX (week/month, Events chips, day marks, tint drag) is
  also on live via those deploys.

### Local vs git
- Branch `cursor/homebase` — **uncommitted**: `HANDOFF.md`,
  `public/marketing.html`, `public/js/ppc-select.js`, `public/planner.html`.
- Do **not** commit `.cursor/settings.json` or `.wrangler-deploy-check/`.
- Last commit on branch: `e71df93` (Marketing 0.11.6 / Planner 2.10.7).

### Open / next
- Commit + push when asked (Marketing 0.11.7→0.11.18 + Planner if ready).
- Smoke: empty Need one-liners, date picker in event panel, week view, day
  marks, tint drag.
- Parked: Fill from Ideas, project delete UI, dark theme, Unassigned
  rollover, cadence tune after real weeks.

### Dev
- Prefer `npx wrangler dev --port 8787 --remote` → http://127.0.0.1:8787/
- Deploy only when asked: `npx wrangler deploy`

---

## 2026-08-03 — Minimal empty Need slots (Cursor)

### What was built or decided
- Marketing `0.11.18`: Empty Need boxes are one accent title line (event name);
  no `NEED` chip / format row. Non-IG formats get a tiny `Pin`/`Story`/`Reel`
  prefix. Filled cards keep meta + Ready/Open.

### Deployed
- Yes — Version ID `1a2a5247-52c5-47fc-a1a4-319573852964`
  (https://ppc-homebase.pressplaycollective.workers.dev)

---

## 2026-08-03 — Custom date picker (Cursor)

### What was built or decided
- Marketing `0.11.17`: Event panel dates use **ppc-date** (same lift menu as
  selects) instead of the native OS date picker. Density option labels
  shortened (no duplicated weeks).

### Deployed
- Yes — Version ID `95ac453d-0a46-4614-a22a-31656139d941`
  (https://ppc-homebase.pressplaycollective.workers.dev)

---

## 2026-08-03 — Vertical stripe tint fix (Cursor)

### What was built or decided
- Marketing `0.11.16`: Multi-mark day tint uses **vertical** colour bands
  (`to right`), not horizontal.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Remove week target strip (Cursor)

### What was built or decided
- Marketing `0.11.15`: Removed calendar **Target this week** Grid/Stories/
  Discover strip — right-click day marks replace it.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Vertical day tint + date field polish (Cursor)

### What was built or decided
- Marketing `0.11.14`: Multi-mark day tint is **vertical** (not diagonal).
  Event panel date/text fields match ppc-select trigger styling.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Day mark × + multi tint (Cursor)

### What was built or decided
- Marketing `0.11.13`: Marked days get a corner **×** to clear Grid/Story/
  Discover. Multi-mark days use a split gradient so all category colours
  show in the day box (not a single tint).

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Tinted drag + day marks + event panel (Cursor)

### What was built or decided
- Marketing `0.11.12`:
  - Dragging a **cue-only tinted day** moves the highlight only (no Need box).
  - Right-click a day → Grid / Story / Discover marks (manual). Week targets
    no longer auto-paint weekdays.
  - Event panel: Place Need slots section **collapses** when unticked; density
    **+ Add density…** opens a compact add form (same pattern as + Add type).

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Drag lead-up highlights (Cursor)

### What was built or decided
- Marketing `0.11.11`: Event lead-up / cadence **highlights** move with
  placements. Drag the tinted day body or the cue chip (e.g. Ode days).
  Vacated preferred dates no longer leave empty highlighted boxes; highlight
  follows the Need on the new day.

### Deployed
- Local only — deploy when asked.

---

## 2026-08-03 — Draggable cadence slots (Cursor)

### What was built or decided
- Marketing `0.11.10`: Calendar Need / cadence slots are **draggable** onto
  other days. Drop persists date (`slotMoved`), keeps event link. Event save
  no longer wipes moved slots — tops up preferred days only when a week is
  under its posts/week count.

### Deployed
- Local only — deploy when asked.

### Open / next
1. Hard-refresh `/marketing` — drag a Pinterest Need to another day; confirm
   it sticks after reload / event re-save.
2. Commit/push when asked.

---

## 2026-08-03 — Week view + Events bar + delete (Cursor)

### What was built or decided
- Marketing `0.11.9`:
  - Calendar **Week | Month** toggle (default Week, remembered). Prev/Next
    move by week or month; taller day cells in week view.
  - **Events** chip row under the nav (next to `+ Event` area) — click a
    chip to edit days/cadence. Makes event edit discoverable.
  - **Delete** on the edit-event panel (empty Need slots removed; filled
    content stays, unlinked).

### Deployed
- Local only — deploy when asked.

### Open / next
1. Hard-refresh `/marketing` — confirm `v0.11.9`; Week view; Events chips;
   open chip → Delete / edit weekdays.
2. Commit/push when asked.

---

## 2026-08-03 — Planner collapse + event weekdays / edit (Cursor)

### What was built or decided
- Planner `2.10.8`: past months start collapsed; current (+ future) open;
  scroll to current month on load; expand refreshes empty content.
- Marketing `0.11.8`:
  - Event panel **Post on** Mon–Sun picks (`slotWeekdays`); drives Need
    placement (custom days place on every selected weekday). Format change
    resets to format defaults (Pins → MWF).
  - Saving with slots on reconciles empty auto-slots (weekday/date edits
    no longer leave orphans).
  - Edit event: click Need/slot title (linked), lead-up cue, start/end pin,
    or **Edit event** in the schedule panel.

### Deployed
- Local only — deploy when asked.

### Open / next
1. Hard-refresh `/planner` — July collapsed, August open.
2. Hard-refresh `/marketing` — open Pinterest flow via slot title → change
   weekdays → Save; confirm slots move.
3. Commit/push when asked.

---

## 2026-08-03 — Cadence pin flood fix (Cursor)

### What was built or decided
- Marketing `0.11.7`: Through/Cadence anchors no longer paint a title pin on
  every day between start→end (that looked like daily “Pinterest flow” tags).
  Pins mark start (+ end if different) only. Lead-up/cadence day cues also
  skip when that day already has a Need/slot card for the same anchor
  (removes MWF double tags next to the cards).
- Need slot placement was already correct (Pins Mon/Wed/Fri) — display only.

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `2f0618dc-bd55-419f-a4cd-8a59518f300a`
- Marketing `0.11.7`.

### Open / next
1. Hard-refresh `/marketing` — confirm `v0.11.7`; Pinterest flow Need cards
   on MWF only, no daily grey tags / no doubles on those days.
2. Commit/push when asked.

---

## 2026-07-31 — EOD (Cursor)

### What shipped today
- **Live deploy** `b0dfcc55-…` → https://ppc-homebase.pressplaycollective.workers.dev
- Marketing **`0.11.6`**:
  - Cadence / through-dates Need slots (start→end) + clearer density UI;
    format picker (Pins Mon/Wed/Fri); Type **Cadence** + **+ Add type…**;
    event-panel `ppc-select` lift menus; lead-up off clears empty slots;
    lead-up/cadence cues show event name.
  - Split width + Ideas height memory fixed (stale cloud `layoutPrefs` no
    longer overwrites live resize on save).
  - Calendar / Pipeline views full-bleed again (Split inline width no longer
    sticks when leaving Split).
- Planner **`2.10.7`**: Overview category names editable per month; panel
  Category select; Enter-to-save rename fixed (`saveToFirestore` typo).
- Task Board unchanged `1.10.4`.

### Versions (live)
- Marketing `0.11.6` · Planner `2.10.7` · Task Board `1.10.4`
- Latest deploy: `b0dfcc55-d4f7-4de8-9278-a7ffa60ac974`

### Open / next
1. Commit/push uncommitted work on `cursor/homebase` when asked
   (keep `.cursor/settings.json` local).
2. Smoke: Cadence Pins 3/wk through Jan; Split/Ideas resize survives reload;
   Calendar tab full width; Overview rename Enter.
3. Parked: Need-slot → Fill from Ideas; project delete UI; dark theme;
   Unassigned rollover; cadence tune after real posting weeks.

### Notes for next session
- Short kickoff: “continue from handoff”.
- Local: `wrangler dev --port 8787 --remote` for live KV.
- Deploy only when asked.

---

## 2026-07-31 — Overview rename Enter fix (Cursor)

### What was built or decided
- Planner `2.10.7`: Overview category rename Enter was a no-op because commit
  called missing `saveToCloud` (real helper is `saveToFirestore`) — threw before
  refresh, so the input stayed open. Fixed call + hardened Enter/Esc (keydown
  + keyup), one rename at a time, always exit edit mode.

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `e1a4f32f-b7ef-49c2-ac5d-b74cb79a0de3`
- Planner `2.10.7`.

---

## 2026-07-31 — Calendar view full width (Cursor)

### What was built or decided
- Marketing `0.11.6`: Calendar (and Pipeline) view modes no longer stay stuck
  at the Split pane width. Inline flex/width from Split resize is cleared when
  leaving Split; Calendar-only CSS forces full-bleed calendar pane.

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `3d050b6d-85e4-4229-91ea-2902321f7031`
- Marketing `0.11.6` Calendar full-width fix.

### Open / next
1. Hard-refresh `/marketing` — Calendar tab should span the page.

---

## 2026-07-31 — Split layout memory fix (Cursor)

### What was built or decided
- Marketing `0.11.5`: Split calendar width + Ideas board height now stick.
  Root cause: `saveData` preferred stale cloud `layoutPrefs` over the live
  resize vars, so any later save (idea edit, etc.) wrote the old width back.
  Fix: always sync from in-memory split/mood; rewrite localStorage keys on
  every save; re-apply pane width + Ideas height after every `renderBoard`
  / refresh / init.
- Also includes `0.11.4`: event panel `ppc-select` dropdowns + **+ Add type…**
  (`customAnchorTypes`).

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `7816d528-7c63-4245-9e37-0d0fc6c17289`
- Marketing `0.11.5` (layout memory + ppc-select/custom types).

### Open / next
1. Hard-refresh `/marketing` — confirm `v0.11.5` (not cached `v0.5.8`).
2. Drag split + Ideas height, reload — should restore.
3. + Event → lift dropdowns; Type → + Add type….
4. Commit/push when asked.

---

## 2026-07-31 — Event panel ppc-select + custom types (Cursor)

### What was built or decided
- Marketing `0.11.4`: Event add/edit panel dropdowns use shared `ppc-select`
  (Type, Slot format, When to place, Density) — lift menus, not native OS.
- Type dropdown includes **+ Add type…**; inline name form adds a custom type
  persisted on marketing DATA as `customAnchorTypes: [{id,label}]`. Built-ins
  stay Event / Release / Cadence. Pins for custom types use cadence-like
  `.cal-anchor-pin--custom` styling. `normalizeAnchorType` accepts custom ids.

### Deployed
- Superseded by `0.11.5` / `7816d528-…` (see entry above).
- Earlier: `5499df55-1791-420f-b4db-422e8596722b`

### Open / next
- Covered by `0.11.5` entry above.

---

## 2026-07-31 — Cadence slots + clearer density UI (Cursor)

### What was built or decided
- Marketing `0.11.3`: Event panel content placement redesigned.
  - **When:** Before start (lead-up) *or* Between start & end (ongoing cadence).
  - **Slot format:** IG Post / Story / Pinterest / Reel (Pinterest uses Mon/Wed/Fri).
  - Type **Cadence (ongoing)** defaults to through-dates + Pinterest.
  - Density presets: clearer Name / Weeks before start / Posts each week labels;
    weeks hidden in through mode; Add only saves a preset — Save event places slots.
- Fits “Pinterest 3×/week until January” without AI slot stuffing.
- Also ships Planner `2.10.6` (per-month overview cat rename + panel category select).

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `76b621df-991c-4f5a-9ece-a4ef1c0b3fb8`
- Removed accidental Cursor edit-conflict copy of `marketing.html` before clean redeploy.

### Open / next
1. Hard-refresh `/marketing` — confirm `v0.11.3`; create Cadence Pins through Jan.
2. Hard-refresh `/planner` — confirm `v2.10.6` overview rename + category select.
3. Commit/push when asked.

---

## 2026-07-31 — Lead-up off + planner cats (Cursor)

### What was built or decided
- Marketing `0.11.2`: Lead-up toggle lives on the **event panel** (not Need
  cards). Uncheck + Save clears empty auto lead-up slots; filled content
  stays. Day cues + empty Need slots show the event name (not just “Lead-up”).
- Planner `2.10.6`: Overview category labels editable **per month** (click
  name → rename; clear restores default). Card panel Category is a coloured
  select so you can refile pills.

### Deployed
- Local only — deploy when asked.

### Open / next
1. Smoke-test: open event → uncheck lead-up → empty slots gone; cues named.
2. Overview rename for one month only; change a pill’s category in panel.
3. Commit/push when asked.

---

## 2026-07-31 — EOD (Cursor)


### Versions (live)
- Marketing `0.11.1` · Planner `2.10.5` · Task Board `1.10.4`
- Latest deploy: `1bf23828-8623-45c4-ba97-5b605762d680`

### Open / next
1. Commit/push uncommitted Marketing/Planner/HANDOFF on
   `cursor/homebase` when asked (`.cursor/settings.json` stay local).
2. Delete old `ppc-planner-worker` folder when unlocked.
3. Calendar cadence: tune after real posting weeks; parked project delete UI /
   dark theme / Unassigned rollover.

### Notes for next session
- Short kickoff: “continue from handoff”.
- Local: `wrangler dev --port 8787 --remote` if you need production data.
- Deploy only when asked.

---

## 2026-07-31 — Marketing layout memory (Cursor)

### What was built or decided
- Marketing `0.11.1`: Split calendar width + Ideas board height now remember
  reliably. localStorage remains personal (`ppc-marketing-split-pct` /
  `ppc-marketing-mood-h`); on drag also writes `DATA.layoutPrefs` into
  marketing KV for team defaults. Restore: local first → cloud prefs →
  hardcoded defaults. Remount/`renderBoard` re-applies CSS vars.

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `1bf23828-8623-45c4-ba97-5b605762d680`
- Also ships Marketing `0.11.0` week calendar + Event lead-up, Planner
  `2.10.5` revenue-chart load-flash fix.

### Open / next
1. Hard-refresh live `/marketing` — confirm `v0.11.1`, week rows, + Event,
   Split/Ideas layout memory.
2. Hard-refresh `/planner` — confirm `v2.10.5`, no chart flash.
3. Commit/push when asked (GitHub remote now `ppc-homebase`).

---

## 2026-07-31 — Marketing week calendar + events (Cursor)

### What was built or decided
- Marketing `0.11.0`: Content Calendar uses Planner-style **week rows** —
  Earlier weeks collapsed (current month / past months), live weeks open,
  Prev/Today/Next month nav kept. **+ Event** opens create/edit panel
  (name, type Event|Release, dates, description, lead-up checkbox + rule).
- Lead-up: sparse Need `ig-post` slots on **Mon/Tue/Thu/Fri only**, ~2/week;
  Event = 3 weeks, Release = 4 weeks; **Add rule** for longer windows.
  Idempotent per anchor+date; days get Lead-up highlight cue.
- Planner `2.10.5`: hide Monthly Revenue chart until first `renderVertical`
  (kills load flash of empty chart before calendar paints).
- Cursor Agents stay keyed to the folder the chat was opened in — use
  `ppc-homebase` for new threads; old chats stay under `ppc-planner*`.

### Deployed
- Local only — deploy when asked.

### Open / next
1. Smoke-test local `/marketing` week collapse + + Event lead-up placement.
2. Smoke-test `/planner` — no revenue-chart flash on navigate from Home.
3. Deploy when asked.
4. Prefer `wrangler dev --remote` when you need live KV data locally
   (plain `wrangler dev` uses empty local KV — looks like missing/old cards).

### Notes
- GitHub remote now `https://github.com/jarvis-tuttlebee/ppc-homebase.git`
  (repo renamed; old Agents threads stay under `ppc-planner*`).

---

## 2026-07-31 — EOD (Cursor)

### What shipped today
- **PPC - HOMEBASE** rename live: worker `ppc-homebase`, URL
  https://ppc-homebase.pressplaycollective.workers.dev (`85db5e40-…`).
  Old `ppc-planner` worker deleted (404).
- **Marketing calendar** progressed through the day → live ~`0.10.3`:
  month grid (no week chrome), one Mon–Sun **Target this week** strip,
  planner-family day pills + dashed `+`, Split | Calendar | Pipeline modes,
  split resize gutter, Ideas height gutter + scroll-zoom; Review caption /
  tags / music (`0.10.0`).
- **Planner ↔ Task Board sync:** Save no longer clobbered by stale board
  fetch; undated cards → Unassigned / Any; mirrors update (not delete);
  card delete cleans planner mirrors. Planner `2.10.4` (save crash typo),
  Kanban `1.10.4`.
- **Home:** title encoding fix, master-res logo (`?v=5`), tag → Homebase /
  now **PPC - HOMEBASE**.
- Deduped bad planner/kanban mirrors earlier in the day.
- Project rule `.cursor/rules/handoff.mdc` (always apply) so new agents
  read `HANDOFF.md` first without a long kickoff prompt.
- Branch `cursor/homebase` has prior Review/calendar work
  pushed; local still has uncommitted rename + polish on top.

### Versions (live)
- Canonical: https://ppc-homebase.pressplaycollective.workers.dev
- Marketing `0.10.3` · Planner `2.10.4` · Task Board `1.10.4`
- Latest homebase deploy: `85db5e40-60a7-4976-bc4d-1411162fe681`

### Open / next
1. Open Cursor on `…/Press Play Collective/ppc-homebase` (not the old
   `ppc-planner-worker` folder); delete old folder when unlocked.
2. Rename GitHub repo when `gh` is available (remote still `ppc-planner`).
3. Commit/push remaining local changes on `cursor/homebase`
   when asked.
4. Fix title mojibake again if tabs show `PPC - HOMEBASE � …` (UTF-8 dash).
5. Calendar cadence: keep grid-first; tune after real posting weeks.
6. Parked: Need-slot → “Fill from Ideas”; project delete UI re-home;
   planner Projects/Releases; dark theme; Unassigned month rollover.

### Notes for next session
- Short kickoff is enough: “continue from handoff” — rule loads HANDOFF.
- Prefer `wrangler dev` on `:8787`; deploy only when asked.
- Format **IG Post** fills the calendar grid counter; Reels optional.

---

## 2026-07-31 — Rename to PPC - HOMEBASE (Cursor)

### What was built or decided
- Worker renamed `ppc-planner` → `ppc-homebase`. Canonical live URL is now
  https://ppc-homebase.pressplaycollective.workers.dev
- Branding already in place: titles / Home tag `PPC - HOMEBASE`; tool names
  stay Annual Planner / Task Board / Marketing. `localStorage` keys unchanged
  (`ppc-planner-data`, etc.).
- Local folder rename + GitHub rename attempted in same pass (see Deploy /
  notes below if anything failed).

### Deployed
- Live: https://ppc-homebase.pressplaycollective.workers.dev
- Version: `85db5e40-60a7-4976-bc4d-1411162fe681`
- Old worker `ppc-planner` deleted; old URL now 404.
- Local copy at `…/Press Play Collective/ppc-homebase` (in-place rename
  blocked while Cursor had the old folder open; old `ppc-planner-worker`
  may still exist — delete manually when unlocked).
- GitHub rename skipped (`gh` CLI not on PATH); remote still
  `https://github.com/jarvis-tuttlebee/ppc-planner.git`.

---

## 2026-07-31 — Ideas height + scroll-zoom (Cursor)

### What was built or decided
- Marketing `0.10.3`: Ideas board has a bottom drag gutter to resize height
  (persisted). Scroll over the board zooms (no Ctrl); drag empty space pans.
- Also ships Split horizontal resize gutter from `0.10.2`.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `e843546d-5f9f-4dc2-bfce-8c236541dcd8`

---

## 2026-07-31 — Split view resize drag (Cursor)

### What was built or decided
- Marketing `0.10.2`: Split layout has a drag gutter between Calendar and
  Pipeline (persists width %). Double-click gutter resets to default;
  arrow keys nudge when focused.

### Deployed
- Included in `e843546d-…` with `0.10.3`.

---

## 2026-07-31 — Dedupes + Marketing view modes (Cursor)

### What was built or decided
- Removed Homebase duplicates (archived first):
  - Planner: double-mirror Ode (`mir-kmir-…`), orphan Eliza event, undated
    Lock in Printer mirror.
  - Task Board: undated Manufacturer sourcing (kept planner-linked `kmir-…`).
- Marketing `0.10.1`: layout toggles **Split | Calendar | Pipeline** (persisted).
  Split uses a narrower/denser calendar so the Ideas→Review pipeline has room.
  Parked for later: Need-slot → “Fill from Ideas” side panel.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `de4c1e0f-3a49-421a-ad0b-3b23242a2baa`

---

## 2026-07-31 — Planner save crash fix (Cursor)

### What was built or decided
- Planner `2.10.4`: panel Save (and a few drag/delete paths) called a
  misspelled persist helper that did not exist → toast
  "Could not save — try again". Pointed those call sites at the real
  `saveTo*` function.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `a66fdbeb-e075-4718-b1ec-972a91a0515f`

---

## 2026-07-31 — Review caption / tags / music (Cursor)

### What was built or decided
- Marketing `0.10.0`: Content Review publish package fields — **Caption**,
  **Tags**, **Music** (before Ready to schedule). Same fields editable on
  Calendar panel after handoff. Tweaks placeholder no longer mentions caption.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `3d333a2f-e2ee-4d94-9f31-09c2faad768a`
- Removed leftover Cursor edit-conflict copy of `marketing.html` before clean redeploy.

---

## 2026-07-31 — Deploy Home + logo (Cursor)

### What was built or decided
- Deployed Home title fix, master-res logo (`?v=5`), Homebase tag, plus latest
  planner/kanban/marketing HTML.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `8b312a06-81e1-44da-b683-792aea5367ca`

---

## 2026-07-31 — Home title + logo + Homebase tag (Cursor)

### What was built or decided
- Fixed Home tab title mojibake (`ΓÇö` → proper `—`): was corrupted UTF-8
  in `index.html` (`Press Play — Home`). `:8787` is just the local port.
- Replaced tiny compressed logo (518×126 / 3KB) with master-res wordmark
  (1346×280); cache `?v=5` on Home / Planner / Kanban / Marketing.
- Tag under logo: **Internal Tools** → **Homebase**.

### Deployed
- Local only until asked (or pending prior sync deploy).

---

## 2026-07-31 - Deploy Planner 2.10.3 + Kanban 1.10.4 (Cursor)

### What was built or decided
- Deployed Planner `2.10.3` + Kanban `1.10.4` save/sync fixes (Marketing already live earlier).
- Removed leftover Cursor edit-conflict copy of `kanban.html` from `public/` before upload.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `edef956d-242d-4216-9136-dd4862f0957a`

---

## 2026-07-31 — Planner Save + board↔planner sync (Cursor)

### What was built or decided
- **Save changes bug (planner `2.10.3`):** panel save could throw on
  subtasks / then `syncDateMirrors` clobber just-saved linked pills from a
  stale board fetch. Fixed with scoped `readSubtasks`, try/catch + toast,
  `cache: 'no-store'`, `preferLocalId` so board→planner doesn't overwrite the
  pill you just saved, and relative `/api/*` URLs.
- Clearing a linked card's date parks it in **Unassigned / Any** (not deleted).
- Orphan `srcCardId` mirrors dropped when the Task Board card is gone.
- **Kanban `1.10.4`:** undated cards → Unassigned / Any; `upsertPlannerMirror`
  updates parked mirrors instead of deleting them; no race with auto-assign;
  delete card removes planner mirrors; relative APIs + `cache: 'no-store'`.

### Deployed
- Local only — deploy when asked.

---

## 2026-07-31 — Deploy Marketing 0.9.9 (Cursor)

### What was built or decided
- Deployed Marketing `0.9.9` (month grid, one weekly target, split view,
  planner-family day cells).
- Removed accidental Cursor edit-conflict copies of `marketing.html` from
  `public/` and redeployed clean.

### Deployed
- Live: https://ppc-planner.pressplaycollective.workers.dev
- Version: `1df2acfd-0b15-4fab-bcd5-9a7ff16ab15e`

---

## 2026-07-31 — Month grid, no week chrome (Cursor)

### What was built or decided
- Marketing `0.9.9`: calendar is one month grid (month name + dates), not
  stacked week sections with week-range labels. Target strip label is plain
  **Target this week** (no Jul 27–Aug 2 range).

### Deployed
- Local only.

---

## 2026-07-31 — One weekly target strip (Cursor)

### What was built or decided
- Marketing `0.9.8`: removed per-week goal / Grid·Stories·Discover strips under
  each calendar week row. Only the top **Target this week** remains.
- Week goals are Mon–Sun; form clears for the new week after Sunday ends
  (auto-refresh Monday). Past weeks keep saved numbers for day cues.

### Deployed
- Local only.

---

## 2026-07-31 — Calendar split + planner-family days (Cursor)

### What was built or decided
- Marketing `0.9.7`: desktop **split view** — Calendar sticky left, production
  pipeline (Ideas→Review) right; stacks on narrow screens.
- Day cells match **Annual Planner** family: pill cards + dashed `+` (not
  whole-day click / dashed unscheduled box). Target-day highlights + Grid /
  Story / Discover cues kept.
- Slot status is a compact **Need / Open / Ready** chip (click toggles
  scheduled); full Scheduled/Unscheduled select stays in the side panel.
- Content layer + campaign anchor use homebase `createPpcSelect`.

### Deployed
- Local only.

---

## 2026-07-31 — Editable weekly targets (Cursor)

### What was built or decided
- Marketing `0.9.6`: removed phase names (Steady grid / Ode warm-up etc.).
- **Target this week** is editable: goal note + Grid / Stories / Discover
  counts. Same controls under each week row. Stored in `DATA.weekGoals`
  keyed by week-start Sunday. Day highlights follow those numbers.

### Deployed
- Local only.

---

## 2026-07-31 — Calendar first + quiet week label (Cursor)

### What was built or decided
- Marketing `0.9.5`: **Content Calendar** moved to top of Marketing sections;
  production pipeline (Ideas → Prep → Exec → Review) stays below.
- Calendar expands by default; plan dates first, fill from pipeline under.
- Removed “Support week (unavailable)” label — that window is neutral
  **Steady grid** with 0 targets (team doesn’t need the internal reason).

### Deployed
- Local only.

---

## 2026-07-31 — Calendar-first Need content + Pinterest days (Cursor)

### What was built or decided
- Marketing `0.9.4`: **click a calendar day** → Need content menu (IG Post /
  Story / Pinterest / Reel) creates a dashed placeholder slot on that date.
- Placeholder = `needContent` + Unscheduled; fill Idea text to clear the need.
- **Pinterest** target days Mon/Wed/Fri (every second weekday) with Pin cues.
- Ode pace softened to **~1 grid/week** (~5 posts lead-up). Support week 0.
- Locked plan notes: venue shoot **Fri 7 Aug**; poster **~14 Aug** (3 weeks out);
  5–6 Ode posts max; world-building fills if capacity allows.
- `cadence.rhythm = press-play-v2`.

### Open / next
1. Hard-refresh local `/marketing`; click Aug days to place Ode slots.
2. Deploy when asked.

### Deployed
- Local only. Live still `0.9.1` (`c71f06ca-…`).

---

## 2026-07-31 — Press Play days + calendar status (Cursor)

### What was built or decided
- Marketing `0.9.3`: publish rhythm = **Mon/Thu** (+ Tue/Fri extras) —
  Press Play days only. Stories share those days (companion with grid).
- **30 Jul–3 Aug** = Support week (0 targets) — unavailable.
- Softened later phases (no 3-grid / 4-story ramps); floor stays ~2+2.
- Calendar cards: **Scheduled / Unscheduled** status dropdown (slot + panel
  + unscheduled queue), Task Board–style coloured select.
- `cadence.rhythm = press-play-v1` one-time upgrades old Tue/Fri pattern.

### Open / next
1. Smoke-test local calendar highlights on Mon/Thu + status dropdown.
2. Deploy when asked.

### Deployed
- Local only until asked. Live still `0.9.1` (`c71f06ca-…`).

---

## 2026-07-31 — Calendar target days + Review Need date (Cursor)

### What was built or decided
- Marketing `0.9.2`: publish rhythm on cadence (`Tue/Fri` grid, `Wed/Sat`
  stories; extras Sun/Mon when phase needs 3).
- Calendar day cells highlight **target** (empty) vs **filled**; Grid/Story cues.
- Review: **Need date** badge + count strip when `scheduleAt` empty.
- Aug–Sep floor ~18–20 grid posts + ~18–20 story days (phase table).
- Vault Marketing System todos for day highlight + Need date marked done.

### Open / next
1. Smoke-test local `/marketing` calendar + Review undated cards.
2. Schedule 1–2 grid posts onto Tue/Fri this week.
3. Deploy when asked; project delete UI / dark polish still parked.

### Deployed
- Local only until asked. Live still `0.9.1` (`c71f06ca-…`).

---

## 2026-07-30 — EOD (Cursor)

### What shipped today
- **Task Board** `1.10.3` — centred project titles, drag polish, typographic nav.
- **Marketing pipeline:** Review board (`0.8.0`) → month calendar (`0.9.0`) →
  **grid-first cadence** (`0.9.1`).
- **Content Review:** inspo + context + shot media + outcome/tweaks + schedule handoff.
- **Content Calendar:** month grid, Ode (4 Sep) + FDW/008 (22–25 Oct) anchors,
  phase strip, unscheduled queue; targets = **grid posts first** (solo capacity).
- Re-read Phase 2 strategy doc; shifted from 4-week release cycle to
  event-anchored + steady grid rhythm.

### Versions (live)
- Planner `2.10.2` · Task Board `1.10.3` · Marketing **`0.9.1`**
- Latest deploy: `c71f06ca-123a-44d4-8dc6-30accca48f89`
- https://ppc-planner.pressplaycollective.workers.dev

### Open / next
1. Schedule 1–2 grid posts this week; tune `cadence` after a few weeks of real output.
2. Project delete UI re-home; planner Projects/Releases parked; dark theme polish.
3. Local changes still uncommitted on `main` — commit when asked.
4. `wrangler dev` on `:8787` for local; restart if connection refused.

### Notes for next session
- Format **IG Post** fills the grid counter on the calendar.
- Reels are optional — only when you have footage.
- No intern yet: keep targets low-friction; system should reduce guilt, not add quota pressure.

---

## 2026-07-30 — Calendar cadence: grid-first (Cursor)

### What was built or decided
- Marketing `0.9.1`: phase targets retuned for **solo capacity** (no intern yet).
- Primary weekly metric = **IG grid posts** (`ig-post`), not Reels/carousels.
- Baseline ~**2 grid posts + 2 story days/week**; Reels optional/bonus when footage exists.
- Phases renamed (Steady grid, Ode warm-up, etc.); lower story targets.

### Open / next
1. Use calendar for 2–3 weeks; adjust `cadence` from real output.
2. Resume: planner delete UI, dark theme polish, commit when asked.

### Deployed
- Live: `c71f06ca-123a-44d4-8dc6-30accca48f89`
- https://ppc-planner.pressplaycollective.workers.dev/marketing
- Marketing `0.9.1` (grid-first cadence on top of `0.9.0` calendar).

---

## 2026-07-30 — Content Calendar month grid (Cursor)

### What was built or decided
- Marketing `0.9.0`: Content Calendar is a **month grid** (not a sorted list).
- **Anchors** seeded: Ode to Sirens (4 Sep), 008 @ FDW (22–25 Oct, night 24 Oct).
- **Phase strip** + per-week summary; scheduled cards on day cells; unscheduled queue.
- Schedule panel: content layer + campaign anchor link.

### Deployed
- Superseded by `0.9.1` deploy above (`c71f06ca-…`).

---

## 2026-07-30 — Content Review Board (Cursor)

### What was built or decided
- Marketing `0.8.0`: **Content Review** + minimal **Content Calendar** list.
- Exec → Review arm-then-apply (same card id). Review panel: inspo thumb,
  collapsible plan/exec context, shot/edited media well (drop/paste image or
  video poster) + Drive/video URL, Content outcome, Tweaks, Ready to schedule
  (date; pillar/format = content type).
- Review → Calendar moves card into `sections.schedule` (date-sorted list).
- Archive restore supports `review` + `schedule` kinds.
- Calendar list is functional handoff only — real calendar layout next.

### What's mid-flight / not finished
- Full calendar grid / month layout still not built (list only — works, wrong UX).
- No video binary in KV — poster image + URL only.

### Open / next
1. Build Content Calendar month layout (replace sorted list).
2. Project delete UI re-home; planner Projects/Releases parked; dark theme polish.
3. Commit when asked.

### Deployed
- Live: `044ef96d-33d6-4383-92f5-59cbcc71669e`
- https://ppc-planner.pressplaycollective.workers.dev
- Marketing `0.8.0` (Content Review + schedule list handoff).

---

## 2026-07-30 — Task Board polish + tighter nav tracking (Cursor)

### What was built or decided
- Task Board project titles centred (equal side columns).
- Project drag: 3-line grip icon; lift/scale while dragging; insert line above/below drop target.
- Home + app nav letter-spacing tightened (`0.06em`) to match body type.

### Deployed
- Live: `59491306-4ce4-4927-ba69-2a062cdb53ba`
- https://ppc-planner.pressplaycollective.workers.dev
- Task Board `1.10.3` + typographic nav + tighter tracking.

---

## 2026-07-30 — Typographic nav (Cursor)

### What was built or decided
- Removed outline pills from Home + app nav. All-caps, tracked type in black /
  slate (`#2C2C2C` / `#6B7A8D`); active = darker weight, no indigo fill.
- Home menu is a hairline-separated vertical list (site-style).
- Settings gear is borderless; dark mode matches.

### Deployed
- Included in `59491306-4ce4-4927-ba69-2a062cdb53ba`.

---

## 2026-07-30 — End of day (Cursor)

### What shipped today
- **Home** at `/` (logo + 3 pills); planner at `/planner`.
- **Pill save fix:** await full kanban patch before `syncDateMirrors()`; empty-title toast.
- **Calendar:** Sun–Sat month grid; past weeks under **Earlier weeks**; today marker.
- **Task Board:** Priority section; no legend / Board / Projects pills; coloured titles;
  `+` to add project; **Complete projects** + `::` drag reorder/complete.
- **Archive (30d)** + unified **Settings** (gear, right of nav): Archive · Dark · Refresh.
  Shared `/js/ppc-homebase.js` + `/api/archive`.
- **Logo:** black wordmark from transparent `pressplay-logo.png` (first black file was a
  solid JPEG — fixed + redeployed). Logo → `/`; Home pill removed.

### Versions (live)
- Planner `2.10.2` · Task Board `1.10.2` · Marketing `0.7.4`
- Logo fix deploy: `15d3b625-8b9b-47c9-995f-38490f4be326`
- Earlier EOD: `d3f48cc9-f64b-4a21-b7f9-099696af257c`
- https://ppc-planner.pressplaycollective.workers.dev

### Open / next
1. Project delete UI removed with Projects view — re-home if needed.
2. Old planner Projects/Releases settings still parked (hidden).
3. Kanban/Marketing dark theme is lightweight only.
4. Local changes may still be uncommitted on `main` (incl. `public/planner.html`,
   `public/js/`, logos) — commit when asked.

### Notes for next session
- Prefer local `wrangler dev` on `:8787`; deploy only when asked.
- Calendar is grid (not flat date list). Settings is gear icon, not a nav pill.
- Soft-delete goes through `PPC.archivePush` / Settings → Archive.

---

## 2026-07-30 — Black logo as Home (Cursor)

### What was built or decided
- Swapped header/home logos to `pressplay-logo-black.png` (PRESS PLAY COLLECTIVE).
- Removed Home nav pill on Planner / Task Board / Marketing; logo links to `/`.
- App name sits in the header right on Kanban/Marketing.

### Deployed
- See end-of-day entry above.

---

## 2026-07-30 — Calendar month grid (Cursor)

### What was built or decided
- Planner Calendar is a **Sun–Sat month grid** (shared DOW header, week rows,
  bleed days) — not the flat date list.
- In the current month, weeks that have fully ended collapse under
  **Earlier weeks**; expand state in `localStorage`. Today marked on the day
  number. Unassigned / Any kept.

### Deployed
- Earlier today: `20fe48c1-3aa5-422c-a949-517e47387135` (pre-logo).
- Logo + EOD deploy: see end-of-day entry.

---

## 2026-07-30 — Task Board layout + Settings icon (Cursor)

### What was built or decided
- Task Board: removed colour legend and Board/Projects nav pills.
- Section rows: no numbers/dots; project titles use category colour.
- `+` under active projects opens new-project modal; **Complete projects**
  section at bottom (`project.completed`); `::` handle reorders / drags into
  Complete (or back onto `+` / active rows to restore).
- Settings is a gear icon on the right of the nav on Planner, Task Board,
  and Marketing (not a pill).

### What's mid-flight / not finished
- Project delete UI was only on the old Projects view; not re-added yet.

### Deployed
- Included in day’s deploys — see end-of-day entry.

---

## 2026-07-30 — Homebase platform updates (Cursor)

### What was built or decided
- **Home restored** at `/` (logo + 3 pills); Annual Planner moved to
  `/planner`. Nav later: logo → `/` (Home pill removed).
- **Pill save fix:** linked pills await full kanban patch (title/body/tasks/
  project/status/dueDate) before `syncDateMirrors()`; empty title toast.
- **Calendar:** evolved to Sun–Sat month grid (flat list abandoned).
- **Priority tasks** virtual section above Misc (due-date, not complete;
  drop does not change `project`).
- **Soft-delete Archive (30d):** `/api/archive` KV + `/js/ppc-homebase.js`;
  deletes from planner/kanban/marketing archive; Recover + toast.
- **Unified Settings:** Archive · Dark mode · Refresh. Shared dark via
  `localStorage` `ppc-dark-mode`.

### What's mid-flight / not finished
- Old planner Projects/Releases settings parked (hidden), not redesigned.
- Kanban/Marketing dark theme is lightweight (shared CSS), not full polish.

### Deployed
- See end-of-day entry.

---

## 2026-07-30 — Calendar rename + Ideas restack (Cursor)

### What was built or decided
- Marketing `0.7.1`:
  - Section label **Content Schedule** → **Content Calendar** (id still
    `schedule`).
  - Prep: pillar colour dots removed; pillar + format titles centred.
  - Ideas: height-aware column pack on move-to-Prep (and forced restack) so
    remaining cards close gaps with an 8px gap and don’t overlap portraits.

### What's mid-flight / not finished
- Local only — deploy when asked.

### Next logical step
1. Smoke-test Prep headers + Ideas reshuffle after Prepare.
2. Deploy when ready.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.7.1` local).

---

## 2026-07-30 — Prep columns + shared selects (Cursor)

### What was built or decided
- Marketing `0.7.0`:
  - Removed Placement note from Prep UI (data kept if present; calendar later).
  - Prep lanes fill row width (no empty gutter). Format columns:
    Organic unchanged; Email = Campaign / Flow / Automation / Newsletter;
    Ads = Campaign / Ad sets / Ads; Website = Design / Blog / Features.
    Old format IDs migrate (email→campaign, meta-ad→campaign, website→design).
  - Shared `/js/ppc-select.js` custom select (lift menu). Coloured only when
    needed (Marketing pillar/category; Kanban category + status; Planner
    status). Format / project / column / week stay neutral.

### What's mid-flight / not finished
- Local only — deploy when asked.
- Email/Website column labels can still be tuned from feedback.

### Next logical step
1. Smoke-test Marketing Prep columns + selects; Planner/Kanban panel selects.
2. Deploy when ready.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.7.0` local).

---

## 2026-07-30 — Panel list bullets stay inside (Cursor)

### What was built or decided
- Marketing `0.6.9`: `.panel-desc` lists get left padding so bullets don’t
  render outside the field border; overflow clipped/scrollable.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.6.9` local).

---

## 2026-07-30 — Ideas open crash fix (Cursor)

### What was built or decided
- Marketing `0.6.8`: click-to-open was broken for everyone (not local-only).
  `openPanel` → `buildIdeaPanelProps` called `getElementById('pCat')` before
  the color-select was in the document → TypeError, panel never opened.
  Switched Category/Pillar wiring to `onChange` callbacks.

### What's mid-flight / not finished
- Local only — deploy when asked.

### Next logical step
1. Hard-refresh and confirm Ideas cards open.
2. Deploy when ready.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.6.8` local).

---

## 2026-07-30 — Ideas click-to-open fix (Cursor)

### What was built or decided
- Marketing `0.6.7`: Ideas cards open on any non-drag click (incl. image).
  Drag threshold now uses screen pixels (canvas-space threshold broke opens
  when zoomed out). Native image drag disabled. Image click still arms
  paste focus when opening.

### What's mid-flight / not finished
- Local only — deploy when asked.

### Next logical step
1. Hard-refresh and confirm click opens Ideas cards.
2. Deploy when ready.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.6.7` local).

---

## 2026-07-30 — Exec field collapse + Ideas open fix (Cursor)

### What was built or decided
- Marketing `0.6.6`:
  - Ideas cards: open on mouseup when not dragged (`mousedown` preventDefault
    was killing click). Image still click=paste focus, dblclick=open.
  - Execution panel: removed duplicate **Execution** notes. Stages stay
    Prep → Exec. Exec fields = Idea + Production plan (from Prep) +
    Products / Location / Requirements / Date. Legacy `executionNotes`
    fold into empty productionPlan once then deleted.
  - Canvas coords synced to 8000×5600 with viewport background.

### What's mid-flight / not finished
- Local only — deploy when asked.

### Next logical step
1. Smoke-test Ideas click-to-open + Exec panel without Execution notes.
2. Deploy when ready.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.6.6` local).

---

## 2026-07-30 — Colored Pillar/Category dropdown (Cursor)

### What was built or decided
- Marketing `0.6.5`: custom color select for Pillar (`pPillar`, `preparePillar`)
  and Ideas Category (`pCat`) — category-colored labels, no OS blue highlight,
  lift on hover/selected. Format stays native select.

### What's mid-flight / not finished
- Local only — deploy when asked.
- Production/Execution field overlap decision still pending.

### Next logical step
1. Smoke-test Pillar/Category menus on local `/marketing`.
2. Decide Production plan vs Execution notes.

### Deployed
- Still live `0.6.2` until asked (`0.6.3`–`0.6.5` local).

---

## 2026-07-30 — Ideas canvas + Prep lanes polish (Cursor)

### What was built or decided
- Marketing `0.6.4`:
  - Ideas canvas: viewport owns continuous dot background; canvas
    transparent + much larger so zoom-out doesn’t show an edge cut-off.
  - Prep format lanes: shared board with vertical column rules (not loose
    rounded cards).
  - Idea field consistent across Ideas / Prep / Exec (short, no fmt bar);
    Prep order remains Idea → Production plan → Placement note.
  - Pillar titles colored with category swatch for memory when choosing.
- Open design Q: Production plan vs Execution notes feel redundant —
  discuss before combining stages or collapsing fields.

### What's mid-flight / not finished
- Local only — deploy when asked.
- Production/Execution field overlap decision pending.

### Next logical step
1. Local smoke-test zoom-out + Prep column lines + pillar title colors.
2. Decide: keep stages, merge duplicate plan/notes fields (see chat).

### Deployed
- Still live `0.6.2` until asked to deploy (`0.6.3`–`0.6.4` local).

---

## 2026-07-30 — Ideas/Prep: Description → Idea (Cursor)

### What was built or decided
- Marketing `0.6.3`: Ideas + Prep side panel label **Description** → **Idea**;
  short height (same as Execution Idea); placeholder **Add an idea…**.
  Production plan / Placement note unchanged. Execution untouched.

### What's mid-flight / not finished
- Local only — deploy when asked. Continue Ideas + Prep → Execution polish.

### Next logical step
1. Local smoke-test Ideas + Prep panels (`wrangler dev` /marketing).
2. Deploy when ready, or next polish notes.

### Deployed
- Still live `0.6.2` (`c43e68f9-…`) until asked to deploy.

---

## 2026-07-30 — Prep polish → Execution bridge (Cursor)

### What was built or decided
- Marketing `0.6.0`:
  - Removed Prep **Duplicate** (park for Schedule/calendar — cross-format
    copies with publish-specific copy).
  - Prepare / Execute are arm-then-apply: click Prepare or Execute, then
    Enter / Ctrl+Enter (or the primary button). Plain save keeps panel open;
    click outside / Close to leave. Shift+Enter = newline while armed.
  - Execution: larger list cards; wide panel with image left; fields —
    Idea (short, from Prep body), Production plan, Execution notes,
    Products, Location, Requirements, Date/time.
  - Earlier: Ideas open UX, thumbs, Placement note rename, Prep × delete.

### What's mid-flight / not finished
- Calendar-stage Duplicate (change format + publish details).
- Full Execution polish from live testing; Review / Schedule still skeletons.
- Remaining Miro Ideas import deferred; Unassigned month-rollover parked.

### Known issues or things flagged but not fixed
- Marketing KV ~3 MB base64 images — watch growth.

### Next logical step
1. Smoke-test Prepare → Execute → exec panel fields on live.
2. Iterate Execution from feedback, or calendar Duplicate later.

### Deployed
- Version ID `c43e68f9-f422-4b67-b672-892382c86526` (0.6.2)
  → https://ppc-planner.pressplaycollective.workers.dev
---

## 2026-07-28 — EOD (Cursor)

### What was built or decided
- Marketing: Content Preparation board; Prepare inline (no modal); centred nav;
  Miro half-import earlier (27 ideas live).
- Planner: Sun–Sat weeks + bleed; Unassigned/Any (no Any column); complete sync
  + minimise; Overview prefs; drop Gantt + category legend.
- Kanban: centred nav; complete minimise; mirror/auto-assign updates.
- Deployed: `015041cb-386a-4e7b-b245-51968bfa7832`
  → https://ppc-planner.pressplaycollective.workers.dev
- Committed this EOD (marketing + planner + kanban + HANDOFF).

### What's mid-flight / not finished
- Remaining Miro import deferred.
- Unassigned month-rollover not done.
- Execution / Review / Schedule still skeletons.
- Portrait Ideas thumbnail whitespace may still need a pass.

### Known issues or things flagged but not fixed
- Marketing KV ~3 MB base64 images — watch growth.

### Next logical step
1. Continue Preparation board polish, or Unassigned rollover.
2. Pull on other machines before more edits.

---

## 2026-07-28 — Drop Gantt + legend (Cursor)

### What was built or decided
- Removed Gantt / horizontal view and Timeline/Gantt format menu.
- Removed category name/colour legend from planner heading; slim toolbar
  (Settings + Dark only). Planner `2.9.1`.

### Next logical step
- Continue Preparation board polish, or Unassigned month-rollover later.

### Deployed
- Version ID `015041cb-386a-4e7b-b245-51968bfa7832`
  → https://ppc-planner.pressplaycollective.workers.dev

---

## 2026-07-28 — Week bleed + complete sync (Cursor)

### What was built or decided
- Planner week scheme **5**: Sun–Sat weeks; trailing weeks **bleed** into the
  next month as live cells (not empty). Leading week only when Sunday is before
  the planner year (so Jul 1–4 still show). Later months don’t duplicate the
  previous month’s trailing week. July 2026 still has 5 calendar rows — that’s
  a real month grid; Aug won’t re-show the Jul 26 week.
- Complete sync both ways (status + Done column); Task Board complete cards
  minimise. Auto-assign → Unassigned / Any.
- Versions: planner `2.9.0`, kanban `1.9.2`. Not deployed.

### What's mid-flight / not finished
- Month rollover of leftover Unassigned still not done.
- Local uncommitted; deploy when asked.

### Next logical step
1. Smoke-test July weeks + Aug 1 bleed cell; complete sync both apps.
2. Deploy.

---

## 2026-07-28 — Calendar weeks + Unassigned/Any (Cursor)

### What was built or decided
- Removed week **Any** column. Renamed bottom row to **Unassigned / Any**.
- Former Any-slot cards (`week` set, `day` null) migrate to Unassigned.
- Week rows are true **Sun–Sat** calendar weeks (scheme 4); always 7 columns;
  out-of-month days are empty placeholders (no more 9–10 day week rows).
- Planner version `2.8.1`. Not deployed yet.

### What's mid-flight / not finished
- Month rollover of leftover Unassigned cards still not done.
- Local uncommitted HTML + HANDOFF.

### Known issues or things flagged but not fixed
- First load after deploy runs weekScheme 3→4 migrate once (re-bands dated
  pills; parks undated Any pills).

### Next logical step
1. Local smoke-test Week View (Jul should show proper Sun–Sat rows).
2. Deploy when ready.

---

## 2026-07-28 — Cross-app nav + planner S/M polish (Cursor)

### What was built or decided
- Unified centred nav (Home / Annual Planner / Task Board / Marketing) on
  planner + kanban (marketing already matched). Refresh removed; tab-focus
  refresh when panel closed.
- Planner: future months default to Overview; per-month Overview/Week choice
  persisted in localStorage. Complete pills minimised (`pill--complete`).
- Unassigned placement fix: await Task Board due-date clear on drop; keep
  parked mirrors with `week == null` instead of deleting them on sync.
- Versions: planner `2.8.0`, kanban `1.9.1`. Parked for later: merge
  Unassigned+Any + month rollover.

### What's mid-flight / not finished
- Local uncommitted across `index.html` / `kanban.html` / `marketing.html` /
  `HANDOFF.md`.
- Unassigned/Any merge + next-month rollover still not done.

### Known issues or things flagged but not fixed
- Base64 marketing images ~3 MB.
- Portrait Ideas thumbnail whitespace may still need a pass.
- Not deployed yet this pass — ask before `wrangler deploy`.

### Next logical step
1. Deploy when ready; smoke-test Unassigned park + Overview defaults.
2. Continue Preparation board, or tackle Unassigned/Any merge later.

---

## 2026-07-28 — Preparation UX: Prepare inline + nav polish (Cursor)

### What was built or decided
- Marketing nav pills centred; Refresh button removed.
- Auto-refresh on tab focus when side panel is closed (no hourly poll).
- Section heading colour dots removed (pillar swatches on prep board kept).
- Ideas panel: **Prepare** toggle expands Pillar + Format dropdowns inline;
  bottom button becomes **Prepare & save**; move modal deleted.
- Version `0.4.2`. Remaining Miro import deferred / out of scope.

### What's mid-flight / not finished
- Local uncommitted: `public/marketing.html` + `HANDOFF.md` (still vs `25aebb7`).
- Content Execution / Review / Schedule still skeletons.
- Portrait thumbnail whitespace on Ideas may still need a pass.

### Known issues or things flagged but not fixed
- Ideas KV payload ~3 MB base64 — watch size if library grows.
- Still no git commit/push of marketing.html / HANDOFF.

### Deployed
- Version ID `bc1b24f8-c642-4948-b465-ebdf17c76a99`
  → https://ppc-planner.pressplaycollective.workers.dev

### Next logical step
1. Confirm live shows v0.4.2 + Prepare inline (hard-refresh if needed).
2. Continue Preparation board polish, or commit/push when ready.

---

## 2026-07-28 — EOD: deploy + Miro half-import (Cursor)

### What was built or decided
- Miro half-import: **27** Content Ideas live (first 28 of 57 frame images;
  1 skipped 403). Empty body, `organic`, JPEG ≤1200 @ ~0.85; prep kept (3).
- Deployed: Version ID `2a698460-e0ae-43b8-aa04-007b664436a5`
  → https://ppc-planner.pressplaycollective.workers.dev
- Assets already matched prior Preparation deploy; worker redeployed clean.

### What's mid-flight / not finished
- Second half (~29) Miro images not imported (deferred).
- **Local uncommitted:** `public/marketing.html` + `HANDOFF.md` (Preparation
  UI + polish vs `25aebb7`). No commit/push this EOD.

### Known issues or things flagged but not fixed
- Ideas KV payload ~3 MB — watch before half-2 import.
- Portrait thumbnail whitespace may still need a pass.

### Next logical step
1. Commit/push Preparation + HANDOFF when ready.
2. Continue Preparation board (see newer entry above).

---

## 2026-07-28 — Miro Content Ideas half-import done (Cursor)

### What was built or decided
- Restored live Content Ideas from Miro Pressplay frame
  `3458764660977230640` (board `uXjVG9DCPEc=`): first 28 of 57 image items;
  **27** posted (1 skipped HTTP 403). `body: ''`, `cat: 'organic'`, JPEG max
  edge 1200 @ ~0.85 as `imageData`, packed compact mood-board grid.
- GET then POST `/api/marketing`: replaced sample ideas; kept preparation (3),
  execution/review/schedule empty. No commit.

### What's mid-flight / not finished
- Second half (~29) Miro images not imported.
- Still no git commit/push of today's marketing.html Preparation work.

### Known issues or things flagged but not fixed
- Payload ~3 MB base64 — watch size before half-2 import.

### Next logical step
- See EOD entry above.

---

## 2026-07-28 — Marketing Preparation + polish; Ideas wipe; Miro import parked (Cursor)

### What was built or decided
- **Content Preparation** shipped on `/marketing`: pillars Organic / Email / Ads /
  Website; Organic format lanes (IG Post, Reel, Story, Pinterest, TikTok).
- Marketing colour categories = pillars (not Task Board cats). TikTok = Organic
  format only.
- Move Ideas → Preparation (removes from Ideas); prep panel has production plan
  + fit note; drag between lanes; duplicate to another format.
- Empty pillars/lanes render as slim bars; lanes with cards scroll vertically.
- Ideas polish: restack on delete/move when sparse; Home nav pill; centred
  section titles; removed `001` numbers; `/` no longer triggers browser search;
  panel Image always between props and Description.
- Deployed safe init so a failed/empty cloud load does **not** POST sample data
  over real KV. Live version: `d73201e9-f470-4ae0-bcb2-32f52e9fcd0b`.

### What's mid-flight / not finished
- ~~Live Content Ideas wiped / Miro import parked~~ — half-import completed in
  session above.
- Content Execution / Review / Schedule still skeletons.
- **No git commit/push** of today's `marketing.html` / HANDOFF changes yet.

### Known issues or things flagged but not fixed
- Base64 images in KV size risk remains.
- Portrait thumbnail whitespace on Ideas may still need a pass.

### Next logical step
- See newer session entry above.

---

## 2026-07-27 — Marketing System Phase A: Content Ideas mood board (Cursor)

### What was built or decided
- New page **`/marketing`** — **Marketing System** header, five vertical
  sections (Task Board section pattern):
  1. **Content Ideas** — built: zoomable mood-board canvas with image cards,
     category-coloured cards, right-click empty space → Add card, drag image
     onto canvas or card, click image well then paste (`Ctrl+V`/`Cmd+V`),
     `+ Add idea` button, 4 sample cards, drag cards to reposition, drag empty
     space to pan, `Ctrl`+scroll to zoom, cards shrink as the idea count grows
  2. **Content Preparation** — skeleton (empty, "Coming in a later phase")
  3. **Content Execution** — skeleton
  4. **Content Review** — skeleton
  5. **Content Schedule** — skeleton
- New API **`/api/marketing`** → KV key `marketing` (ideas + reserved section
  arrays). Images stored on each card (`imageData`) with resized dimensions
  tracked for thumbnail/panel display.
- Nav links added on Annual Planner and Task Board → Marketing.
- Worker name / live URL stay **`ppc-planner`** (no hostname migration).
- No cross-links to planner or kanban yet.
- Cards now open a Task Board-style side panel for editing **Description** and
  **Category**. Category uses the PPC palette and tints the card like Task
  Board cards. Panel also shows a larger image preview.
- Portrait thumbnails were adjusted late in session to reduce side whitespace
  by matching the image well height more closely to image aspect ratio.

### What's mid-flight / not finished
- ~~Sections 2–5 not implemented — next agent picks up Content Preparation.~~
  Preparation shipped 2026-07-28; Execution / Review / Schedule remain.
- Committed/pushed as `25aebb7` after Phase A session.

### Known issues or things flagged but not fixed
- Base64 images in KV JSON will grow payload size — fine for reference
  mood-board images; move to R2/CDN if library gets large.
- Planner KV still has undated `mir-*` events (pre-existing).

### Next logical step
- See 2026-07-28 entry.

---

## 2026-07-25 — OTS Layout plan mirror spot-check (Cursor)

### What was built or decided
- Spot-checked live card **OTS - Layout plan** (`k1784776542819`, project
  Ode to Sirens, due `2026-08-07`) against Annual Planner mirror
  `mir-k1784776542819`.
- Baseline: exactly one ⇄ mirror, dates/slot match (Aug 2026 week 1 day 7).
- Live API tests (with restore): board→timeline due-date move PASS;
  timeline→board due-date move PASS; production date restored to
  `2026-08-07`.
- Cursor round-trip + GitHub push auth are confirmed working on this Mac.

### What's mid-flight / not finished
- Deploys stay manual (`npx wrangler deploy`) — unchanged.

### Known issues or things flagged but not fixed
- Planner KV still has several `mir-*` events with `srcCardId` but
  `dueDate: null` (undated mirrors left on the timeline). Not specific to
  OTS; worth a cleanup pass later if they clutter Aug/Jul views.

### Next logical step
- Hand Cursor real product work when ready. No deploy needed for this
  HANDOFF-only update.

---

## 2026-07-24 — Second agent swapped: Perplexity Computer → Cursor Pro (Claude Code)

### What was built or decided
- The second coding agent working on this repo alongside Claude Code is now
  **Cursor Pro**, not Perplexity Computer (Perplexity Pro was separately
  dropped/refunded on 2026-07-22 for research use — unrelated tool, noted
  here only to avoid confusion between the two).
- Repo cloned onto Jarvis's Mac at
  `~/Desktop/Press Play Collective/ppc-planner-worker` (deliberately outside
  the Obsidian vault — a code repo inside the vault risks iCloud sync
  conflicts and unnecessary Obsidian file indexing). Windows machine still
  has its own clone at the equivalent path; both point at the same GitHub
  remote.
- Cursor should open this exact folder and read this file first each
  session — same round-trip pattern used for any agent here: report
  understanding + flag anything mid-flight before making changes.

### What's mid-flight / not finished
- Deploys stay a single-agent/manual step (`npx wrangler deploy`) — Cursor
  and Claude Code both write code and push to GitHub, but do not deploy
  independently, to avoid version drift between the two live apps.
- ~~Jarvis to spot-check the "OTS - Layout plan" kanban card~~ — done
  2026-07-25 (see entry above).

### Known issues or things flagged but not fixed
- None new this session.

### Next logical step
- ~~Give Cursor its first read-only task~~ — done; round-trip confirmed.

---

## 2026-07-23 — Repo init (Claude Code)

### What was built or decided
- First git repo for this codebase — previously just a loose folder deployed
  straight to Cloudflare via `wrangler deploy`, no version control at all.
- Pushed initial commit to `https://github.com/jarvis-tuttlebee/ppc-planner.git`
  (`main` branch) so a second agent (Perplexity Computer) can work on this
  codebase in parallel without silently clobbering edits.
- Added `.gitignore` for `.wrangler/` (local wrangler cache/tmp, not source).

### What's mid-flight / not finished
- `public/kanban.html` (Task Board) was edited most recently (2026-07-23,
  before repo init) — worth checking `git log -p -- public/kanban.html`
  once there's more history, since this first commit has no prior diff to
  compare against.
- No CI/deploy automation from git — deploys are still manual
  (`npx wrangler deploy` from this folder). Pushing to GitHub does **not**
  automatically deploy.

### Known issues or things flagged but not fixed
- None flagged yet — this is the first tracked session.

### Next logical step
- Confirm the Perplexity agent can clone/pull from the GitHub remote and
  give it a small first task to verify the round-trip before relying on it.
- Whoever deploys next should run `wrangler deploy` manually after pulling
  latest — git and Cloudflare are not wired together.

---

## Quick reference

- **Live:** https://ppc-homebase.pressplaycollective.workers.dev
- **Deploy:** `npx wrangler deploy` from this folder (needs Node on PATH)
- **KV binding:** `PLANNER_KV` (id `2f3dc18365c2477595cc76e4f3303746`)
- **Structure:** `public/index.html` (Home), `public/planner.html` (Annual
  Planner), `public/kanban.html` (Task Board), `public/marketing.html`
  (Marketing System), `public/js/ppc-homebase.js` + `ppc-select.js`,
  `src/index.js` (Worker — `/api/data`, `/api/kanban`, `/api/kanban/patch`,
  `/api/marketing`, `/api/archive`)

