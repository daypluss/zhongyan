"use client";

import type { ConnectionSettings } from "@/lib/live/settings";
import type { FeedItem } from "@/lib/live/types";

export class RelayError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}

function relayBase(settings: ConnectionSettings) {
  const raw = settings.relayUrl.trim().replace(/\/$/, "");
  if (!raw) throw new RelayError("relay_unset");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new RelayError("relay_url_invalid");
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    throw new RelayError("relay_url_invalid");
  }
  return url;
}

async function call(settings: ConnectionSettings, path: string, params?: Record<string, string>, init?: RequestInit) {
  const base = relayBase(settings);
  const url = new URL(path, `${base.origin}${base.pathname.replace(/\/$/, "")}/`);
  if (params) {
    for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  }
  const headers = new Headers(init?.headers);
  if (settings.relayToken) headers.set("X-Relay-Token", settings.relayToken);
  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch {
    throw new RelayError("relay_unreachable");
  }
  let body: { ok?: boolean; error?: string; items?: FeedItem[]; text?: string; title?: string; content?: string };
  try {
    body = await response.json();
  } catch {
    throw new RelayError(response.ok ? "bad_response" : `relay_${response.status}`);
  }
  if (!response.ok || body.ok === false) throw new RelayError(body.error || `relay_${response.status}`);
  return body;
}

export function fetchFeed(settings: ConnectionSettings, feedUrl: string) {
  return call(settings, "v1/feed", { url: feedUrl });
}

export function fetchArticle(settings: ConnectionSettings, pageUrl: string) {
  return call(settings, "v1/article", { url: pageUrl });
}

export function fetchStudy(settings: ConnectionSettings, title: string, text: string) {
  return call(settings, "v1/ai", undefined, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Ai-Key": settings.aiKey },
    body: JSON.stringify({
      provider: settings.aiProvider,
      model: settings.aiModel,
      title,
      text,
    }),
  });
}

export function probeStudyKey(settings: ConnectionSettings) {
  return call(settings, "v1/ai", undefined, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Ai-Key": settings.aiKey },
    body: JSON.stringify({
      provider: settings.aiProvider === "deepseek" ? "deepseek" : "openai",
      model: settings.aiModel,
      probe: true,
    }),
  });
}

export function relayErrorCopy(code: string) {
  switch (code) {
    case "relay_unset":
      return "Relay is not set.";
    case "relay_url_invalid":
      return "The relay URL in Settings is not a valid http(s) address.";
    case "relay_unreachable":
      return "The relay did not respond.";
    case "bad_token":
      return "The relay rejected the token in Settings.";
    case "origin_not_allowed":
      return "The relay refused this page's origin.";
    case "host_not_allowed":
      return "That address is not on the relay allowlist.";
    case "extraction_failed":
      return "The page did not yield a readable article.";
    case "yicai_not_json":
      return "第一财经 did not return the expected JSON.";
    default:
      return "The source did not load.";
  }
}
