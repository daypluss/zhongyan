import { Readability } from "@mozilla/readability";
import { XMLParser } from "fast-xml-parser";
import { parseHTML } from "linkedom";

export interface Env {
  RELAY_TOKEN?: string;
}

const SOURCE_HOSTS = new Set([
  "www.36kr.com",
  "36kr.com",
  "www.tmtpost.com",
  "tmtpost.com",
  "www.zhidx.com",
  "zhidx.com",
  "www.199it.com",
  "199it.com",
  "www.yicai.com",
  "yicai.com",
  "feed.xyzfm.space",
  "www.xiaoyuzhoufm.com",
  "xiaoyuzhoufm.com",
]);

const AI_HOSTS = new Set(["api.openai.com", "api.deepseek.com"]);

const UA = "ZhongyanPersonalReader/1.0 (personal reading)";
const FEED_LIMIT = 4_000_000;
const PAGE_LIMIT = 2_000_000;
const ITEM_CAP = 20;
const EXCERPT_CAP = 360;
const TEXT_CAP = 30_000;

const xml = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
  textNodeName: "#text",
  trimValues: true,
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");
    const allowed = allowedOrigin(origin);
    if (request.method === "OPTIONS") {
      if (!allowed || !origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(origin) });
    }
    if (!allowed || !origin) return json({ ok: false, error: "origin_not_allowed" }, 403, null);

    if (env.RELAY_TOKEN) {
      const token = request.headers.get("X-Relay-Token") ?? "";
      if (token !== env.RELAY_TOKEN) return json({ ok: false, error: "bad_token" }, 401, origin);
    }

    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/v1/feed") {
        return await cached(request, ctx, origin, () => feedResponse(url));
      }
      if (request.method === "GET" && url.pathname === "/v1/article") {
        return await cached(request, ctx, origin, () => articleResponse(url));
      }
      if (request.method === "POST" && url.pathname === "/v1/ai") {
        return await aiResponse(request, origin);
      }
      return json({ ok: false, error: "not_found" }, 404, origin);
    } catch (error) {
      const message = error instanceof Error ? error.message : "fetch_failed";
      const status = message === "host_not_allowed" || message === "bad_url" ? 400 : 502;
      return json({ ok: false, error: message }, status, origin);
    }
  },
};

function allowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (origin === "https://daypluss.github.io") return true;
  try {
    const url = new URL(origin);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function cors(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type, X-Relay-Token, X-Ai-Key",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  };
}

function json(body: unknown, status: number, origin: string | null) {
  const headers = new Headers({ "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  if (origin) {
    for (const [key, value] of Object.entries(cors(origin))) headers.set(key, value);
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function cached(request: Request, ctx: ExecutionContext, origin: string, load: () => Promise<unknown>) {
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) {
    const headers = new Headers(hit.headers);
    for (const [key, value] of Object.entries(cors(origin))) headers.set(key, value);
    return new Response(hit.body, { status: hit.status, headers });
  }
  const body = await load();
  const response = json(body, 200, origin);
  response.headers.set("Cache-Control", "public, s-maxage=300");
  ctx.waitUntil(cache.put(request, response.clone()));
  return response;
}

function targetUrl(raw: string | null) {
  if (!raw) throw new Error("bad_url");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("bad_url");
  }
  if (url.username || url.password || (url.protocol !== "https:" && url.protocol !== "http:")) throw new Error("bad_url");
  if (!SOURCE_HOSTS.has(url.hostname)) throw new Error("host_not_allowed");
  return url;
}

async function fetchAllowlisted(url: URL, depth = 0): Promise<{ finalUrl: URL; body: ArrayBuffer; type: string }> {
  if (depth > 3) throw new Error("too_many_redirects");
  if (!SOURCE_HOSTS.has(url.hostname)) throw new Error("host_not_allowed");
  const response = await fetch(url, {
    redirect: "manual",
    headers: { "User-Agent": UA, Accept: "text/html, application/rss+xml, application/xml, application/json, */*" },
  });
  if ([301, 302, 303, 307, 308].includes(response.status)) {
    const location = response.headers.get("Location");
    if (!location) throw new Error("bad_redirect");
    return fetchAllowlisted(new URL(location, url), depth + 1);
  }
  if (!response.ok) throw new Error(`upstream_${response.status}`);
  const length = Number(response.headers.get("Content-Length") ?? "0");
  if (length > FEED_LIMIT) throw new Error("too_large");
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > FEED_LIMIT) throw new Error("too_large");
  return { finalUrl: url, body: buffer, type: response.headers.get("Content-Type") ?? "" };
}

async function feedResponse(url: URL) {
  const target = targetUrl(url.searchParams.get("url"));
  const fetched = await fetchAllowlisted(target);
  const text = new TextDecoder().decode(fetched.body);
  const items = target.hostname.endsWith("yicai.com") ? parseYicai(text, fetched.finalUrl) : parseRss(text, fetched.finalUrl);
  return { ok: true, fetchedAt: new Date().toISOString(), items };
}

async function articleResponse(url: URL) {
  const target = targetUrl(url.searchParams.get("url"));
  const fetched = await fetchAllowlisted(target);
  if (fetched.body.byteLength > PAGE_LIMIT) throw new Error("too_large");
  const html = new TextDecoder().decode(fetched.body);
  const extracted = extractArticle(html, fetched.finalUrl.toString());
  if (!extracted || extracted.text.length < 180) {
    return { ok: false, error: "extraction_failed", url: fetched.finalUrl.toString() };
  }
  return {
    ok: true,
    url: fetched.finalUrl.toString(),
    title: extracted.title,
    text: extracted.text.slice(0, TEXT_CAP),
    mode: "full" as const,
  };
}

function extractArticle(html: string, pageUrl: string) {
  const { document } = parseHTML(html);
  const base = document.createElement("base");
  base.setAttribute("href", pageUrl);
  document.head?.appendChild(base);
  let title = "";
  let text = "";
  try {
    const parsed = new Readability(document).parse();
    title = (parsed?.title ?? "").trim();
    text = (parsed?.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
  } catch {
    text = "";
  }
  if (text.length < 180) {
    const parts: string[] = [];
    document.querySelectorAll("p").forEach((node) => {
      const line = (node.textContent ?? "").replace(/\s+/g, " ").trim();
      if (line.length >= 20) parts.push(line);
    });
    const fallback = parts.join("\n\n").trim();
    if (fallback.length > text.length) text = fallback;
    if (!title) title = (document.querySelector("h1")?.textContent ?? "").replace(/\s+/g, " ").trim();
  }
  if (!text) return null;
  return { title, text };
}

type Item = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  body: string;
  supplied: "full" | "excerpt" | "shownotes";
  audioUrl: string;
  kind: "article" | "podcast";
};

function parseRss(text: string, base: URL): Item[] {
  const doc = xml.parse(text) as Record<string, unknown>;
  const root = asRecord(doc.rss) ?? asRecord(doc.feed) ?? doc;
  const channel = asRecord(root.channel) ?? root;
  const rawItems = asArray(channel.item ?? root.entry);
  return rawItems.slice(0, ITEM_CAP).map((item) => {
    const record = asRecord(item) ?? {};
    const audio = enclosureUrl(record.enclosure);
    const link = xmlText(record.link) || attr(record.link, "@_href") || xmlText(record.guid);
    const description = xmlText(record["content:encoded"]) || xmlText(record.description) || xmlText(record.summary) || xmlText(record.content);
    const plain = stripHtml(description).slice(0, 12_000);
    const body = plain.length >= 180 ? plain : "";
    const supplied = audio ? (body ? "shownotes" : "excerpt") : plain.length >= 800 ? "full" : "excerpt";
    return {
      title: xmlText(record.title).trim(),
      url: absolute(link, base),
      publishedAt: toIso(xmlText(record.pubDate) || xmlText(record.published) || xmlText(record.updated)),
      excerpt: excerpt(description, EXCERPT_CAP),
      body,
      supplied,
      audioUrl: audio ? absolute(audio, base) : "",
      kind: audio ? "podcast" : "article",
    };
  }).filter((item) => item.title && item.url);
}

function parseYicai(text: string, base: URL): Item[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("yicai_not_json");
  }
  const rows = Array.isArray(data) ? data : asArray(asRecord(data)?.data);
  return rows.slice(0, ITEM_CAP).map((row) => {
    const record = asRecord(row) ?? {};
    const path = String(record.url ?? record.NewsUrl ?? "");
    const published = String(record.CreateDate ?? record.LastDate ?? "");
    const notes = String(record.NewsNotes ?? "");
    const plain = stripHtml(notes).slice(0, 12_000);
    const body = plain.length >= 180 ? plain : "";
    return {
      title: String(record.NewsTitle ?? "").trim(),
      url: absolute(path, base),
      publishedAt: toIso(published.includes("T") && !/[zZ]|[+-]\d\d:?\d\d$/.test(published) ? `${published}+08:00` : published),
      excerpt: excerpt(notes, EXCERPT_CAP),
      body,
      supplied: plain.length >= 800 ? "full" : "excerpt",
      audioUrl: "",
      kind: "article" as const,
    };
  }).filter((item) => item.title && item.url);
}

