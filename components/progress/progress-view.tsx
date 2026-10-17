"use client";

import { Button } from "@/components/ui/button";
import { articles } from "@/lib/data";
import { categories } from "@/lib/data/categories";
import { domainProficiency, quizAverage, streak, todayActivity, weekMinutes } from "@/lib/reading";
import { useUser } from "@/lib/store";
import type { Difficulty, LearningPriority } from "@/lib/types";
import Link from "next/link";

const LEVELS: Difficulty[] = ["foundational", "intermediate", "advanced"];
const PRIORITIES: { id: LearningPriority; label: string }[] = [
  { id: "reading", label: "Reading" },
  { id: "listening", label: "Listening" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "speaking", label: "Speaking" },
  { id: "business", label: "Business fluency" },
];

export function ProgressView() {
  const { state, completeOnboarding, resetDesk } = useUser();
  const domains = domainProficiency(state, articles);
  const week = weekMinutes(state.activity);
  const max = Math.max(15, ...week.map((day) => day.minutes));
  const terms = Object.values(state.terms);
  const mastered = terms.filter((term) => term.status === "mastered").length;
  const readCount = Object.values(state.read).filter((item) => item.readingDone).length;
  const average = quizAverage(state);
  const today = todayActivity(state);
  const sectors = new Set(
    articles.filter((article) => state.read[article.id]?.readingDone).map((article) => article.category)
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Progress</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">China business Chinese</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        A professional index by domain. It fills in from stories you finish, quizzes, and terms you actually review. Empty means no evidence yet — not a failing grade.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Reading streak" value={String(streak(state.activity))} detail="days with a story or a review" />
        <Stat label="Stories read" value={String(readCount)} detail={`${sectors.size} sectors touched`} />
        <Stat label="Terms mastered" value={`${mastered}`} detail={`${terms.length} in the vault`} />
        <Stat label="Quiz average" value={average === null ? "—" : `${average}%`} detail="across finished stories" />
      </div>

      <section className="mt-8 rounded-xl border bg-card p-4">
        <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">This week</p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {week.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-20 w-full items-end">
                <div className="w-full rounded-sm bg-foreground/80" style={{ height: `${Math.max(4, (day.minutes / max) * 100)}%`, opacity: day.minutes ? 1 : 0.15 }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Today: {today.articles.length}/{state.dailyGoal.articles} stories · {today.reviews}/{state.dailyGoal.reviews} reviews · {Math.round(today.seconds / 60)}/{state.dailyGoal.minutes} min
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl tracking-tight">By domain</h2>
        <ul className="mt-3 divide-y rounded-xl border bg-card">
          {domains.map((domain) => (
            <li key={domain.id} className="grid items-center gap-2 px-4 py-3 sm:grid-cols-[160px_minmax(0,1fr)_88px]">
              <span className="text-sm">{domain.label}</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-foreground/80" style={{ width: `${domain.score ?? 0}%` }} />
              </div>
              <span className="text-right text-xs text-muted-foreground tabular-nums">
                {domain.score === null ? "No evidence" : domain.score}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border bg-card p-4">
        <h2 className="font-serif text-2xl tracking-tight">Desk settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Interests reorder the briefing. Level changes which words learning mode treats as new.</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((category) => {
            const on = state.interests.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  const interests = on
                    ? state.interests.filter((id) => id !== category.id)
                    : [...state.interests, category.id];
                  completeOnboarding({
                    interests,
                    level: state.level,
                    priorities: state.priorities,
                    dailyGoal: state.dailyGoal,
                  });
                }}
                className={`rounded-full border px-2.5 py-1 text-xs ${on ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {category.short}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                completeOnboarding({
                  interests: state.interests,
                  level,
                  priorities: state.priorities,
                  dailyGoal: state.dailyGoal,
                })
              }
              className={`rounded-full border px-2.5 py-1 text-xs capitalize ${state.level === level ? "bg-card text-foreground ring-1 ring-foreground/15" : "text-muted-foreground"}`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {PRIORITIES.filter((item) => state.priorities.includes(item.id)).map((item) => (
            <span key={item.id}>{item.label}</span>
          ))}
          <Link href="/onboarding" className="underline-offset-2 hover:underline">Edit onboarding</Link>
        </div>
        <Button className="mt-4" variant="outline" size="sm" onClick={resetDesk}>
          Reset this browser&apos;s desk
        </Button>
      </section>
    </div>
  );
}

function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-serif text-3xl tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
