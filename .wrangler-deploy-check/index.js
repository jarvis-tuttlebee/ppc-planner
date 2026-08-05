var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var KV_KEYS = {
  "/api/data": "main",
  "/api/kanban": "kanban",
  "/api/marketing": "marketing",
  "/api/archive": "archive"
};
var ARCHIVE_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
function purgeArchiveItems(items) {
  const cutoff = Date.now() - ARCHIVE_TTL_MS;
  return (Array.isArray(items) ? items : []).filter((e) => {
    if (!e || !e.deletedAt) return false;
    const t = new Date(e.deletedAt).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}
__name(purgeArchiveItems, "purgeArchiveItems");
var index_default = {
  async fetch(request, env) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    const url = new URL(request.url);
    if (url.pathname === "/api/kanban/patch") {
      if (request.method === "OPTIONS") return new Response(null, { headers: cors });
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
      let patch = {};
      try {
        patch = await request.json();
      } catch (e) {
      }
      const board = await env.PLANNER_KV.get("kanban", "json") || {};
      if (!Array.isArray(board.cards)) board.cards = [];
      const removeIds = new Set(Array.isArray(patch.remove) ? patch.remove : []);
      if (removeIds.size) board.cards = board.cards.filter((c) => !removeIds.has(c.id));
      (Array.isArray(patch.upsert) ? patch.upsert : []).forEach((incoming) => {
        if (!incoming || !incoming.id) return;
        const i = board.cards.findIndex((c) => c.id === incoming.id);
        if (i >= 0) board.cards[i] = { ...board.cards[i], ...incoming };
        else board.cards.push(incoming);
      });
      await env.PLANNER_KV.put("kanban", JSON.stringify(board));
      return new Response(JSON.stringify({ ok: true, cards: board.cards.length }), {
        headers: { ...cors, "Content-Type": "application/json" }
      });
    }
    const kvKey = KV_KEYS[url.pathname];
    if (!kvKey) {
      return new Response("Not found", { status: 404 });
    }
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") {
      const data = await env.PLANNER_KV.get(kvKey, "json");
      if (kvKey === "archive") {
        const items = purgeArchiveItems(data && data.items);
        if (data && Array.isArray(data.items) && items.length !== data.items.length) {
          await env.PLANNER_KV.put("archive", JSON.stringify({ items }));
        }
        return new Response(JSON.stringify({ items }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify(data || {}), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (request.method === "POST") {
      const body = await request.json();
      if (kvKey === "archive") {
        const items = purgeArchiveItems(body && body.items);
        await env.PLANNER_KV.put("archive", JSON.stringify({ items }));
        return new Response(JSON.stringify({ ok: true, items: items.length }), {
          headers: { ...cors, "Content-Type": "application/json" }
        });
      }
      await env.PLANNER_KV.put(kvKey, JSON.stringify(body));
      return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    return new Response("Method not allowed", { status: 405 });
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