async function aiResponse(request: Request, origin: string) {
  const key = request.headers.get("X-Ai-Key") ?? "";
  if (!key || key.length > 400) return json({ ok: false, error: "missing_ai_key" }, 400, origin);
  let payload: { provider?: string; model?: string; title?: string; text?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "bad_json" }, 400, origin);
  }
  const provider = payload.provider === "deepseek" ? "deepseek" : "openai";
  const endpoint = provider === "deepseek" ? "https://api.deepseek.com/chat/completions" : "https://api.openai.com/v1/chat/completions";
  const host = new URL(endpoint).hostname;
  if (!AI_HOSTS.has(host)) return json({ ok: false, error: "ai_host_not_allowed" }, 400, origin);
  const text = String(payload.text ?? "").slice(0, 12_000);
  if (text.length < 40) return json({ ok: false, error: "article_too_short" }, 400, origin);
  const model = String(payload.model || (provider === "deepseek" ? "deepseek-chat" : "gpt-4o-mini")).slice(0, 80);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You tutor one Chinese article for a personal reader. Use only the supplied text. Do not add companies, figures, dates, or causes that the text does not state. Put anything you infer only in inferences, and start each of those strings with 'Inference:'. Every sentences.cn, quiz.sentence, and quiz.keyPhrase must be copied verbatim from the article. Return JSON with keys sentences (array of {cn, en}), takeaways (array of {cn, en}), whyItMatters (string), facts (string array), inferences (string array), quiz (array of {prompt, options, answer, explanation, sentence, keyPhrase}). options has exactly 4 strings. answer is the index of the correct option.",
        },
        { role: "user", content: `Title: ${String(payload.title ?? "").slice(0, 200)}\n\n${text}` },
      ],
    }),
  });
  if (!response.ok) return json({ ok: false, error: `ai_${response.status}` }, 502, origin);
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";
  return json({ ok: true, content }, 200, origin);
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h1|h2|h3|li|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerpt(html: string, cap = EXCERPT_CAP) {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.length > cap ? `${text.slice(0, cap).trim()}…` : text;
}

function xmlText(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return xmlText(node[0]);
  if (typeof node === "object") {
    const record = node as Record<string, unknown>;
    if (typeof record.__cdata === "string") return record.__cdata;
    if (typeof record["#text"] === "string" || typeof record["#text"] === "number") return String(record["#text"]);
  }
  return "";
}

function attr(node: unknown, name: string) {
  if (!node || typeof node !== "object") return "";
  const value = (node as Record<string, unknown>)[name];
  return typeof value === "string" ? value : "";
}

function enclosureUrl(node: unknown) {
  if (Array.isArray(node)) return enclosureUrl(node[0]);
  return attr(node, "@_url");
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function asArray(value: unknown) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function absolute(value: string, base: URL) {
  try {
    return new URL(value, base).toString();
  } catch {
    return "";
  }
}

function toIso(raw: string) {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const direct = Date.parse(cleaned);
  if (!Number.isNaN(direct)) return new Date(direct).toISOString();
  const match = cleaned.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})\s*([+-]\d{2}:?\d{2})?$/);
  if (!match) return "";
  const zone = match[3] ? (match[3].includes(":") ? match[3] : `${match[3].slice(0, 3)}:${match[3].slice(3)}`) : "+08:00";
  const parsed = Date.parse(`${match[1]}T${match[2]}${zone}`);
  return Number.isNaN(parsed) ? "" : new Date(parsed).toISOString();
}
