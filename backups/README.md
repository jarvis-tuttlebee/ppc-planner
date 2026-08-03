# Live board backups

Offline copies of production KV so calendar / Homebase cards can be restored
if live data is wiped or corrupted.

## Latest dump

See `LATEST` (stamp) and `LATEST-SUMMARY.json` (counts).

Full payloads live in `live-<stamp>/`:

| File | KV key | API |
| --- | --- | --- |
| `marketing.json` | `marketing` | `/api/marketing` |
| `planner-main.json` | `main` | `/api/data` |
| `kanban.json` | `kanban` | `/api/kanban` |
| `archive.json` | `archive` | `/api/archive` |

## Refresh from live (safe)

```bash
npm run backup:pull
```

GET-only. Does not write to Cloudflare.

## Load into local preview (safe)

Isolated local KV — does **not** use `--remote`, so live is untouched:

```bash
npm run backup:seed-local
npm run dev:local
```

Open http://127.0.0.1:8787/marketing

## Restore onto live (manual / intentional)

Only when you mean to overwrite production. Prefer the in-KV snapshot restore
API first (`POST /api/marketing/restore` with a `snapshotId` from
`/api/marketing/snapshots`).

Forced full marketing replace from a file dump:

```bash
curl -X POST https://ppc-homebase.pressplaycollective.workers.dev/api/marketing \
  -H 'Content-Type: application/json' \
  -H 'X-PPC-Force-Overwrite: 1' \
  --data-binary @backups/live-<stamp>/marketing.json
```

Same pattern for `/api/data`, `/api/kanban`, `/api/archive` (no force header
needed on those).
