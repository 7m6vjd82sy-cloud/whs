// Cloudflare Workers 用の中継サーバー（ブラウザから公式APIに直接つながらない場合だけ使う）
// 公式ギフトコードAPIへの転送だけを許可する。
const API = "https://wos-giftcode-api.centurygame.com/api/";
const ALLOWED = ["player", "gift_code", "captcha"];

const cors = {
  "Access-Control-Allow-Origin": "*",
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
