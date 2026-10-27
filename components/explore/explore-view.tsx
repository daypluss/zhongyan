"use client";

import { PersonalLibrary } from "@/components/personal/personal-library";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data/categories";
import { lexemes } from "@/lib/data/lexicon";
import { sources } from "@/lib/data/sources";
import { entitiesInLibrary } from "@/lib/live/mentions";
import { useDocuments } from "@/lib/live/use-documents";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

const TABS = ["Topics", "Companies", "Business lingo", "Saved", "Sources"] as const;

export function ExploreView() {
  const { documents, ready } = useDocuments();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Topics");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const needle = query.trim();
  const companies = useMemo(() => entitiesInLibrary(documents), [documents]);
  const visibleCompanies = companies.filter(
    (entity) => !q || entity.name.includes(needle) || entity.english.toLowerCase().includes(q) || entity.note.toLowerCase().includes(q)
  );
  const lingo = lexemes.filter(
    (lex) => lex.kind === "business" && (!q || lex.chinese.includes(needle) || lex.english.toLowerCase().includes(q))
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Explore</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Topics, companies, lingo</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Sectors are the ten desks. Companies are names that actually appear in articles stored in this browser.
      </p>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies or terms" className="mt-5 max-w-sm" />
      <div className="mt-4 flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn("rounded-full border px-3 py-1 text-xs", tab === item ? "bg-card text-foreground" : "text-muted-foreground")}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "Topics" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {categories
              .filter((category) => !q || category.name.toLowerCase().includes(q) || category.short.toLowerCase().includes(q))
              .map((category) => (
                <TopicCard key={category.id} id={category.id} count={documents.filter((document) => document.category === category.id).length} />
              ))}
          </div>
        )}
        {tab === "Companies" && (
          <div>
            {!ready && <p className="text-sm text-muted-foreground">Reading this browser…</p>}
            {ready && companies.length === 0 && (
              <p className="rounded-xl border border-dashed px-4 py-8 text-sm leading-relaxed text-muted-foreground">
                No companies yet. Fetch the live desk or paste an article. A name is listed only when it appears in that text — from the business lexicon, or from a study pass.
              </p>
            )}
            {ready && companies.length > 0 && visibleCompanies.length === 0 && (
              <p className="text-sm text-muted-foreground">No companies match this search.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleCompanies.map((entity) => (
                <Link
                  key={entity.name}
                  href={`/explore/entity/?name=${encodeURIComponent(entity.name)}`}
                  className="rounded-xl border bg-card px-4 py-3 hover:border-foreground/15"
                >
                  <p className="font-cn text-lg">{entity.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entity.english || "From this text"}
                    {" · "}
                    {entity.count} {entity.count === 1 ? "article" : "articles"}
                  </p>
                  {entity.note && <p className="mt-2 text-sm leading-relaxed text-foreground/85">{entity.note}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}
        {tab === "Business lingo" && (
          <ul className="divide-y rounded-xl border bg-card">
            {lingo.map((lex) => (
              <li key={lex.id} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-cn text-xl">{lex.chinese}</span>
                  <span className="text-xs text-muted-foreground">{lex.pinyin}</span>
                </div>
                <p className="mt-1 text-sm">{lex.english}</p>
                {lex.businessUsage && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{lex.businessUsage}</p>}
              </li>
            ))}
          </ul>
        )}
        {tab === "Saved" && <PersonalLibrary />}
        {tab === "Sources" && (
          <ul className="divide-y rounded-xl border bg-card">
            {sources
              .filter((source) => !q || source.name.includes(needle) || source.nameEn.toLowerCase().includes(q))
              .map((source) => (
                <li key={source.id} className="px-4 py-3">
                  <p className="font-cn text-lg">{source.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {source.nameEn} · {source.category}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">{source.description}</p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TopicCard({ id, count }: { id: CategoryId; count: number }) {
  const { state, setSectors } = useUser();
  const category = categories.find((item) => item.id === id)!;
  const following = state.interests.includes(id);
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/explore/topics/${id}`} className="font-serif text-xl tracking-tight hover:underline">
          {category.name}
        </Link>
        <button
          type="button"
          onClick={() =>
            setSectors(following ? state.interests.filter((item) => item !== id) : [...state.interests, id])
          }
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{category.blurb}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {count === 0 ? "No articles in this browser yet" : `${count} ${count === 1 ? "article" : "articles"} in this browser`}
      </p>
    </div>
  );
}
