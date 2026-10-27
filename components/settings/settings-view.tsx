"use client";

import { SectorPicker } from "@/components/sectors/sector-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryById } from "@/lib/data/categories";
import { studyErrorCopy, testAiKey } from "@/lib/live/ai";
import { DEFAULT_MODELS, emptyConnection, useConnection, writeConnection, type AiProvider, type ConnectionSettings } from "@/lib/live/settings";
import { useUser } from "@/lib/store";
import { useEffect, useState } from "react";

export function SettingsView() {
  const current = useConnection();
  const { state } = useUser();
  const [draft, setDraft] = useState<ConnectionSettings>(emptyConnection);
  const [note, setNote] = useState("");
  const [testing, setTesting] = useState(false);
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const sectorNames = state.interests.map((id) => categoryById[id]?.name).filter(Boolean);

  useEffect(() => {
    setDraft(current);
  }, [current]);

  function patch(partial: Partial<ConnectionSettings>) {
    setDraft((value) => ({ ...value, ...partial }));
    setNote("");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Settings</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Connection</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The relay address and any keys stay in this browser. They are not part of the public site, and this page does not ship a default URL.
      </p>

      <label className="mt-6 block text-sm">
        Relay URL
        <Input
          className="mt-1"
          value={draft.relayUrl}
          placeholder="https://your-name.workers.dev"
          onChange={(event) => patch({ relayUrl: event.target.value })}
          autoComplete="off"
        />
      </label>
      <label className="mt-4 block text-sm">
        Relay token
        <Input
          className="mt-1"
          type="password"
          value={draft.relayToken}
          placeholder="Only if you set RELAY_TOKEN on the worker"
          onChange={(event) => patch({ relayToken: event.target.value })}
          autoComplete="off"
        />
      </label>
      <h2 className="mt-8 font-serif text-2xl tracking-tight">Sectors</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        These sectors lead the briefing and filter the live list. Saved in this browser with the rest of your desk.
      </p>
      <p className="mt-2 text-sm">{sectorNames.length === 0 ? "All sectors" : sectorNames.join(", ")}</p>
      <Button className="mt-3" type="button" variant="outline" onClick={() => setSectorsOpen(true)}>
        Edit sectors
      </Button>
      <SectorPicker open={sectorsOpen} onOpenChange={setSectorsOpen} />

      <h2 className="mt-8 font-serif text-2xl tracking-tight">Study model</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Optional. Gemini is recommended and has a free tier. With a key, a live or pasted article can request a translation, takeaways, why this matters, and a quiz. Word glosses and business lingo stay in the browser either way. Without a key those generated sections stay empty.
      </p>
      <label className="mt-4 block text-sm">
        Provider
        <select
          className="mt-1 h-8 w-full rounded-lg border bg-transparent px-2 text-sm"
          value={draft.aiProvider}
          onChange={(event) => patch({ aiProvider: event.target.value as AiProvider })}
        >
          <option value="gemini">Gemini (recommended)</option>
          <option value="openai">OpenAI</option>
          <option value="deepseek">DeepSeek</option>
        </select>
      </label>
      <label className="mt-4 block text-sm">
        Model
        <Input
          className="mt-1"
          value={draft.aiModel}
          placeholder={DEFAULT_MODELS[draft.aiProvider]}
          onChange={(event) => patch({ aiModel: event.target.value })}
          autoComplete="off"
        />
      </label>
      <label className="mt-4 block text-sm">
        API key
        <Input
          className="mt-1"
          type="password"
          value={draft.aiKey}
          placeholder="Stored only in localStorage"
          onChange={(event) => patch({ aiKey: event.target.value })}
          autoComplete="off"
        />
      </label>
      {draft.aiProvider === "gemini" && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
            Create a free key in Google AI Studio
          </a>
          . Gemini is called from this browser. The key is not sent to the relay.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={testing}
          onClick={() => {
            setTesting(true);
            setNote("");
            void testAiKey({ ...draft, relayUrl: draft.relayUrl.trim(), aiModel: draft.aiModel.trim() })
              .then(() => setNote("Key works."))
              .catch((error: unknown) => setNote(studyErrorCopy(error)))
              .finally(() => setTesting(false));
          }}
        >
          {testing ? "Testing key…" : "Test key"}
        </Button>
        <Button
          onClick={() => {
            writeConnection({ ...draft, relayUrl: draft.relayUrl.trim(), aiModel: draft.aiModel.trim() });
            setNote("Saved in this browser.");
          }}
        >
          Save
        </Button>
      </div>
      {note && <p className="mt-3 text-sm text-muted-foreground">{note}</p>}
      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
        Live articles are for your own reading. Do not republish them. The worker stores nothing; the browser cache is yours.
      </p>
    </div>
  );
}
