"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { PersonalLibrary } from "@/components/personal/personal-library";
import { Input } from "@/components/ui/input";
import { articles } from "@/lib/data";
import { categories } from "@/lib/data/categories";
import { entities } from "@/lib/data/entities";
import { lexemes } from "@/lib/data/lexicon";
import { sources } from "@/lib/data/sources";
import { researchTopic } from "@/lib/research";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

const TABS = ["Topics", "Companies", "Business lingo", "Saved", "Sources"] as const;

export function ExploreView() {
  const { state } = useUser();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Topics");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const companies = entities.filter((entity) =>
    !q || entity.nameCn.includes(query.trim()) || entity.nameEn.toLowerCase().includes(q) || entity.sector.toLowerCase().includes(q)
  );
  const lingo = lexemes.filter(
    (lex) =>
      lex.kind === "business" &&
      (!q || lex.chinese.includes(query.trim()) || lex.english.toLowerCase().includes(q))
  );
  const saved = articles.filter((article) => state.savedArticles.includes(article.id));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Explore</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Topics, companies, lingo</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        The sectors a China desk actually follows. Following a topic pulls it to the top of the briefing.
      </p>
      <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies or terms" className="mt-5 max-w-sm" />
      <div className="mt-4 flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={cn("rounded-full border px-3 py-1 text-xs", tab === item ? "bg-card text-foreground" : "text-muted-foreground")}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "Topics" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {categories
              .filter((category) => !q || category.name.toLowerCase().includes(q))
              .map((category) => (
                <TopicCard key={category.id} id={category.id} />
              ))}
          </div>
        )}
        {tab === "Companies" && (
          <div className="grid gap-3 sm:grid-cols-2">
            {companies.map((entity) => (
              <Link key={entity.id} href={`/explore/entities/${entity.id}`} className="rounded-xl border bg-card px-4 py-3 hover:border-foreground/15">
                <p className="font-cn text-lg">{entity.nameCn}</p>
                <p className="text-xs text-muted-foreground">{entity.nameEn} · {entity.sector}{entity.fictional ? " · Demo" : ""}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{entity.description}</p>
              </Link>
            ))}
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
        {tab === "Saved" && (
          <div>
            <h2 className="font-serif text-xl tracking-tight">Demo</h2>
            <div className="mt-3 grid gap-3">
              {saved.length === 0 && <p className="text-sm text-muted-foreground">No saved demo stories yet.</p>}
              {saved.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
            <PersonalLibrary />
          </div>
        )}
        {tab === "Sources" && (
          <ul className="divide-y rounded-xl border bg-card">
            {sources
              .filter((source) => !q || source.name.includes(query.trim()) || source.nameEn.toLowerCase().includes(q))
              .map((source) => (
                <li key={source.id} className="px-4 py-3">
                  <p className="font-cn text-lg">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.nameEn} · {source.category}</p>
                  <p className="mt-1 text-sm leading-relaxed">{source.description}</p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TopicCard({ id }: { id: CategoryId }) {
  const { state, toggleTopic } = useUser();
  const category = categories.find((item) => item.id === id)!;
  const count = articles.filter((article) => article.category === id).length;
  const dossier = useMemo(() => researchTopic(id), [id]);
  const following = state.follows.topics.includes(id);
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/explore/topics/${id}`} className="font-serif text-xl tracking-tight hover:underline">
          {category.name}
        </Link>
        <button type="button" onClick={() => toggleTopic(id)} className="text-xs text-muted-foreground hover:text-foreground">
          {following ? "Following" : "Follow"}
        </button>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{category.blurb}</p>
      <p className="mt-2 text-xs text-muted-foreground">{count} stories in this edition · {dossier.linkedTerms.length} business terms linked</p>
    </div>
  );
}
