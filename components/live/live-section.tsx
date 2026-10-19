"use client";

import { categoryById } from "@/lib/data/categories";
import { categorize, matchesDesk } from "@/lib/live/categorize";
import { readFeed, saveFeed, upsertFeedStub } from "@/lib/live/db";
import { stableId } from "@/lib/live/id";
import { fetchFeed, relayErrorCopy } from "@/lib/live/relay";
import { useConnection } from "@/lib/live/settings";
import { LIVE_SOURCES } from "@/lib/live/sources";
import type { DeskItem } from "@/lib/live/types";
import { formatClock, formatWhen } from "@/lib/format";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SourceState = {
  id: string;
  name: string;
  home: string;
  items: DeskItem[];
  error: string;
  stale: boolean;
};

export function LiveSection() {
  const settings = useConnection();
  const { state } = useUser();
  const [sources, setSources] = useState<SourceState[]>([]);
  const [loading, setLoading] = useState(false);
  const [onlyDesk, setOnlyDesk] = useState(true);
  const configured = Boolean(settings.relayUrl);

  useEffect(() => {
    if (!configured) return;
    let cancel = false;
    setLoading(true);
    void (async () => {
      const next = await Promise.all(LIVE_SOURCES.map((source) => loadSource(source, settings)));
      if (!cancel) {
        setSources(next);
        setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [configured, settings]);

  const desk = useMemo(() => new Set<CategoryId>([...state.interests, ...state.follows.topics]), [state.follows.topics, state.interests]);

  if (!configured) {
    return (
      <section className="mt-6 rounded-xl border border-dashed px-4 py-4">
        <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Live</p>
        <p className="mt-2 text-sm leading-relaxed">
          Real articles stay on their own sites until you add a relay. Nothing is fetched, and nothing is stored in this public site.
        </p>
        <Link href="/settings" className="mt-3 inline-block text-sm underline-offset-4 hover:underline">
          Add a relay in Settings
        </Link>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b pb-2">
        <div>
          <h2 className="font-serif text-xl tracking-tight">Live</h2>
          <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Personal reading in this browser. Titles and text are cached in IndexedDB, not in the site. Open the original if a source fails.
          </p>
        </div>
        {desk.size > 0 && (
          <button type="button" className="text-xs text-muted-foreground hover:text-foreground" onClick={() => setOnlyDesk((value) => !value)}>
            {onlyDesk ? "Your sectors" : "All live"}
          </button>
        )}
      </div>
      {loading && sources.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Asking the relay for the six sources…</p>}
      <div className="mt-4 space-y-6">
        {sources.map((source) => {
          const visible = source.items.filter((item) => !onlyDesk || desk.size === 0 || matchesDesk(item.category, state.interests, state.follows.topics));
          return (
            <div key={source.id}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <h3 className="font-cn text-lg">{source.name}</h3>
                <a href={source.home} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground">
                  Open source
                </a>
              </div>
              {source.error && (
                <p className="mb-2 text-sm text-muted-foreground">
                  {relayErrorCopy(source.error)}
                  {source.stale ? " Showing what this browser saved earlier." : ""}
                </p>
              )}
              {visible.length === 0 && !source.error && <p className="text-sm text-muted-foreground">No items in this cut.</p>}
              <div className="grid gap-3 lg:grid-cols-2">
                {visible.map((item) => (
                  <LiveCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LiveCard({ item }: { item: DeskItem }) {
  const category = categoryById[item.category];
  return (
    <div className="rounded-xl border bg-card px-4 py-4">
      <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        <span>{item.kind === "podcast" ? "Podcast" : category.short}</span>
        <span className="tracking-normal normal-case">Live</span>
      </div>
      <h3 className="mt-2 font-cn text-[1.2rem] leading-snug font-medium">{item.title}</h3>
      {item.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="text-foreground/80">{item.sourceName}</span>
        {item.publishedAt ? (
          <>
            <span>{formatWhen(item.publishedAt)}</span>
            <span>{formatClock(item.publishedAt)}</span>
          </>
        ) : (
          <span>Time unavailable</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-sm">
        {item.kind === "article" ? (
          <Link href={`/live/?id=${item.id}`} className="underline-offset-4 hover:underline">
            Read here
          </Link>
        ) : (
          <Link href={`/live/?id=${item.id}`} className="underline-offset-4 hover:underline">
            Play and notes
          </Link>
        )}
        <a href={item.url} target="_blank" rel="noreferrer" className="text-muted-foreground underline-offset-4 hover:underline">
          Open original
        </a>
      </div>
    </div>
  );
}

async function loadSource(
  source: (typeof LIVE_SOURCES)[number],
  settings: ReturnType<typeof useConnection>
): Promise<SourceState> {
  try {
    const body = await fetchFeed(settings, source.feed);
    const items: DeskItem[] = (body.items ?? []).map((item) => ({
      ...item,
      body: item.body ?? "",
      supplied: item.supplied ?? (item.audioUrl ? "shownotes" : "excerpt"),
      id: stableId(item.url || `${source.id}:${item.title}`),
      sourceId: source.id,
      sourceName: source.name,
      category: categorize(item.title, item.excerpt, source),
      kind: item.audioUrl ? "podcast" : item.kind,
    }));
    await saveFeed({ sourceId: source.id, fetchedAt: new Date().toISOString(), items, error: "" });
    await Promise.all(
      items.map((item) =>
        upsertFeedStub({
          id: item.id,
          kind: item.kind === "podcast" ? "podcast" : "live",
          sourceId: item.sourceId,
          sourceName: item.sourceName,
          title: item.title,
          url: item.url,
          publishedAt: item.publishedAt,
          excerpt: item.excerpt,
          feedText: item.body || item.excerpt,
          supplied: item.supplied,
          text: "",
          textMode: "none",
          textFrom: "",
          audioUrl: item.audioUrl,
          category: item.category,
          error: "",
          savedAt: new Date().toISOString(),
        })
      )
    );
    return { id: source.id, name: source.name, home: source.home, items, error: "", stale: false };
  } catch (error) {
    const code = error instanceof Error ? error.message : "fetch_failed";
    const cached = await readFeed(source.id).catch(() => null);
    return {
      id: source.id,
      name: source.name,
      home: source.home,
      items: cached?.items ?? [],
      error: code,
      stale: Boolean(cached?.items.length),
    };
  }
}
