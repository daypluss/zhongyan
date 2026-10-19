"use client";

import { useEffect, useState } from "react";

const KEY = "zhongyan.connection";
const EVENT = "zhongyan-connection";

export type AiProvider = "openai" | "deepseek";

export type ConnectionSettings = {
  relayUrl: string;
  relayToken: string;
  aiProvider: AiProvider;
  aiModel: string;
  aiKey: string;
  hideDemo: boolean;
};

export const emptyConnection: ConnectionSettings = {
  relayUrl: "",
  relayToken: "",
  aiProvider: "openai",
  aiModel: "",
  aiKey: "",
  hideDemo: false,
};

export function readConnection(): ConnectionSettings {
  if (typeof window === "undefined") return emptyConnection;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyConnection;
    const parsed = JSON.parse(raw) as Partial<ConnectionSettings>;
    return {
      ...emptyConnection,
      ...parsed,
      relayUrl: String(parsed.relayUrl ?? "").trim(),
      relayToken: String(parsed.relayToken ?? ""),
      aiKey: String(parsed.aiKey ?? ""),
      aiModel: String(parsed.aiModel ?? ""),
      aiProvider: parsed.aiProvider === "deepseek" ? "deepseek" : "openai",
      hideDemo: Boolean(parsed.hideDemo),
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
