"use client";

import { getLexeme, sentenceText } from "@/lib/data";
import { speak } from "@/lib/speech";
import { assumedKnown } from "@/lib/reading";
import type { Article, Difficulty } from "@/lib/types";
import { cn } from "cn";
import { Volume2 } from "lucide-react";

export function ChineseText({
  article,
  pinyin,
  english,
  learning,
  audio,
  level,
  lookups,
  saved,
  activeId,
  onSelect,
}: {
  article: Article;
  pinyin: boolean;
  english: boolean;
  learning: boolean;
  audio: boolean;
  level: Difficulty;
  lookups: string[];
  saved: string[];
  activeId?: string;
  onSelect: (lexemeId: string, sentenceId: string, rect: DOMRect) => void;
}) {
  return (
    <div className="space-y-7">
      {article.paragraphs.map((paragraph) => (
        <div key={paragraph.id} className="space-y-5">
          {paragraph.sentences.map((sentence) => (
            <div key={sentence.id}>
              <div className={cn("font-cn text-[1.22rem] text-foreground sm:text-[1.32rem]", pinyin ? "leading-[2.55]" : "leading-[1.95]")}>
                {sentence.segments.map((segment, index) => {
                  if (segment.punctuation) {
                    return (
                      <span key={`${sentence.id}-${index}`} className="inline">
                        {segment.text}
                      </span>
                    );
                  }
                  const lex = segment.lexemeId ? getLexeme(segment.lexemeId) : undefined;
                  const known =
                    !lex ||
                    lex.kind === "function" ||
                    lookups.includes(lex.id) ||
                    saved.includes(lex.id) ||
                    assumedKnown(lex.difficulty, level);
                  const business = learning && lex?.kind === "business";
                  const vocab = learning && lex?.kind === "vocabulary" && !known;
                  return (
                    <span
                      key={`${sentence.id}-${index}`}
                      className={cn(
                        "inline-flex flex-col items-center align-bottom",
                        pinyin && "mx-[0.06em]"
                      )}
                    >
                      {pinyin && (
                        <span className="mb-0.5 font-sans text-[10px] leading-none tracking-wide text-muted-foreground whitespace-nowrap">
                          {segment.pinyin}
                        </span>
                      )}
                      <button
                        type="button"
                        data-active={activeId === segment.lexemeId}
                        className={cn(
                          "zh-word px-px font-cn",
                          business && "underline decoration-cinnabar decoration-1 underline-offset-[7px]",
                          vocab && "bg-sand",
                          learning && segment.entityId && "underline decoration-dotted underline-offset-[7px]"
                        )}
                        onClick={(event) => {
                          if (!segment.lexemeId) return;
                          const rect = event.currentTarget.getBoundingClientRect();
                          onSelect(segment.lexemeId, sentence.id, rect);
                        }}
                      >
                        {segment.text}
                      </button>
                    </span>
                  );
                })}
                {audio && (
                  <button
                    type="button"
                    className="ml-2 inline-flex translate-y-[-2px] items-center text-muted-foreground hover:text-foreground"
                    aria-label="Listen to sentence"
                    onClick={() => speak(sentenceText(sentence.segments))}
                  >
                    <Volume2 className="size-3.5" />
                  </button>
                )}
              </div>
              {english && (
                <p className="mt-1.5 max-w-2xl font-serif text-[15px] leading-relaxed text-muted-foreground italic">
                  {sentence.en}
                </p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
