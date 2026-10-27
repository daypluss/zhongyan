"use client";

import { Button } from "@/components/ui/button";
import { categories } from "@/lib/data/categories";
import { DEFAULT_SECTORS } from "@/lib/sectors";
import { useUser } from "@/lib/store";
import type { CategoryId, Difficulty, LearningPriority } from "@/lib/types";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LEVELS: { id: Difficulty; label: string; detail: string }[] = [
  { id: "foundational", label: "Foundational", detail: "I read with a lot of help." },
  { id: "intermediate", label: "Intermediate", detail: "I can follow a story and miss the jargon." },
  { id: "advanced", label: "Advanced", detail: "I read, and I want the edge terms." },
];

const PRIORITIES: { id: LearningPriority; label: string }[] = [
  { id: "reading", label: "Reading" },
  { id: "listening", label: "Listening" },
  { id: "vocabulary", label: "Vocabulary" },
  { id: "speaking", label: "Speaking" },
  { id: "business", label: "Business fluency" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<CategoryId[]>(DEFAULT_SECTORS);
  const [level, setLevel] = useState<Difficulty>("intermediate");
  const [priorities, setPriorities] = useState<LearningPriority[]>(["reading", "vocabulary", "business"]);
  const [goal, setGoal] = useState<15 | 20 | 30>(15);

  function toggle<T extends string>(list: T[], id: T) {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  }

  function finish() {
    completeOnboarding({
      interests,
      level,
      priorities,
      dailyGoal: { minutes: goal, articles: 1, reviews: goal === 15 ? 10 : 12 },
    });
    router.push("/");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-12">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">中研 · {step + 1} / 5</p>
      {step === 0 && (
        <div>
          <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight">Read the China you already have to know.</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Real industry context, the Chinese it is written in, the vocabulary a desk actually uses, and a clear line between what was reported and what you are inferring.
          </p>
        </div>
      )}
      {step === 1 && (
        <div>
          <h1 className="mt-4 font-serif text-4xl tracking-tight">What do you cover?</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setInterests((current) => toggle(current, category.id))}
                className={cn("rounded-full border px-3 py-1.5 text-sm", interests.includes(category.id) ? "bg-foreground text-background" : "text-muted-foreground")}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <h1 className="mt-4 font-serif text-4xl tracking-tight">Where is your Chinese?</h1>
          <div className="mt-5 space-y-2">
            {LEVELS.map((item) => (
              <button key={item.id} type="button" onClick={() => setLevel(item.id)} className={cn("block w-full rounded-xl border px-4 py-3 text-left", level === item.id && "border-foreground/30 bg-card")}>
                <span className="text-sm">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <h1 className="mt-4 font-serif text-4xl tracking-tight">What are you training?</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {PRIORITIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPriorities((current) => toggle(current, item.id))}
                className={cn("rounded-full border px-3 py-1.5 text-sm", priorities.includes(item.id) ? "bg-foreground text-background" : "text-muted-foreground")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <h1 className="mt-4 font-serif text-4xl tracking-tight">How long is the sitting?</h1>
          <div className="mt-5 flex gap-2">
            {[15, 20, 30].map((minutes) => (
              <button key={minutes} type="button" onClick={() => setGoal(minutes as 15 | 20 | 30)} className={cn("rounded-xl border px-4 py-3 text-sm", goal === minutes && "bg-card ring-1 ring-foreground/15")}>
                {minutes} min
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">One article, the lingo, a short quiz, and the terms already due.</p>
        </div>
      )}
      <div className="mt-8 flex items-center justify-between">
        <button type="button" className="text-sm text-muted-foreground" onClick={() => (step === 0 ? router.push("/") : setStep((value) => value - 1))}>
          {step === 0 ? "Skip" : "Back"}
        </button>
        {step < 4 ? (
          <Button onClick={() => setStep((value) => value + 1)}>Continue</Button>
        ) : (
          <Button onClick={finish}>Open the briefing</Button>
        )}
      </div>
    </div>
  );
}
