# AGENTS.md

Also read `HANDOFF.md` first — per repo rules it is the source of truth for live
versions, deploy rules, open follow-ups, and file layout.

## Cursor Cloud specific instructions

### What this is
`ppc-homebase` is a single Cloudflare Worker (`src/index.js`) that serves static
pages from `public/` (Home `/`, `/planner`, `/kanban`, `/marketing`) and a
same-origin JSON API under `/api/*`. State lives in a KV namespace
(`PLANNER_KV`) and image uploads in an R2 bucket (`MEDIA_BUCKET`). There is no
separate frontend build step — the HTML/JS in `public/` is served as-is.

### Running locally (dev)
- Start the dev server: `npm run dev` (alias for `wrangler dev --port 8787`).
  Serves on http://127.0.0.1:8787.
- `wrangler dev` runs everything locally via miniflare: `PLANNER_KV` and
  `MEDIA_BUCKET` are **local** emulated stores, so no Cloudflare credentials are
  needed for development. Local KV/R2 start **empty** on a fresh VM — seed data
  by POSTing to the API (e.g. `POST /api/marketing`, `POST /api/kanban/patch`)
  or just create items through the UI.
- The board UI does not always re-render newly saved cards immediately; a page
  reload reliably reflects persisted state (this is existing app behavior, not
  an environment problem).

### Live data / deploy (needs a token — usually out of scope here)
- `npm run dev:remote` (`wrangler dev --remote`) and `npx wrangler deploy` talk
  to real Cloudflare KV/R2 and require `CLOUDFLARE_API_TOKEN`, which is **not**
  set in the cloud VM. Without it, use plain local `wrangler dev`. Deploy only
  when explicitly asked (see `HANDOFF.md`).

### Lint / test / build
- There is no lint or automated test tooling configured in this repo, and no
  frontend build. "Build" for this project means `wrangler deploy` (Worker
  bundling happens inside wrangler). Validate changes by running `npm run dev`
  and exercising the pages / `/api/*` endpoints.

### Dependencies
- `package.json` pins `wrangler` as a dev dependency; `npm install` populates
  local `node_modules` (gitignored). If this `package.json` is not merged,
  `npx wrangler dev` still works but downloads wrangler on demand — merging it
  keeps startup fast and version-pinned.
