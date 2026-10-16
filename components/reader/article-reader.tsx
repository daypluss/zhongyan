"use client";

import { ArticleCard } from "@/components/briefing/article-card";
import { ChineseText } from "@/components/reader/chinese-text";
import { VocabPanel } from "@/components/reader/vocab-panel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getArticle, getLexeme, nextArticle, relatedArticles, sentenceText } from "@/lib/data";
import { categoryById } from "@/lib/data/categories";
import { entityById } from "@/lib/data/entities";
import { sourceById } from "@/lib/data/sources";
import { difficultyLabel, difficultyTone, formatDay } from "@/lib/format";
import { comprehension } from "@/lib/reading";
import { canSpeak, speak } from "@/lib/speech";
import { useUser } from "@/lib/store";
import { cn } from "cn";
import { Bookmark, Check, Volume2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export function ArticleReader({ id }: { id: string }) {
  const article = getArticle(id);
  const { state, saveTerm, lookup, toggleArticle, markReading, markQuiz, addSeconds, toggleTopic, toggleEntity, setNote, setReader } = useUser();
  const [active, setActive] = useState<{ lexemeId: string; sentenceId: string; rect: DOMRect } | null>(null);
  const [entityId, setEntityId] = useState<string | null>(null);
  const [takeawayLang, setTakeawayLang] = useState<"en" | "cn">("en");
  const [quizIndex, setQuizIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const lastTerm = useRef<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") addSeconds(id, 15);
    }, 15000);
    return () => window.clearInterval(timer);
  }, [addSeconds, id]);

  useEffect(() => {
    const node = endRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) markReading(id);
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [id, markReading]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (event.key === "p") setReader({ pinyin: !state.reader.pinyin });
      if (event.key === "e") setReader({ english: !state.reader.english });
      if (event.key === "l") setReader({ learning: !state.reader.learning });
      if (event.key === "a") setReader({ audio: !state.reader.audio });
      if (event.key === "s") {
        event.preventDefault();
        if (lastTerm.current && article) {
          const sentence = article.paragraphs
            .flatMap((paragraph) => paragraph.sentences)
            .find((item) => item.segments.some((segment) => segment.lexemeId === lastTerm.current));
          saveTerm(lastTerm.current, id, sentence ? sentenceText(sentence.segments) : article.titleCn);
        } else {
          toggleArticle(id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [article, id, saveTerm, setReader, state.reader, toggleArticle]);

  const progress = state.read[id];
  const lookups = progress?.lookups ?? [];
  const savedIds = progress?.saved ?? [];
  const score = article ? comprehension(article, state) : 0;
  const keySentences = useMemo(
    () => article?.paragraphs.flatMap((paragraph) => paragraph.sentences).filter((sentence) => sentence.key) ?? [],
    [article]
  );

  if (!article) {
    return <p className="px-6 py-16 text-sm text-muted-foreground">This story is not in the edition.</p>;
  }

  const source = sourceById[article.sourceId];
  const category = categoryById[article.category];
  const savedArticle = state.savedArticles.includes(article.id);
  const following = state.follows.topics.includes(article.category);
  const entity = entityId ? entityById[entityId] : undefined;
  const related = relatedArticles(article);
  const upcoming = nextArticle(article.id);
  const question = article.quiz[quizIndex];

  function choose(option: number) {
    if (picked !== null || !question) return;
    setPicked(option);
    if (option === question.answer) setCorrectCount((count) => count + 1);
  }

  function advance() {
    if (!question || picked === null) return;
    const nextScore = correctCount;
    if (quizIndex + 1 >= article!.quiz.length) {
      setFinished(true);
      markQuiz(article!.id, nextScore, article!.quiz.length);
      return;
    }
    setQuizIndex((index) => index + 1);
    setPicked(null);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-10 lg:py-8">
      <article>
        <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
          <Link href="/" className="hover:text-foreground">Briefing</Link>
          <span className="mx-1.5">/</span>
          {category.name}
        </p>
        <header className="mt-4 border-b pb-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="text-foreground">{source?.name}</span>
            <span>Demo copy</span>
            <span>{formatDay(article.publishedAt)}</span>
            <span>{article.readingMinutes} min</span>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", difficultyTone(article.difficulty))} />
              {difficultyLabel[article.difficulty]}
            </span>
          </div>
          <h1 className="mt-4 font-cn text-[1.85rem] leading-[1.35] font-medium tracking-tight sm:text-[2.15rem]">
            {article.titleCn}
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground italic">
            {article.titleEn}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed">
            <span className="font-medium text-cinnabar">Why it matters</span>
            <span className="mx-1.5 text-muted-foreground">·</span>
            {article.whyItMatters}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                {tag}
              </span>
            ))}
            <Button size="sm" variant={savedArticle ? "secondary" : "outline"} onClick={() => toggleArticle(article.id)}>
              <Bookmark />
              {savedArticle ? "Saved" : "Save article"}
            </Button>
            <Button size="sm" variant={following ? "secondary" : "outline"} onClick={() => toggleTopic(article.category)}>
              {following ? "Following topic" : "Follow topic"}
            </Button>
          </div>
        </header>

        <div className="sticky top-0 z-20 -mx-1 mt-4 flex flex-wrap items-center gap-1.5 border-b bg-background/90 py-2 backdrop-blur md:top-0">
          <Toggle on={state.reader.pinyin} label="Pinyin" onClick={() => setReader({ pinyin: !state.reader.pinyin })} />
          <Toggle on={state.reader.english} label="English" onClick={() => setReader({ english: !state.reader.english })} />
          <Toggle on={state.reader.audio} label="Audio" onClick={() => setReader({ audio: !state.reader.audio })} />
          <Toggle on={state.reader.learning} label="Learning mode" onClick={() => setReader({ learning: !state.reader.learning })} />
          <span className="ml-auto hidden text-[11px] text-muted-foreground sm:inline">Chinese first. Assistance is a switch.</span>
        </div>
        {state.reader.learning && (
          <p className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span><span className="mr-1 inline-block h-2 w-3 bg-sand" /> Vocabulary you are less likely to know</span>
            <span className="underline decoration-cinnabar underline-offset-4">Business term</span>
            <span className="underline decoration-dotted underline-offset-4">Company or institution</span>
          </p>
        )}

        <div className="mt-6">
          <ChineseText
            article={article}
            pinyin={state.reader.pinyin}
            english={state.reader.english}
            learning={state.reader.learning}
            audio={state.reader.audio}
            level={state.level}
            lookups={lookups}
            saved={Object.keys(state.terms)}
            activeId={active?.lexemeId}
            onSelect={(lexemeId, sentenceId, rect) => {
              lastTerm.current = lexemeId;
              lookup(article.id, lexemeId);
              setActive({ lexemeId, sentenceId, rect });
            }}
          />
        </div>
        <div ref={endRef} />

        <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
          Written for Zhongyan as original study copy in the register of {source?.name}. It is not that publication&apos;s reporting.
        </p>

        <Section kicker="Learn" title="Key business lingo">
          <div className="grid gap-3 sm:grid-cols-2">
            {article.lingo.map((termId) => {
              const lex = state.terms[termId];
              const term = article && termId;
              return <LingoCard key={term} id={termId} saved={Boolean(lex)} onSave={(sentence) => saveTerm(termId, article.id, sentence)} />;
            })}
          </div>
        </Section>

        <Section kicker="Listen" title="Important sentences">
          <p className="text-sm text-muted-foreground">
            {canSpeak()
              ? "Browser voice, Mandarin. Replay a sentence, then say it back in the practice below. This is not a studio recording."
              : "This browser has no speech synthesis. The sentences are still here to read aloud."}
          </p>
          <ul className="mt-3 space-y-3">
            {keySentences.map((sentence) => {
              const cn = sentenceText(sentence.segments);
              return (
                <li key={sentence.id} className="rounded-xl border bg-card px-3 py-3">
                  <p className="font-cn text-lg leading-relaxed">{cn}</p>
                  <p className="mt-1 text-sm text-muted-foreground italic">{sentence.en}</p>
                  <Button className="mt-2" size="sm" variant="outline" onClick={() => speak(cn)}>
                    <Volume2 />
                    Listen
                  </Button>
                </li>
              );
            })}
          </ul>
          <SpeakingPractice lines={keySentences.map((sentence) => sentenceText(sentence.segments))} />
        </Section>

        <Section kicker="Test" title="Test your understanding">
          {finished || progress?.quizDone ? (
            <div className="rounded-xl border bg-card px-4 py-4">
              <p className="font-serif text-2xl tracking-tight">
                {progress?.quizScore ?? correctCount} / {progress?.quizTotal ?? article.quiz.length}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stored with this story. The point is the explanation, not a streak.
              </p>
            </div>
          ) : (
            question && (
              <div>
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  {quizIndex + 1} of {article.quiz.length} · {question.kind}
                </p>
                <p className="mt-2 text-base leading-relaxed">{question.prompt}</p>
                <div className="mt-3 grid gap-2">
                  {question.options.map((option, index) => {
                    const show = picked !== null;
                    const right = index === question.answer;
                    const wrong = show && picked === index && !right;
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={picked !== null}
                        onClick={() => choose(index)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition hover:border-foreground/20",
                          show && right && "border-olive/50 bg-olive/10",
                          wrong && "border-cinnabar/40 bg-cinnabar/5"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {picked !== null && (
                  <div className="mt-3 rounded-lg bg-muted/70 px-3 py-3 text-sm leading-relaxed">
                    <p className="font-medium">{picked === question.answer ? "Correct." : "Not quite."}</p>
                    <p className="mt-1">{question.explanation}</p>
                    {question.sentence && <p className="mt-2 font-cn">{question.sentence}</p>}
                    {question.keyPhrase && (
                      <p className="mt-1 text-xs text-muted-foreground">Key phrase: {question.keyPhrase}</p>
                    )}
                    <Button className="mt-3" size="sm" onClick={advance}>
                      {quizIndex + 1 === article.quiz.length ? "Finish" : "Next"}
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </Section>

        <Section kicker="Apply" title="Why this matters">
          <div className="grid gap-4 md:grid-cols-2">
            <PointList title="What happened" kind="briefing" items={article.investor.facts} />
            <PointList title="Why it might matter" kind="inference" items={article.investor.inferences} />
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border">
            {article.investor.relevance.map((row) => (
              <div key={row.label} className="grid gap-1 border-b px-3 py-3 last:border-0 sm:grid-cols-[140px_minmax(0,1fr)]">
                <div>
                  <p className="text-sm">{row.label}</p>
                  <p className={cn("text-[10px] tracking-[0.14em] uppercase", row.kind === "fact" ? "text-olive" : "text-brass")}>
                    {row.kind === "fact" ? "In this briefing" : "Inference"}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{row.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">What to watch next</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed">
              {article.investor.watch.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section kicker="Remember" title="Key takeaways">
          <div className="mb-3 inline-flex rounded-lg border p-0.5 text-xs">
            {(["en", "cn"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setTakeawayLang(lang)}
                className={cn("rounded-md px-2.5 py-1", takeawayLang === lang && "bg-muted text-foreground", takeawayLang !== lang && "text-muted-foreground")}
              >
                {lang === "en" ? "English" : "中文"}
              </button>
            ))}
          </div>
          <ol className="space-y-2">
            {article.takeaways.map((item, index) => (
              <li key={item.en} className="flex gap-3 text-sm leading-relaxed">
                <span className="font-serif text-muted-foreground">{index + 1}</span>
                <span className={takeawayLang === "cn" ? "font-cn text-base" : ""}>
                  {takeawayLang === "en" ? item.en : item.cn}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <section className="mt-10 rounded-xl border bg-card px-4 py-4">
          <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">This sitting</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            <CheckRow done={Boolean(progress?.readingDone)} label="Reading" />
            <CheckRow done={savedIds.length > 0} label={`Vocabulary · ${savedIds.length} saved from this story`} />
            <CheckRow done={Boolean(progress?.quizDone)} label="Quiz" />
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {lookups.length} lookups · est. comprehension with help {score}% · {Math.max(1, Math.round((progress?.seconds ?? 0) / 60))} min on this page
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/learn/review" />}>
              Review vocabulary
            </Button>
            <Button size="sm" nativeButton={false} render={<Link href={`/read/${upcoming.id}`} />}>
              Next article
            </Button>
          </div>
        </section>

        {related.length > 0 && (
          <div className="mt-8 grid gap-3">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Related in this edition</p>
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        )}
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-4">
          <div className="rounded-xl border bg-card p-4">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">This story</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Rail label="Lookups" value={String(lookups.length)} />
              <Rail label="Saved" value={String(savedIds.length)} />
              <Rail label="Comprehension" value={`${score}%`} />
            </dl>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Comprehension assumes your level and counts a word as known once you open it.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">In the piece</p>
            <ul className="mt-2 space-y-1.5">
              {article.entityIds.map((item) => {
                const record = entityById[item];
                if (!record) return null;
                return (
                  <li key={item}>
                    <button type="button" className="text-left text-sm hover:underline" onClick={() => setEntityId(item)}>
                      <span className="font-cn">{record.nameCn}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">{record.nameEn}</span>
                    </button>
                  </li>
                );
              })}
              {article.entityIds.length === 0 && (
                <li className="text-xs text-muted-foreground">No named company. The mechanism is the subject.</li>
              )}
            </ul>
          </div>
        </div>
      </aside>

      {active && (
        <VocabPanel
          lexemeId={active.lexemeId}
          articleId={article.id}
          sentenceId={active.sentenceId}
          rect={active.rect}
          saved={state.terms[active.lexemeId]}
          onClose={() => setActive(null)}
          onSave={(sentence) => saveTerm(active.lexemeId, article.id, sentence)}
          onOpenEntity={(next) => {
            setEntityId(next);
            setActive(null);
          }}
        />
      )}

      <Sheet open={Boolean(entity)} onOpenChange={(open) => !open && setEntityId(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {entity && (
            <>
              <SheetHeader>
                <SheetTitle className="font-cn text-2xl">{entity.nameCn}</SheetTitle>
                <SheetDescription>
                  {entity.nameEn} · {entity.sector}
                  {entity.fictional ? " · Demo company" : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6 text-sm leading-relaxed">
                <p>{entity.description}</p>
                <Button size="sm" variant={state.follows.entities.includes(entity.id) ? "secondary" : "outline"} onClick={() => toggleEntity(entity.id)}>
                  {state.follows.entities.includes(entity.id) ? "Following" : "Follow"}
                </Button>
                <div>
                  <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Thesis note</p>
                  <textarea
                    value={state.notes[entity.id] ?? ""}
                    onChange={(event) => setNote(entity.id, event.target.value)}
                    placeholder="What would change your view?"
                    className="mt-2 min-h-24 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </div>
                <Link href={`/explore/entities/${entity.id}`} className="inline-block text-sm underline-offset-2 hover:underline">
                  Open the full profile
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs",
        on ? "border-foreground/20 bg-card text-foreground" : "text-muted-foreground"
      )}
      aria-pressed={on}
    >
      {label}
    </button>
  );
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <p className="text-[11px] tracking-[0.16em] text-cinnabar uppercase">{kicker}</p>
      <h2 className="mt-1 font-serif text-2xl tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function LingoCard({ id, saved, onSave }: { id: string; saved: boolean; onSave: (sentence: string) => void }) {
  const lex = getLexeme(id);
  if (!lex) return null;
  return (
    <div className="rounded-xl border bg-card px-3 py-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-cn text-xl">{lex.chinese}</p>
        <p className="text-[11px] text-muted-foreground">{lex.pinyin}</p>
      </div>
      <p className="mt-1 text-sm">{lex.english}</p>
      {lex.businessUsage && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{lex.businessUsage}</p>}
      <Button className="mt-3" size="xs" variant={saved ? "secondary" : "outline"} disabled={saved} onClick={() => onSave(lex.collocations?.[0] ?? lex.chinese)}>
        {saved ? "Saved" : "Save"}
      </Button>
    </div>
  );
}

function PointList({ title, kind, items }: { title: string; kind: "briefing" | "inference"; items: string[] }) {
  return (
    <div className="rounded-xl border bg-card px-3 py-3">
      <p className="text-sm">{title}</p>
      <p className={cn("text-[10px] tracking-[0.14em] uppercase", kind === "briefing" ? "text-olive" : "text-brass")}>
        {kind === "briefing" ? "In this briefing" : "Inference, not a reported fact"}
      </p>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CheckRow({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <Check className={cn("size-3.5", done ? "text-olive" : "text-muted-foreground/40")} />
      <span className={done ? "" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}

function Rail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

function SpeakingPractice({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [note, setNote] = useState("Listen, record, then play your take beside the browser voice.");
  const recorder = useRef<MediaRecorder | null>(null);
  const started = useRef(0);
  const line = lines[index] ?? "";

  async function record() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setNote("This browser cannot record. Listen and repeat aloud.");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const media = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];
    media.ondataavailable = (event) => chunks.push(event.data);
    media.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: media.mimeType });
      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(blob));
      const elapsed = (Date.now() - started.current) / 1000;
      setSeconds(elapsed);
      const estimate = Math.max(1.2, line.length * 0.28);
      setNote(
        `Recorded ${elapsed.toFixed(1)}s. A rough spoken length for this line is about ${estimate.toFixed(1)}s. Compare by ear — this build does not score tones.`
      );
    };
    recorder.current = media;
    started.current = Date.now();
    media.start();
    setNote("Recording… click stop when you finish the line.");
  }

  function stop() {
    recorder.current?.stop();
  }

  if (!line) return null;

  return (
    <div className="mt-4 rounded-xl border border-dashed px-3 py-3">
      <p className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Speaking practice</p>
      <p className="mt-2 font-cn text-lg">{line}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {lines.map((item, itemIndex) => (
          <button key={item} type="button" className={cn("rounded-full border px-2 py-0.5 text-[11px]", itemIndex === index && "bg-muted")} onClick={() => setIndex(itemIndex)}>
            Line {itemIndex + 1}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => speak(line, 0.8)}>
          Listen
        </Button>
        <Button size="sm" variant="outline" onClick={record}>
          Record
        </Button>
        <Button size="sm" variant="outline" onClick={stop}>
          Stop
        </Button>
      </div>
      {url && <audio className="mt-3 w-full" controls src={url} />}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p>
      {seconds !== null && <p className="text-[11px] text-muted-foreground">Duration match only. Not a pronunciation score.</p>}
    </div>
  );
}
