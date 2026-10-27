"use client";

import { categoryById } from "@/lib/data/categories";
import { lexemes } from "@/lib/data/lexicon";
import { readerHref } from "@/lib/live/id";
import { documentBlob, entitiesInLibrary } from "@/lib/live/mentions";
import { useDocuments } from "@/lib/live/use-documents";
import { formatWhen } from "@/lib/format";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import Link from "next/link";
import { useMemo } from "react";

export function TopicView({ id }: { id: CategoryId }) {
  const category = categoryById[id];
  const { state, setSectors } = useUser();
  const { documents, ready } = useDocuments();
  const stories = documents.filter((document) => document.category === id);
  const names = useMemo(() => entitiesInLibrary(stories), [stories]);
  const terms = useMemo(() => {
    const blob = stories.map((document) => documentBlob(document)).join("\n");
    if (!blob.trim()) return [];
    return lexemes.filter((lexeme) => lexeme.kind === "business" && blob.includes(lexeme.chinese));
  }, [stories]);

  if (!category) return <p className="px-6 py-16 text-sm">Unknown topic.</p>;
  const following = state.interests.includes(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="text-xs text-muted-foreground hover:text-foreground">
        Explore
      </Link>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h1 className="font-serif text-4xl tracking-tight">{category.name}</h1>
        <button
          type="button"
          onClick={() => setSectors(following ? state.interests.filter((item) => item !== id) : [...state.interests, id])}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{category.blurb}</p>
      {!ready && <p className="mt-6 text-sm text-muted-foreground">Reading this browser…</p>}
      {ready && stories.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed px-4 py-8 text-sm leading-relaxed text-muted-foreground">
          No articles in {category.name} yet. Fetch the live desk or paste a piece. It shows up here when the text is filed under this sector.
        </p>
      )}
      {names.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {names.map((entity) => (
            <Link
              key={entity.name}
              href={`/explore/entity/?name=${encodeURIComponent(entity.name)}`}
              className="rounded-full border px-2 py-0.5 text-xs hover:bg-card"
            >
              <span className="font-cn">{entity.name}</span>
              {entity.english && <span className="ml-1 text-muted-foreground">{entity.english}</span>}
            </Link>
          ))}
        </div>
      )}
      {terms.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {terms.map((lexeme) => (
            <span key={lexeme.id} className="rounded-full border px-2 py-0.5 text-xs">
              <span className="font-cn">{lexeme.chinese}</span>
              <span className="ml-1 text-muted-foreground">{lexeme.english}</span>
            </span>
          ))}
        </div>
      )}
      <ul className="mt-6 space-y-3">
        {stories.map((document) => (
          <li key={document.id} className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{document.sourceName || "Pasted"}</p>
            <Link href={readerHref(document.id)} className="mt-1 block font-cn text-lg leading-snug hover:underline">
              {document.title || "Untitled"}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.publishedAt ? formatWhen(document.publishedAt) : formatWhen(document.savedAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
