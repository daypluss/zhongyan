"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { Button } from "@/components/ui/button";
import { articles } from "@/lib/data";
import { entityById } from "@/lib/data/entities";
import { useUser } from "@/lib/store";
import Link from "next/link";

export function EntityView({ id }: { id: string }) {
  const entity = entityById[id];
  const { state, toggleEntity, setNote } = useUser();
  if (!entity) {
    return <p className="px-6 py-16 text-sm text-muted-foreground">Not in this edition.</p>;
  }
  const related = articles.filter((article) => article.entityIds.includes(entity.id));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="text-xs text-muted-foreground hover:text-foreground">Explore</Link>
      <p className="mt-4 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{entity.type} · {entity.sector}</p>
      <h1 className="mt-2 font-cn text-4xl">{entity.nameCn}</h1>
      <p className="mt-2 font-serif text-xl text-muted-foreground italic">{entity.nameEn}</p>
      {entity.fictional && (
        <p className="mt-3 text-xs text-cinnabar">Demo company. The story around it is a teaching case, not a disclosed filing.</p>
      )}
      <p className="mt-4 text-sm leading-relaxed">{entity.description}</p>
      <Button className="mt-4" size="sm" variant={state.follows.entities.includes(entity.id) ? "secondary" : "outline"} onClick={() => toggleEntity(entity.id)}>
        {state.follows.entities.includes(entity.id) ? "Following" : "Follow"}
      </Button>
      <div className="mt-6">
        <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Thesis note</p>
        <textarea
          value={state.notes[entity.id] ?? ""}
          onChange={(event) => setNote(entity.id, event.target.value)}
          placeholder="What would change your view?"
          className="mt-2 min-h-28 w-full rounded-xl border bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>
      <div className="mt-8 space-y-3">
        <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">In this edition</p>
        {related.length === 0 && <p className="text-sm text-muted-foreground">On the watchlist, not inside a story in this edition.</p>}
        {related.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
