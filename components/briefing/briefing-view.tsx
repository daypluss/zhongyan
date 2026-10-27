"use client";

import { LiveSection } from "@/components/live/live-section";
import { SectorPicker } from "@/components/sectors/sector-picker";
import { Button } from "@/components/ui/button";
import { categoryById } from "@/lib/data/categories";
import { formatDeskDate, greeting } from "@/lib/format";
import { todayActivity } from "@/lib/reading";
import { useUser } from "@/lib/store";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function BriefingView() {
  const { state, dismissDesk } = useUser();
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const today = todayActivity(state);
  const due = Object.values(state.terms).filter((term) => new Date(term.due) <= new Date()).length;
  const sectors = state.interests.map((id) => categoryById[id]).filter(Boolean);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_272px]">
      <div>
        <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">{formatDeskDate()}</p>
        <p className="mt-4 font-serif text-sm text-muted-foreground">{greeting()}</p>
        <h1 className="mt-1 font-serif text-[2.4rem] leading-none tracking-tight sm:text-5xl">China Business Briefing</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Live articles stay in this browser. Fetch them through your relay, or paste one on Import.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {sectors.length === 0 ? (
            <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">All sectors</span>
          ) : (
            sectors.map((category) => (
              <span key={category.id} className="rounded-full border bg-card px-2.5 py-1 text-xs">
                {category.short}
              </span>
            ))
          )}
          <button
            type="button"
            onClick={() => setSectorsOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label="Edit sectors"
          >
            <SlidersHorizontal className="size-3.5" />
            Edit sectors
          </button>
        </div>
        <SectorPicker open={sectorsOpen} onOpenChange={setSectorsOpen} />

        {!state.onboarded && !state.dismissedDesk && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
            <p>Set the desk — sectors, level, and a 15-minute goal — so the briefing leads with what you cover.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={dismissDesk}>
                Later
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href="/onboarding" />}>
                Set your desk
              </Button>
            </div>
          </div>
        )}

        <LiveSection />
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
            A sitting is one article, the words you save, a short quiz when you have a key, and the terms already due.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Due for review</p>
          <p className="mt-2 font-serif text-3xl tracking-tight">{due}</p>
          <p className="text-xs text-muted-foreground">Saved terms whose interval has come up.</p>
          <Button className="mt-3 w-full" variant="outline" nativeButton={false} render={<Link href="/learn/review" />}>
            Open daily review
          </Button>
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
