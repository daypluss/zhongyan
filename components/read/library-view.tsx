"use client";

import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data/categories";
import { deleteDocument } from "@/lib/live/db";
import { readerHref } from "@/lib/live/id";
import { useDocuments } from "@/lib/live/use-documents";
import { formatWhen } from "@/lib/format";
import type { CategoryId } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

export function LibraryView() {
  const { documents, ready } = useDocuments();
  const [sector, setSector] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const needle = query.trim();
    return documents.filter((document) => {
      if (sector !== "all" && document.category !== sector) return false;
      if (!q) return true;
      return (
        document.title.includes(needle) ||
        document.sourceName.toLowerCase().includes(q) ||
        document.excerpt.toLowerCase().includes(q)
      );
    });
  }, [documents, query, sector]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Read</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">In this browser</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Live items from the briefing and articles you pasted on Import. They stay on this device.
      </p>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles or sources" className="mt-5" />
      <div className="mt-4 flex flex-wrap gap-1.5">
        <FilterChip active={sector === "all"} onClick={() => setSector("all")}>
          All sectors
        </FilterChip>
        {categories.map((category) => (
          <FilterChip key={category.id} active={sector === category.id} onClick={() => setSector(category.id)}>
            {category.short}
          </FilterChip>
        ))}
      </div>
      {!ready && <p className="mt-6 text-sm text-muted-foreground">Opening the library in this browser…</p>}
      {ready && documents.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed px-4 py-8 text-sm leading-relaxed text-muted-foreground">
          <p>Nothing fetched or pasted yet.</p>
          <p className="mt-2">
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              Fetch latest
            </Link>{" "}
            on the briefing once a relay is saved, or{" "}
            <Link href="/import" className="text-foreground underline-offset-4 hover:underline">
              paste an article
            </Link>
            . No relay yet?{" "}
            <Link href="/settings" className="text-foreground underline-offset-4 hover:underline">
              Open Settings
            </Link>
            .
          </p>
        </div>
      )}
      {ready && documents.length > 0 && (
        <p className="mt-5 text-xs text-muted-foreground">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </p>
      )}
      {ready && documents.length > 0 && visible.length === 0 && (
        <p className="mt-3 rounded-xl border bg-card px-4 py-8 text-sm text-muted-foreground">
          Nothing matches this sector or search.
        </p>
      )}
      <ul className="mt-3 space-y-3">
        {visible.map((document) => (
          <li key={document.id} className="rounded-xl border bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              <span>{document.kind === "import" ? "Imported" : document.kind === "podcast" ? "Podcast" : "Live"}</span>
              <span className="tracking-normal normal-case">{categories.find((item) => item.id === document.category)?.short}</span>
            </div>
            <h2 className="mt-1 font-cn text-lg leading-snug">{document.title || "Untitled"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.sourceName || "Pasted"}
              {" · "}
              {document.publishedAt ? formatWhen(document.publishedAt) : formatWhen(document.savedAt)}
              {document.textMode === "none" ? " · Title only, until you open it" : ""}
              {document.textMode === "excerpt" ? " · Excerpt" : ""}
              {document.textMode === "shownotes" ? " · Show notes" : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <Link href={readerHref(document.id)} className="underline-offset-4 hover:underline">
                Open
              </Link>
              {document.url && (
                <a href={document.url} target="_blank" rel="noreferrer" className="text-muted-foreground underline-offset-4 hover:underline">
                  Open original
                </a>
              )}
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => void deleteDocument(document.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-full border px-2.5 py-1 text-xs", active ? "bg-card text-foreground" : "text-muted-foreground")}
    >
      {children}
    </button>
  );
}
