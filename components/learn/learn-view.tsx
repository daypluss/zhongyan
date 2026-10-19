"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getArticle } from "@/lib/data";
import { resolveSavedLexeme } from "@/lib/terms";
import { isDue } from "@/lib/srs";
import { useUser } from "@/lib/store";
import { cn } from "cn";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const FILTERS = ["all", "business", "finance", "tech jargon", "policy", "deal language", "industry"] as const;

export function LearnView() {
  const params = useSearchParams();
  const { state } = useUser();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const terms = Object.values(state.terms);
  const due = terms.filter((term) => isDue(term));

  const visible = useMemo(() => {
    return terms
      .map((term) => ({ term, lex: resolveSavedLexeme(term) }))
      .filter((item) => item.lex)
      .filter((item) => {
        const lex = item.lex!;
        if (filter === "business" && lex.kind !== "business") return false;
        if (filter !== "all" && filter !== "business" && lex.category !== filter) return false;
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          lex.chinese.includes(query.trim()) ||
          lex.english.toLowerCase().includes(q) ||
          lex.pinyin.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
        );
      });
  }, [filter, query, terms]);

  function exportFile(kind: "csv" | "json") {
    const rows = visible.map(({ term, lex }) => ({
      chinese: lex!.chinese,
      pinyin: lex!.pinyin,
      english: lex!.english,
      pos: lex!.pos,
      category: lex!.category,
      status: term.status,
      due: term.due,
      context: term.sentence,
      usage: lex!.businessUsage ?? "",
    }));
    const body =
      kind === "json"
        ? JSON.stringify(rows, null, 2)
        : ["chinese,pinyin,english,pos,category,status,due,context", ...rows.map((row) =>
            [row.chinese, row.pinyin, row.english, row.pos, row.category, row.status, row.due, row.context]
              .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
              .join(",")
          )].join("\n");
    const blob = new Blob([kind === "csv" ? `\uFEFF${body}` : body], {
      type: kind === "csv" ? "text/csv;charset=utf-8" : "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = kind === "csv" ? "zhongyan-vault.csv" : "zhongyan-vault.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Learn</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">Vocabulary vault</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Terms you saved from the briefing, with the sentence they came from. Review uses a simple spaced schedule — again, hard, good, easy.
      </p>

      <div className="mt-6 grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-serif text-3xl tracking-tight">{due.length}</p>
          <p className="text-sm text-muted-foreground">
            {due.length === 0
              ? terms.length === 0
                ? "Nothing saved yet. Open a story and keep the terms you will actually use."
                : "Nothing due. You can still practice the vault."
              : "Due now, including anything you just saved."}
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/learn/review" />}>Start daily review</Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Chinese, pinyin, or English" className="max-w-sm" />
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn("rounded-full border px-2.5 py-1 text-xs capitalize", filter === item ? "bg-card text-foreground" : "text-muted-foreground")}
          >
            {item}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={() => exportFile("csv")} disabled={visible.length === 0}>
          Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportFile("json")} disabled={visible.length === 0}>
          Export JSON
        </Button>
      </div>

      <ul className="mt-4 divide-y rounded-xl border bg-card">
        {visible.map(({ term, lex }) => {
          const article = getArticle(term.articleId);
          return (
            <li key={term.lexemeId} className="px-4 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-cn text-xl">{lex!.chinese}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{lex!.pinyin}</span>
                </div>
                <span className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">{term.status}</span>
              </div>
              <p className="mt-1 text-sm">{lex!.english}</p>
              {lex!.businessUsage && <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{lex!.businessUsage}</p>}
              <p className="mt-2 font-cn text-sm leading-relaxed">{term.sentence}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {lex!.category} · due {new Date(term.due).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                {article && (
                  <>
                    {" "}
                    · <Link href={`/read/${article.id}`} className="hover:underline">{article.titleCn}</Link>
                  </>
                )}
                {!article && (term.articleId.startsWith("live:") || term.articleId.startsWith("import:")) && (
                  <>
                    {" "}
                    · <Link href={`/live/?id=${encodeURIComponent(term.articleId.slice(term.articleId.indexOf(":") + 1))}`} className="hover:underline">Source text</Link>
                  </>
                )}
              </p>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">
            {terms.length === 0 ? "The vault is empty." : "No terms match this search."}
          </li>
        )}
      </ul>
    </div>
  );
}
