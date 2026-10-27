"use client";

import { Button } from "@/components/ui/button";
import { categoryById } from "@/lib/data/categories";
import { formatClock, formatWhen } from "@/lib/format";
import { requestStudy, studyErrorCopy } from "@/lib/live/ai";
import { loadCedict } from "@/lib/live/cedict";
import { readDocument, saveDocument } from "@/lib/live/db";
import { fetchArticle, relayErrorCopy } from "@/lib/live/relay";
import type { ConnectionSettings } from "@/lib/live/settings";
import { useConnection } from "@/lib/live/settings";
import { lookupWord, segmentText, splitSentences, type Token } from "@/lib/live/segment";
import type { StoredDocument, StudyNotes } from "@/lib/live/types";
import { speak } from "@/lib/speech";
import { useUser } from "@/lib/store";
import { cn } from "cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function LiveReader() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const settings = useConnection();
  const { state, saveTerm, lookup, markReading, markQuiz, addSeconds, setReader } = useUser();
  const [doc, setDoc] = useState<StoredDocument | null>(null);
  const [missing, setMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);
  const [dictReady, setDictReady] = useState(false);
  const [dictError, setDictError] = useState(false);
  const [selected, setSelected] = useState<{ token: Token; sentence: string } | null>(null);
  const [studyError, setStudyError] = useState("");
  const [studying, setStudying] = useState(false);

  useEffect(() => {
    void loadCedict()
      .then(() => setDictReady(true))
      .catch(() => setDictError(true));
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setMissing(true);
      return;
    }
    let cancel = false;
    setLoading(true);
    setMissing(false);
    setSelected(null);
    void (async () => {
      const stored = await readDocument(id).catch(() => null);
      if (cancel) return;
      if (!stored) {
        setDoc(null);
        setMissing(true);
        setLoading(false);
        return;
      }
      setDoc(stored);
      setLoading(false);
      setResolving(true);
      const resolved = await resolveDocument(stored, settings);
      if (cancel) return;
      setDoc(resolved);
      setResolving(false);
    })();
    return () => {
      cancel = true;
    };
  }, [id, settings]);

  const articleKey = doc ? (doc.kind === "import" ? `import:${doc.id}` : `live:${doc.id}`) : "";

  useEffect(() => {
    if (!articleKey || !doc?.text) return;
    markReading(articleKey);
  }, [articleKey, doc?.text, markReading]);

  useEffect(() => {
    if (!articleKey) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") addSeconds(articleKey, 15);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [addSeconds, articleKey]);

  const keepWord = useCallback((token: Token, sentence: string) => {
    if (!doc) return;
    const known = token.business ?? lookupWord(token.text);
    if (known) {
      saveTerm(known.id, articleKey, sentence);
      lookup(articleKey, known.id);
      return;
    }
    if (!token.english) return;
    const lexemeId = `cedict:${token.text}`;
    saveTerm(lexemeId, articleKey, sentence, {
      chinese: token.text,
      pinyin: token.pinyin,
      english: token.english,
    });
    lookup(articleKey, lexemeId);
  }, [articleKey, doc, lookup, saveTerm]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "p") setReader({ pinyin: !state.reader.pinyin });
      if (event.key === "e") setReader({ english: !state.reader.english });
      if (event.key === "l") setReader({ learning: !state.reader.learning });
      if (event.key === "a") setReader({ audio: !state.reader.audio });
      if (event.key === "s" && selected) {
        event.preventDefault();
        keepWord(selected.token, selected.sentence);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keepWord, selected, setReader, state.reader]);

  async function generateStudy() {
    if (!doc?.text || !settings.aiKey) return;
    setStudying(true);
    setStudyError("");
    try {
      const notes = await requestStudy(settings, doc.title, doc.text);
      const next = { ...doc, study: notes };
      await saveDocument(next);
      setDoc(next);
      if (!notes.sentences.length && !notes.takeaways.length && !notes.quiz.length && !notes.whyItMatters && !notes.facts.length && !notes.entities.length) {
        setStudyError("The model returned nothing that stayed inside this text.");
      }
    } catch (error) {
      setStudyError(studyErrorCopy(error));
    } finally {
      setStudying(false);
    }
  }

  if (loading) {
    return <p className="px-6 py-16 text-sm text-muted-foreground">Opening the saved copy in this browser…</p>;
  }

  if (missing || !doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-serif text-4xl tracking-tight">Not in this browser</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          This item is not in the local library. Open it again from the briefing after the feed loads, or paste it on Import. Nothing is filled in here.
        </p>
        <Button className="mt-6" variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to the briefing
        </Button>
      </div>
    );
  }

  const category = categoryById[doc.category];
  const sentences = doc.text ? splitSentences(doc.text) : [];
  const saved = state.read[articleKey]?.saved ?? [];

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_280px]">
      <article>
        <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
          {doc.kind === "podcast" ? "Podcast" : doc.kind === "import" ? "Imported" : "Live"} · {category?.short ?? doc.category}
        </p>
        <h1 className="mt-3 font-cn text-3xl leading-snug font-medium sm:text-4xl">{doc.title || "Untitled"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="text-foreground/80">{doc.sourceName || "Unknown source"}</span>
          {doc.publishedAt ? ` · ${formatWhen(doc.publishedAt)} · ${formatClock(doc.publishedAt)}` : ""}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{statusCopy(doc)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {doc.url && (
            <a href={doc.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              Open original
            </a>
          )}
          <Link href="/settings" className="text-muted-foreground underline-offset-4 hover:underline">
            Settings
          </Link>
        </div>

        {doc.kind === "podcast" && (
          <div className="mt-6 rounded-xl border bg-card px-4 py-4">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Player</p>
            {doc.audioUrl ? (
              <audio className="mt-3 w-full" controls preload="none" src={doc.audioUrl}>
                Audio
              </audio>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">The feed did not include an audio file.</p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Toggle on={state.reader.pinyin} label="Pinyin" onClick={() => setReader({ pinyin: !state.reader.pinyin })} />
          <Toggle on={state.reader.english} label="English" onClick={() => setReader({ english: !state.reader.english })} />
          <Toggle on={state.reader.learning} label="Learning" onClick={() => setReader({ learning: !state.reader.learning })} />
          <Toggle on={state.reader.audio} label="Audio" onClick={() => setReader({ audio: !state.reader.audio })} />
        </div>
        {dictError && (
          <p className="mt-3 text-xs text-muted-foreground">The dictionary file did not load. The text is still here, without definitions.</p>
        )}
        {!dictReady && !dictError && doc.text && (
          <p className="mt-3 text-xs text-muted-foreground">Loading the dictionary for definitions…</p>
        )}

        {resolving && !doc.text && (
          <p className="mt-8 text-sm text-muted-foreground">Fetching the original page…</p>
        )}
        {!resolving && !doc.text && (
          <p className="mt-8 rounded-xl border border-dashed px-4 py-8 text-sm leading-relaxed text-muted-foreground">
            No article text is available. Use Open original. This page will not invent a body.
          </p>
        )}

        <div className="mt-8 space-y-8">
          {sentences.map((sentence, index) => (
            <SentenceBlock
              key={`${index}-${sentence.slice(0, 12)}`}
              sentence={sentence}
              dictReady={dictReady}
              pinyin={state.reader.pinyin}
              english={state.reader.english}
              learning={state.reader.learning}
              audio={state.reader.audio}
              saved={saved}
              notes={doc.study}
              active={selected?.sentence === sentence ? selected.token : null}
              onSelect={(token) => {
                setSelected({ token, sentence });
                const idForLookup = token.business?.id ?? (token.english ? `cedict:${token.text}` : "");
                if (idForLookup) lookup(articleKey, idForLookup);
              }}
            />
          ))}
        </div>

        {selected && (
          <div className="fixed inset-x-3 bottom-20 z-30 mx-auto max-w-lg rounded-xl border bg-card px-4 py-4 shadow-lg md:bottom-6">
            <div className="flex items-start justify-between gap-3">
              <p className="font-cn text-2xl">{selected.token.text}</p>
              <button type="button" className="text-xs text-muted-foreground" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{selected.token.pinyin || "No pinyin on file"}</p>
            <p className="mt-2 text-sm">{selected.token.english || "No dictionary entry for this span."}</p>
            {selected.token.business?.businessUsage && (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{selected.token.business.businessUsage}</p>
            )}
            {selected.token.business && (
              <p className="mt-2 text-[11px] tracking-[0.14em] text-cinnabar uppercase">Business term</p>
            )}
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={() => keepWord(selected.token, selected.sentence)} disabled={!selected.token.english && !selected.token.business}>
                Save to vault
              </Button>
              <Button size="sm" variant="outline" onClick={() => speak(selected.token.text)}>
                Speak
              </Button>
            </div>
          </div>
        )}

        <StudyPanel
          doc={doc}
          settings={settings}
          studying={studying}
          studyError={studyError}
          onGenerate={() => void generateStudy()}
          onQuiz={(score, total) => markQuiz(articleKey, score, total)}
        />

        <p className="mt-10 text-[11px] leading-relaxed text-muted-foreground">
          Definitions from CC-CEDICT (MDBG), CC BY-SA 4.0. For personal reading. Do not republish the article.
        </p>
      </article>
      <aside className="space-y-4 xl:pt-16">
        <div className="rounded-xl border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
          <p className="text-[11px] tracking-[0.14em] uppercase">This copy</p>
          <p className="mt-2">Click a word for pinyin and a dictionary gloss. Business terms use the app lexicon. Save to vault keeps the word on your review schedule.</p>
        </div>
      </aside>
    </div>
  );
}

function SentenceBlock({
  sentence,
  dictReady,
  pinyin,
  english,
  learning,
  audio,
  saved,
  notes,
  active,
  onSelect,
}: {
  sentence: string;
  dictReady: boolean;
  pinyin: boolean;
  english: boolean;
  learning: boolean;
  audio: boolean;
  saved: string[];
  notes?: StudyNotes;
  active: Token | null;
  onSelect: (token: Token) => void;
}) {
  const tokens = useMemo(() => segmentText(dictReady ? sentence : sentence), [dictReady, sentence]);
  const gloss = notes?.sentences.find((item) => item.cn && (sentence.includes(item.cn) || item.cn.includes(sentence)));
  return (
    <div>
      <div className={cn("font-cn text-[1.22rem] sm:text-[1.32rem]", pinyin ? "leading-[2.55]" : "leading-[1.95]")}>
        {tokens.map((token, index) => {
          if (!token.text.trim()) return <span key={index}>{token.text}</span>;
          const business = Boolean(token.business);
          const knownId = token.business?.id ?? (token.english ? `cedict:${token.text}` : "");
          return (
            <span key={index} className={cn("inline-flex flex-col items-center align-bottom", pinyin && "mx-[0.06em]")}>
              {pinyin && (
                <span className="mb-0.5 font-sans text-[10px] leading-none tracking-wide text-muted-foreground whitespace-nowrap">
                  {token.pinyin}
                </span>
              )}
              <button
                type="button"
                data-active={active && active.text === token.text ? "true" : undefined}
                className={cn(
                  "zh-word px-px font-cn",
                  learning && business && "underline decoration-cinnabar decoration-1 underline-offset-[7px]",
                  knownId && saved.includes(knownId) && "bg-sand"
                )}
                onClick={() => onSelect(token)}
              >
                {token.text}
              </button>
            </span>
          );
        })}
        {audio && (
          <button type="button" className="ml-2 align-middle font-sans text-xs text-muted-foreground" onClick={() => speak(sentence)}>
            Listen
          </button>
        )}
      </div>
      {english && gloss?.en && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{gloss.en}</p>}
    </div>
  );
}

function StudyPanel({
  doc,
  settings,
  studying,
  studyError,
  onGenerate,
  onQuiz,
}: {
  doc: StoredDocument;
  settings: ConnectionSettings;
  studying: boolean;
  studyError: string;
  onGenerate: () => void;
  onQuiz: (score: number, total: number) => void;
}) {
  const notes = doc.study;
  const enough = doc.text.trim().length >= 40;
  return (
    <section className="mt-10 space-y-4 border-t pt-6">
      <h2 className="font-serif text-2xl tracking-tight">Study</h2>
      {doc.kind === "podcast" && (
        <p className="text-xs text-muted-foreground">Study notes below, if you generate them, are about the show notes only.</p>
      )}
      {!settings.aiKey && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          Sentence translation, takeaways, why this matters, and a quiz stay empty until you add an API key in Settings. Nothing is generated without one.
        </p>
      )}
      {settings.aiKey && !enough && (
        <p className="text-sm text-muted-foreground">There is not enough text here to send for study notes.</p>
      )}
      {settings.aiKey && enough && (
        <Button size="sm" variant="outline" onClick={onGenerate} disabled={studying}>
          {studying ? "Asking the model…" : notes ? "Regenerate from this text" : "Generate from this text"}
        </Button>
      )}
      {studyError && <p className="text-sm text-muted-foreground">{studyError}</p>}
      {notes && <Notes notes={notes} onQuiz={onQuiz} />}
    </section>
  );
}

function Notes({ notes, onQuiz }: { notes: StudyNotes; onQuiz: (score: number, total: number) => void }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = notes.quiz.reduce((sum, item, index) => sum + (picked[index] === item.answer ? 1 : 0), 0);

  return (
    <div className="space-y-6">
      {(notes.entities?.length ?? 0) > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Names in this text</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {notes.entities.map((item) => (
              <li key={item.name}>
                <span className="font-cn">{item.name}</span>
                {item.note && <span className="text-muted-foreground"> — {item.note}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {notes.sentences.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Sentences</h3>
          <ul className="mt-2 space-y-3">
            {notes.sentences.map((item) => (
              <li key={item.cn}>
                <p className="font-cn leading-relaxed">{item.cn}</p>
                <p className="text-sm text-muted-foreground">{item.en}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {notes.takeaways.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Takeaways</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {notes.takeaways.map((item) => (
              <li key={item.cn}>
                <span className="font-cn">{item.cn}</span>
                <span className="text-muted-foreground"> — {item.en}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {notes.whyItMatters && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Why this matters</h3>
          <p className="mt-2 text-sm leading-relaxed">{notes.whyItMatters}</p>
        </div>
      )}
      {notes.facts.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Reported in the text</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
            {notes.facts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {notes.inferences.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Inference, not reported</h3>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            {notes.inferences.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {notes.quiz.length > 0 && (
        <div>
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Quiz</h3>
          <ol className="mt-2 space-y-4">
            {notes.quiz.map((item, index) => (
              <li key={item.prompt}>
                <p className="text-sm">{item.prompt}</p>
                <div className="mt-2 grid gap-1.5">
                  {item.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPicked((current) => ({ ...current, [index]: optionIndex }))}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-left text-sm",
                        picked[index] === optionIndex && "border-foreground/30 bg-muted"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {checked && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {picked[index] === item.answer ? "Matches the text." : item.explanation || "That does not match the marked answer."}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            onClick={() => {
              setChecked(true);
              onQuiz(score, notes.quiz.length);
            }}
          >
            Check
          </Button>
        </div>
      )}
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-full border px-2.5 py-1 text-xs", on ? "bg-card text-foreground" : "text-muted-foreground")}
    >
      {label}
    </button>
  );
}

function statusCopy(doc: StoredDocument) {
  if (doc.kind === "podcast") {
    return doc.text
      ? "Show notes from the podcast feed. This is not a written article."
      : "The feed did not include show notes.";
  }
  if (doc.textMode === "pasted") return "Pasted text, stored in this browser.";
  if (doc.textFrom === "page") return "Full text extracted from the original page.";
  if (doc.textFrom === "feed" && doc.textMode === "full") {
    const why = doc.error ? `${relayErrorCopy(doc.error)} ` : "";
    return `${why}This is the text the feed included.`;
  }
  if (doc.textMode === "excerpt") {
    const why = doc.error ? `${relayErrorCopy(doc.error)} ` : "";
    return `${why}Only an excerpt is available.`;
  }
  if (doc.error) return relayErrorCopy(doc.error);
  return "No text is available.";
}

async function resolveDocument(doc: StoredDocument, settings: ConnectionSettings) {
  if (doc.kind === "podcast") {
    const notes = (doc.textFrom === "notes" && doc.text ? doc.text : doc.feedText || doc.excerpt || "").trim();
    const next: StoredDocument = {
      ...doc,
      text: notes,
      textMode: notes ? "shownotes" : "none",
      textFrom: notes ? "notes" : "",
      error: notes ? "" : doc.error,
    };
    await saveDocument(next);
    return next;
  }
  if (doc.kind === "import" && doc.text.trim()) return doc;
  if (doc.textFrom === "page" && doc.text.trim().length >= 180) return doc;

  if (settings.relayUrl && doc.url) {
    try {
      const page = await fetchArticle(settings, doc.url);
      const text = (page.text ?? "").trim();
      if (text.length >= 180) {
        const next: StoredDocument = {
          ...doc,
          title: doc.title || page.title || "",
          text,
          textMode: "full",
          textFrom: "page",
          error: "",
        };
        await saveDocument(next);
        return next;
      }
      return finishFromFeed(doc, "extraction_failed");
    } catch (error) {
      return finishFromFeed(doc, error instanceof Error ? error.message : "fetch_failed");
    }
  }
  return finishFromFeed(doc, settings.relayUrl ? "" : "relay_unset");
}

async function finishFromFeed(doc: StoredDocument, code: string) {
  const feed = (doc.feedText || doc.excerpt || "").trim();
  if (!feed) {
    const next: StoredDocument = { ...doc, text: "", textMode: "none", textFrom: "", error: code || "no_text" };
    await saveDocument(next);
    return next;
  }
  const full = doc.supplied === "full" && feed.length >= 180;
  const next: StoredDocument = {
    ...doc,
    text: feed,
    textMode: full ? "full" : "excerpt",
    textFrom: "feed",
    error: code,
  };
  await saveDocument(next);
  return next;
}
