"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { Input } from "@/components/ui/input";
import { articles } from "@/lib/data";
import { categories } from "@/lib/data/categories";
import { difficultyLabel } from "@/lib/format";
import { useUser } from "@/lib/store";
import type { CategoryId, Difficulty } from "@/lib/types";
import { cn } from "cn";
import { useMemo, useState } from "react";

const DIFFICULTIES: Array<Difficulty | "all"> = ["all", "foundational", "intermediate", "advanced"];

export function LibraryView() {
  const { state } = useUser();
  const [sector, setSector] = useState<CategoryId | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [scope, setScope] = useState<"all" | "unread" | "saved">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (sector !== "all" && article.category !== sector) return false;
      if (difficulty !== "all" && article.difficulty !== difficulty) return false;
      const read = state.read[article.id]?.readingDone;
      if (scope === "unread" && read) return false;
      if (scope === "saved" && !state.savedArticles.includes(article.id)) return false;
      if (!q) return true;
      return (
        article.titleCn.includes(query.trim()) ||
        article.titleEn.toLowerCase().includes(q) ||
        article.summaryEn.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [difficulty, query, scope, sector, state.read, state.savedArticles]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Read</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">The edition</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Twenty original study pieces, filed by the sectors on a China technology and investment desk. Chinese is the text. English is one click inside the story.
      </p>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search headlines, tags, English dek"
        className="mt-5"
      />
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
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DIFFICULTIES.map((item) => (
          <FilterChip key={item} active={difficulty === item} onClick={() => setDifficulty(item)}>
            {item === "all" ? "Any level" : difficultyLabel[item]}
          </FilterChip>
        ))}
        {(["all", "unread", "saved"] as const).map((item) => (
          <FilterChip key={item} active={scope === item} onClick={() => setScope(item)}>
            {item === "all" ? "All stories" : item === "unread" ? "Unread" : "Saved"}
          </FilterChip>
        ))}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">{visible.length} in this cut</p>
      <div className="mt-3 space-y-3">
        {visible.length === 0 && (
          <p className="rounded-xl border bg-card px-4 py-8 text-sm text-muted-foreground">
            Nothing in this cut. Widen the sector or difficulty, or save a story from the briefing.
          </p>
        )}
        {visible.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs",
        active ? "bg-card text-foreground" : "text-muted-foreground"
      )}
    >
      {children}
    </button>
  );
}
