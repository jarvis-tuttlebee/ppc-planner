# HANDOFF

Update this at the end of every session touching this repo, whether that's
Claude Code, Cowork, or Cursor. Keep entries short. Newest session at the top.

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

- **Live:** https://ppc-planner.pressplaycollective.workers.dev
- **Deploy:** `npx wrangler deploy` from this folder (needs Node on PATH)
- **KV binding:** `PLANNER_KV` (id `2f3dc18365c2477595cc76e4f3303746`)
- **Structure:** `public/index.html` (Home), `public/planner.html` (Annual
  Planner), `public/kanban.html` (Task Board), `public/marketing.html`
  (Marketing System), `public/js/ppc-homebase.js` + `ppc-select.js`,
  `src/index.js` (Worker — `/api/data`, `/api/kanban`, `/api/kanban/patch`,
  `/api/marketing`, `/api/archive`)

