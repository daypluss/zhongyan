"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { Button } from "@/components/ui/button";
import { articles } from "@/lib/data";
import { categories } from "@/lib/data/categories";
import { difficultyLabel, formatEditionDate, greeting, plural } from "@/lib/format";
import { todayActivity } from "@/lib/reading";
import { useUser } from "@/lib/store";
import type { CategoryId, Difficulty } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DIFFICULTIES: Array<Difficulty | "all"> = ["all", "foundational", "intermediate", "advanced"];

export function BriefingView() {
  const { state, dismissDesk } = useUser();
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [scope, setScope] = useState<"all" | "unread" | "saved">("all");
  const [selected, setSelected] = useState(0);

  const ordered = useMemo(() => {
    const priority = new Set<CategoryId>([...state.follows.topics, ...state.interests]);
    return [...categories].sort((a, b) => Number(priority.has(b.id)) - Number(priority.has(a.id)));
  }, [state.follows.topics, state.interests]);

  const visible = useMemo(() => {
    return articles.filter((article) => {
      if (difficulty !== "all" && article.difficulty !== difficulty) return false;
      const read = state.read[article.id]?.readingDone;
      if (scope === "unread" && read) return false;
      if (scope === "saved" && !state.savedArticles.includes(article.id)) return false;
      return true;
    });
  }, [difficulty, scope, state.read, state.savedArticles]);

  const sections = ordered
    .map((category) => ({
      category,
      stories: visible.filter((article) => article.category === category.id),
    }))
    .filter((section) => section.stories.length > 0);

  const flat = sections.flatMap((section) => section.stories);
  const termCount = new Set(visible.flatMap((article) => article.newWordIds)).size;
  const minutes = visible.reduce((sum, article) => sum + article.readingMinutes, 0);
  const today = todayActivity(state);
  const due = Object.values(state.terms).filter((term) => new Date(term.due) <= new Date()).length;

  useEffect(() => {
    setSelected(0);
  }, [difficulty, scope]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "j") {
        event.preventDefault();
        setSelected((index) => Math.min(flat.length - 1, index + 1));
      }
      if (event.key === "k") {
        event.preventDefault();
        setSelected((index) => Math.max(0, index - 1));
      }
      if (event.key === "Enter" && flat[selected]) {
        router.push(`/read/${flat[selected].id}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flat, router, selected]);

  useEffect(() => {
    const id = flat[selected]?.id;
    if (!id) return;
    document.querySelector(`[data-article="${id}"]`)?.scrollIntoView({ block: "nearest" });
  }, [flat, selected]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_272px]">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          {formatEditionDate()} · Demo edition
        </p>
        <p className="mt-4 font-serif text-sm text-muted-foreground">{greeting()}</p>
        <h1 className="mt-1 font-serif text-[2.4rem] leading-none tracking-tight sm:text-5xl">
          China Business Briefing
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Learn Chinese through the news shaping China&apos;s technology and business landscape.
        </p>
        <p className="mt-4 text-sm text-foreground/80">
          {plural(visible.length, "story")} in view · {termCount} terms · about {minutes} min if you read the edition
        </p>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Original study copy in the register of the outlets on your desk. Not live reporting, and not scraped.
        </p>

        {!state.onboarded && !state.dismissedDesk && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
            <p>Set the desk — interests, level, and a 15-minute goal — so the briefing leads with your sectors.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={dismissDesk}>
                Later
              </Button>
              <Button size="sm" render={<Link href="/onboarding" />}>
                Set your desk
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDifficulty(item)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs text-muted-foreground",
                difficulty === item && "border-foreground/20 bg-card text-foreground"
              )}
            >
              {item === "all" ? "All levels" : difficultyLabel[item]}
            </button>
          ))}
          {(["all", "unread", "saved"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScope(item)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs text-muted-foreground capitalize",
                scope === item && "border-foreground/20 bg-card text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-10">
          {sections.map(({ category, stories }) => (
            <section key={category.id} id={category.id}>
              <div className="mb-3 flex items-end justify-between gap-3 border-b pb-2">
                <div>
                  <h2 className="font-serif text-xl tracking-tight">{category.name}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{category.blurb}</p>
                </div>
                <Link href={`/explore/topics/${category.id}`} className="text-xs text-muted-foreground hover:text-foreground">
                  {stories.length} {stories.length === 1 ? "story" : "stories"}
                </Link>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {stories.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    selected={flat[selected]?.id === article.id}
                  />
                ))}
              </div>
            </section>
          ))}
          {sections.length === 0 && (
            <p className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing in this cut of the edition. Clear a filter to see the desk again.
            </p>
          )}
        </div>
      </div>

      <aside className="space-y-4 xl:pt-28">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Today&apos;s desk</p>
          <ul className="mt-3 space-y-2 text-sm">
            <DeskRow label="Article" value={`${today.articles.length} / ${state.dailyGoal.articles}`} />
            <DeskRow label="Reviews" value={`${today.reviews} / ${state.dailyGoal.reviews}`} />
            <DeskRow label="Minutes" value={`${Math.round(today.seconds / 60)} / ${state.dailyGoal.minutes}`} />
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A sitting is one story, the lingo, a short quiz, and the terms already due.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Due for review</p>
          <p className="mt-2 font-serif text-3xl tracking-tight">{due}</p>
          <p className="text-xs text-muted-foreground">Saved terms whose interval has come up.</p>
          <Button className="mt-3 w-full" variant="outline" render={<Link href="/learn/review" />}>
            Open daily review
          </Button>
        </div>
        <div className="rounded-xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="text-[11px] tracking-[0.14em] uppercase">Keyboard</p>
          <p className="mt-2">j and k move the highlight. Enter opens the story. s on a story saves it from the reader.</p>
        </div>
      </aside>
    </div>
  );
}

function DeskRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </li>
  );
}
