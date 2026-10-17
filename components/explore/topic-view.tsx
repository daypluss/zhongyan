"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { articlesInCategory, getLexeme } from "@/lib/data";
import { categoryById } from "@/lib/data/categories";
import { researchTopic } from "@/lib/research";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import Link from "next/link";

export function TopicView({ id }: { id: CategoryId }) {
  const category = categoryById[id];
  const { state, toggleTopic } = useUser();
  if (!category) return <p className="px-6 py-16 text-sm">Unknown topic.</p>;
  const stories = articlesInCategory(id);
  const dossier = researchTopic(id);
  const following = state.follows.topics.includes(id);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="text-xs text-muted-foreground hover:text-foreground">Explore</Link>
      <div className="mt-4 flex items-end justify-between gap-3">
        <h1 className="font-serif text-4xl tracking-tight">{category.name}</h1>
        <button type="button" onClick={() => toggleTopic(id)} className="text-sm text-muted-foreground hover:text-foreground">
          {following ? "Following" : "Follow"}
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{category.blurb}</p>
      <p className="mt-4 rounded-xl border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground">{dossier.note}</p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {dossier.linkedTerms.map((term) => {
          const lex = getLexeme(term);
          return (
            <span key={term} className="rounded-full border px-2 py-0.5 text-xs">
              <span className="font-cn">{term}</span>
              {lex && <span className="ml-1 text-muted-foreground">{lex.english}</span>}
            </span>
          );
        })}
      </div>
      <div className="mt-6 space-y-3">
        {stories.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
