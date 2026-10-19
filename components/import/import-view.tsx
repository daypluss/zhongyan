"use client";

import { PersonalLibrary } from "@/components/personal/personal-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categorize } from "@/lib/live/categorize";
import { saveDocument } from "@/lib/live/db";
import { stableId } from "@/lib/live/id";
import { fetchArticle, relayErrorCopy } from "@/lib/live/relay";
import { useConnection } from "@/lib/live/settings";
import type { LiveSource } from "@/lib/live/sources";
import Link from "next/link";
import { useState } from "react";

const FALLBACK: LiveSource = {
  id: "import",
  name: "Imported",
  feed: "",
  home: "",
  kind: "rss",
  fallback: "internet",
};

export function ImportView() {
  const settings = useConnection();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function tryLink() {
    const page = url.trim();
    if (!page) {
      setMessage("Add a link first, or just paste the text.");
      return;
    }
    if (!settings.relayUrl) {
      setMessage("No relay is set. Paste the text below. A link is optional.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await fetchArticle(settings, page);
      const body = (result.text ?? "").trim();
      if (body.length < 20) {
        setMessage("The relay returned no usable text. Paste the article instead.");
        return;
      }
      setText(body);
      if (!title.trim() && result.title) setTitle(result.title);
      setMessage("The relay returned page text. Read it, then save. WeChat and some sites block this.");
    } catch (error) {
      const code = error instanceof Error ? error.message : "fetch_failed";
      setMessage(`${relayErrorCopy(code)} Paste the text instead. A link is best-effort, and WeChat often blocks it.`);
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    const body = text.trim();
    if (body.length < 20) {
      setMessage("Paste the article text. Saving does not require a relay or a link.");
      return;
    }
    const id = `imp-${stableId(`${url.trim()}|${title.trim()}|${body.slice(0, 80)}`)}`;
    const name = source.trim() || "Imported";
    await saveDocument({
      id,
      kind: "import",
      sourceId: "import",
      sourceName: name,
      title: title.trim() || "Untitled",
      url: url.trim(),
      publishedAt: "",
      excerpt: "",
      feedText: "",
      supplied: "pasted",
      text: body,
      textMode: "pasted",
      textFrom: "paste",
      audioUrl: "",
      category: categorize(`${title} ${body.slice(0, 400)}`, "", { ...FALLBACK, name }),
      error: "",
      savedAt: new Date().toISOString(),
    });
    setText("");
    setMessage("Saved in this browser. Open it from the list below, or from Read and Explore.");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Import</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Paste an article</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Paste the Chinese text. Title, source, and a link are optional. The text stays in this browser. A link can be fetched through your relay, but pasting works with no relay at all.
      </p>
      <div className="mt-6 space-y-3">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title (optional)" />
        <Input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Source (optional)" />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Original URL (optional)" />
          <Button type="button" variant="outline" onClick={() => void tryLink()} disabled={busy}>
            {busy ? "Fetching…" : "Try the link"}
          </Button>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste the Chinese article here"
          className="min-h-64 w-full rounded-lg border bg-transparent px-3 py-2 font-cn text-base leading-relaxed outline-none focus-visible:border-ring"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => void save()}>
            Save to library
          </Button>
          <Link href="/settings" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Relay settings
          </Link>
        </div>
        {message && <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>}
      </div>
      <PersonalLibrary />
    </div>
  );
}
