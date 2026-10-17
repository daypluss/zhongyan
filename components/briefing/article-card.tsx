import { categoryById } from "@/lib/data/categories";
import { entityById } from "@/lib/data/entities";
import { sourceById } from "@/lib/data/sources";
import { difficultyLabel, difficultyTone, formatClock, formatWhen } from "@/lib/format";
import type { Article } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";

export function ArticleCard({
  article,
  selected = false,
  showEnglish = true,
}: {
  article: Article;
  selected?: boolean;
  showEnglish?: boolean;
}) {
  const category = categoryById[article.category];
  const source = sourceById[article.sourceId];
  const companies = article.entityIds
    .map((id) => entityById[id])
    .filter((entity) => entity && entity.type === "company");

  return (
    <Link
      href={`/read/${article.id}`}
      data-article={article.id}
      className={cn(
        "group block rounded-xl border bg-card px-4 py-4 shadow-[0_1px_0_rgba(40,30,20,0.03)] transition duration-200 hover:-translate-y-px hover:border-foreground/15 hover:shadow-[0_16px_40px_-32px_rgba(40,30,20,0.45)]",
        selected && "border-cinnabar/40 ring-1 ring-cinnabar/30"
      )}
    >
      <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
        <span>{category.short}</span>
        <span className="inline-flex items-center gap-1.5 tracking-normal normal-case">
          <span className={cn("size-1.5 rounded-full", difficultyTone(article.difficulty))} />
          {difficultyLabel[article.difficulty]}
        </span>
      </div>
      <h3 className="mt-2.5 font-cn text-[1.28rem] leading-[1.45] font-medium tracking-tight text-foreground">
        {article.titleCn}
      </h3>
      {showEnglish && (
        <p className="mt-1.5 font-serif text-[15px] leading-relaxed text-muted-foreground italic">
          {article.titleEn}
        </p>
      )}
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">
        <span className="font-medium text-cinnabar">Why it matters</span>
        <span className="mx-1.5 text-muted-foreground">·</span>
        {article.whyItMatters}
      </p>
      <div className="mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="text-foreground/80">{source?.name}</span>
        <span>Demo</span>
        <span>{formatWhen(article.publishedAt)}</span>
        <span>{formatClock(article.publishedAt)}</span>
        <span>{article.readingMinutes} min</span>
        <span>{article.newWordIds.length} new words</span>
      </div>
      {companies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {companies.slice(0, 3).map((company) => (
            <span key={company.id} className="rounded-full border bg-background px-2 py-0.5 text-[11px] text-foreground/75">
              {company.nameCn}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
