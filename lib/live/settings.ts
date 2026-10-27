"use client";

import { useEffect, useState } from "react";

const KEY = "zhongyan.connection";
const EVENT = "zhongyan-connection";

export type AiProvider = "gemini" | "openai" | "deepseek";

export const DEFAULT_MODELS: Record<AiProvider, string> = {
  gemini: "gemini-3.8-flash",
  openai: "gpt-4o-mini",
  deepseek: "deepseek-chat",
};

export type ConnectionSettings = {
  relayUrl: string;
  relayToken: string;
  aiProvider: AiProvider;
  aiModel: string;
  aiKey: string;
};

export const emptyConnection: ConnectionSettings = {
  relayUrl: "",
  relayToken: "",
  aiProvider: "gemini",
  aiModel: "",
  aiKey: "",
};

function storedProvider(parsed: Partial<ConnectionSettings>): AiProvider {
  if (parsed.aiProvider === "gemini" || parsed.aiProvider === "deepseek") return parsed.aiProvider;
  if (parsed.aiProvider === "openai" && String(parsed.aiKey ?? "").trim()) return "openai";
  return "gemini";
}

export function readConnection(): ConnectionSettings {
  if (typeof window === "undefined") return emptyConnection;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyConnection;
    const parsed = JSON.parse(raw) as Partial<ConnectionSettings>;
    return {
      relayUrl: String(parsed.relayUrl ?? "").trim(),
      relayToken: String(parsed.relayToken ?? ""),
      aiKey: String(parsed.aiKey ?? ""),
      aiModel: String(parsed.aiModel ?? ""),
      aiProvider: storedProvider(parsed),
    };
  } catch {
    return emptyConnection;
  }
}

export function writeConnection(next: ConnectionSettings) {
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function useConnection() {
  const [settings, setSettings] = useState<ConnectionSettings>(emptyConnection);
  useEffect(() => {
    const load = () => setSettings(readConnection());
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);
  return settings;
}
