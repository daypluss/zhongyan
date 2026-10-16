"use client";

import { Button } from "@/components/ui/button";
import { examplesFor, getArticle, getLexeme, sentenceText } from "@/lib/data";
import { entityById } from "@/lib/data/entities";
import { speak } from "@/lib/speech";
import type { SavedTerm } from "@/lib/types";
import { Bookmark, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function VocabPanel({
  lexemeId,
  articleId,
  sentenceId,
  rect,
  saved,
  onClose,
  onSave,
  onOpenEntity,
}: {
  lexemeId: string;
  articleId: string;
  sentenceId: string;
  rect: DOMRect;
  saved?: SavedTerm;
  onClose: () => void;
  onSave: (sentence: string) => void;
  onOpenEntity: (id: string) => void;
}) {
  const lex = getLexeme(lexemeId);
  const article = getArticle(articleId);
  const [more, setMore] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!lex || !article) return null;

  const sentence = article.paragraphs
    .flatMap((paragraph) => paragraph.sentences)
    .find((item) => item.id === sentenceId);
  const sentenceCn = sentence ? sentenceText(sentence.segments) : "";
  const examples = examplesFor(lex.chinese, sentenceId, 2);
  const entity = sentence?.segments.find((segment) => segment.lexemeId === lexemeId)?.entityId;
  const entityRecord = entity ? entityById[entity] : undefined;

  const top = Math.min(rect.bottom + 8, window.innerHeight - 320);
  const left = Math.min(Math.max(12, rect.left), window.innerWidth - 360);

  return (
    <>
      <button type="button" aria-label="Close definition" className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="z-50 w-[min(100vw-1.5rem,22rem)] rounded-xl border bg-popover p-4 text-sm shadow-lg"
        style={mobile ? { position: "fixed", left: 12, right: 12, bottom: 76 } : { position: "fixed", top, left }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cn text-2xl leading-none">{lex.chinese}</span>
              <span
                className={
                  lex.kind === "business"
                    ? "text-[10px] tracking-[0.14em] text-cinnabar uppercase"
                    : "text-[10px] tracking-[0.14em] text-muted-foreground uppercase"
                }
              >
                {lex.kind === "business" ? "Business term" : lex.kind === "function" ? "Grammar" : "Vocabulary"}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {lex.pinyin} · {lex.pos}
            </p>
          </div>
          <button type="button" aria-label="Listen" onClick={() => speak(lex.chinese)} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
            <Volume2 className="size-4" />
          </button>
        </div>
        <p className="mt-3 text-[15px] leading-snug">{lex.english}</p>
        {lex.businessUsage && (
          <div className="mt-3">
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Business usage</p>
            <p className="mt-1 leading-relaxed text-foreground/90">{lex.businessUsage}</p>
          </div>
        )}
        {lex.collocations && lex.collocations.length > 0 && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Collocations: {lex.collocations.join(" · ")}
          </p>
        )}
        {sentenceCn && (
          <div className="mt-3 rounded-lg bg-muted/70 px-3 py-2">
            <p className="font-cn leading-relaxed">{sentenceCn}</p>
            <p className="mt-1 text-xs text-muted-foreground italic">{sentence?.en}</p>
          </div>
        )}
        {more && examples.length > 0 && (
          <ul className="mt-2 space-y-2">
            {examples.map((example) => (
              <li key={example.sentenceId} className="text-xs leading-relaxed">
                <p className="font-cn">{example.cn}</p>
                <p className="text-muted-foreground italic">{example.en}</p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant={saved ? "secondary" : "default"} onClick={() => onSave(sentenceCn)} disabled={Boolean(saved)}>
            <Bookmark />
            {saved ? "In the vault" : "Add to vocabulary"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMore((value) => !value)}>
            {more ? "Hide examples" : "More examples"}
          </Button>
          {entityRecord && (
            <Button size="sm" variant="outline" onClick={() => onOpenEntity(entityRecord.id)}>
              {entityRecord.nameCn}
            </Button>
          )}
          {lex.related && lex.related.length > 0 && (
            <p className="w-full text-xs text-muted-foreground">
              Related: {lex.related.join(" · ")}
            </p>
          )}
          <Link href={`/learn?q=${encodeURIComponent(lex.chinese)}`} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
            Open in the vault
          </Link>
        </div>
      </div>
    </>
  );
}
