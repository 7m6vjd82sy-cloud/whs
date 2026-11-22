// WHSギフトコード用の中継サーバー（Cloudflare Workers）
const API = "https://wos-giftcode-api.centurygame.com/api/";
const ALLOWED = ["player", "gift_code", "captcha"];
const SITE = "https://7m6vjd82sy-cloud.github.io";

const cors = {
  "Access-Control-Allow-Origin": SITE,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    const path = new URL(req.url).pathname.split("/").pop();
    if (req.method !== "POST" || !ALLOWED.includes(path)) {
      return new Response("Not found", { status: 404, headers: cors });
    }
    const res = await fetch(API + path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: await req.text(),
    });
    return new Response(res.body, {
      status: res.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
