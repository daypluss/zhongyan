"use client";

import { Button } from "@/components/ui/button";
import { getLexeme } from "@/lib/data";
import { lexemes } from "@/lib/data/lexicon";
import { speak } from "@/lib/speech";
import { distractors, formatFor, isDue, shuffle, type ReviewFormat } from "@/lib/srs";
import { useUser } from "@/lib/store";
import type { Grade, Lexeme, SavedTerm } from "@/lib/types";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";

export function ReviewSession() {
  const { state, gradeTerm } = useUser();
  const queue = useMemo(() => {
    const due = Object.values(state.terms).filter((term) => isDue(term));
    if (due.length) return due.slice(0, 12);
    return Object.values(state.terms).slice(0, 12);
  }, [state.terms]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [again, setAgain] = useState(0);
  const [done, setDone] = useState(false);

  const term = queue[index];
  const lex = term ? getLexeme(term.lexemeId) : undefined;
  const format = term ? formatFor(term) : "cn-en";

  if (queue.length === 0 || !term || !lex) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-serif text-4xl tracking-tight">Daily review</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Save a few terms from a story first. The schedule starts the moment they enter the vault.
        </p>
        <Button className="mt-6" render={<Link href="/" />}>
          Back to the briefing
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Session</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">{queue.length} reviewed</h1>
        <p className="mt-3 text-sm text-muted-foreground">{again} marked again. They return in about ten minutes.</p>
        <div className="mt-6 flex gap-2">
          <Button render={<Link href="/progress" />}>See progress</Button>
          <Button variant="outline" render={<Link href="/" />}>Briefing</Button>
        </div>
      </div>
    );
  }

  function grade(value: Grade) {
    gradeTerm(term.lexemeId, value);
    if (value === "again") setAgain((count) => count + 1);
    setPicked(null);
    setDraft("");
    if (index + 1 >= queue.length) setDone(true);
    else setIndex((current) => current + 1);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        Daily review · {index + 1} / {queue.length}
      </p>
      <Prompt lex={lex} term={term} format={format} picked={picked} setPicked={setPicked} draft={draft} setDraft={setDraft} />
      <div className="mt-6 grid grid-cols-4 gap-2">
        {(["again", "hard", "good", "easy"] as const).map((value) => (
          <Button key={value} variant={value === "again" ? "outline" : "secondary"} onClick={() => grade(value)} className="capitalize">
            {value}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Again keeps it close. Easy pushes the interval out. This is a memory schedule, not a score.
      </p>
    </div>
  );
}

function Prompt({
  lex,
  term,
  format,
  picked,
  setPicked,
  draft,
  setDraft,
}: {
  lex: Lexeme;
  term: SavedTerm;
  format: ReviewFormat;
  picked: string | null;
  setPicked: (value: string) => void;
  draft: string;
  setDraft: (value: string) => void;
}) {
  const pool = lexemes.filter((item) => item.kind !== "function");
  const options = useMemo(() => {
    if (format === "cn-en" || format === "audio") {
      return shuffle([lex.english, ...distractors(lex, pool).map((item) => item.english)]);
    }
    if (format === "en-cn" || format === "py-cn") {
      return shuffle([lex.chinese, ...distractors(lex, pool).map((item) => item.chinese)]);
    }
    if (format === "usage" && lex.collocations?.length) {
      const fake = distractors(lex, pool).slice(0, 2).map((item) => item.chinese);
      return shuffle([lex.collocations[0], ...fake]);
    }
    return [];
  }, [format, lex, pool]);

  const cloze = term.sentence.replace(lex.chinese, "____");

  return (
    <div className="mt-6 rounded-xl border bg-card px-4 py-5">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{label(format)}</p>
      {format === "cn-en" && <p className="mt-3 font-cn text-4xl">{lex.chinese}</p>}
      {format === "en-cn" && <p className="mt-3 font-serif text-2xl">{lex.english}</p>}
      {format === "py-cn" && <p className="mt-3 font-serif text-2xl">{lex.pinyin}</p>}
      {format === "audio" && (
        <div className="mt-3">
          <Button variant="outline" onClick={() => speak(lex.chinese)}>
            Play
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">Choose the word you heard.</p>
        </div>
      )}
      {format === "cloze" && <p className="mt-3 font-cn text-xl leading-relaxed">{cloze}</p>}
      {format === "usage" && (
        <p className="mt-3 text-sm">Which phrase is a natural collocation of {lex.chinese}?</p>
      )}
      {format === "cloze" ? (
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type the missing term"
          className="mt-4 h-9 w-full rounded-lg border px-3 text-sm"
        />
      ) : (
        <div className="mt-4 grid gap-2">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPicked(option)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm",
                picked === option && "border-foreground/30 bg-muted",
                option.includes("中") || /[\u4e00-\u9fff]/.test(option) ? "font-cn text-base" : ""
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {picked && (
        <p className="mt-3 text-xs text-muted-foreground">
          {answerOf(format, lex) === picked ? "That matches." : `The term is ${lex.chinese} — ${lex.english}.`}
        </p>
      )}
      {format === "cloze" && draft && (
        <p className="mt-3 text-xs text-muted-foreground">
          {draft.includes(lex.chinese) ? "The term is in the sentence." : `The missing term is ${lex.chinese}.`}
        </p>
      )}
      <p className="mt-3 font-cn text-sm leading-relaxed text-muted-foreground">{term.sentence}</p>
    </div>
  );
}

function label(format: ReviewFormat) {
  switch (format) {
    case "cn-en":
      return "Chinese → English";
    case "en-cn":
      return "English → Chinese";
    case "py-cn":
      return "Pinyin → Chinese";
    case "audio":
      return "Audio → word";
    case "cloze":
      return "Fill the blank";
    case "usage":
      return "Choose the usage";
  }
}

function answerOf(format: ReviewFormat, lex: Lexeme) {
  if (format === "cn-en" || format === "audio") return lex.english;
  if (format === "usage") return lex.collocations?.[0] ?? lex.chinese;
  return lex.chinese;
}
