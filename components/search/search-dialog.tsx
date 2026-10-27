"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/data/categories";
import { lexemes } from "@/lib/data/lexicon";
import { readerHref } from "@/lib/live/id";
import { entitiesInLibrary } from "@/lib/live/mentions";
import { useDocuments } from "@/lib/live/use-documents";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const { documents } = useDocuments();
  const results = useMemo(() => searchDesk(query, documents), [documents, query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Articles in this browser, business terms, companies named in those articles, and sectors.</DialogDescription>
        </DialogHeader>
        <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="商业化, gross margin, CATL…" />
        <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1 text-sm">
          <ResultGroup title="Articles" empty={query.length > 0 && results.articles.length === 0}>
            {results.articles.slice(0, 6).map((article) => (
              <Link key={article.id} href={readerHref(article.id)} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                <div className="font-cn">{article.title || "Untitled"}</div>
                <div className="text-xs text-muted-foreground">{article.sourceName || "Pasted"}</div>
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Terms">
            {results.terms.slice(0, 8).map((term) => (
              <Link key={term.id} href={`/learn?q=${encodeURIComponent(term.chinese)}`} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                <span className="font-cn">{term.chinese}</span>
                <span className="ml-2 text-xs text-muted-foreground">{term.pinyin}</span>
                <div className="text-xs text-muted-foreground">{term.english}</div>
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Companies">
            {results.entities.slice(0, 6).map((entity) => (
              <Link
                key={entity.name}
                href={`/explore/entity/?name=${encodeURIComponent(entity.name)}`}
                onClick={() => onOpenChange(false)}
                className="block rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <span className="font-cn">{entity.name}</span>
                {entity.english && <span className="ml-2 text-xs text-muted-foreground">{entity.english}</span>}
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Sectors">
            {results.topics.slice(0, 6).map((topic) => (
              <Link key={topic.id} href={`/explore/topics/${topic.id}`} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                {topic.name}
              </Link>
            ))}
          </ResultGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function searchDesk(query: string, documents: ReturnType<typeof useDocuments>["documents"]) {
  const q = query.trim().toLowerCase();
  const needle = query.trim();
  if (!q) return { articles: [], terms: [], entities: [], topics: [] };
  return {
    articles: documents.filter(
      (document) =>
        document.title.includes(needle) ||
        document.sourceName.toLowerCase().includes(q) ||
        document.excerpt.toLowerCase().includes(q)
    ),
    terms: lexemes.filter((lexeme) => {
      if (lexeme.kind === "function") return false;
      return (
        lexeme.chinese.includes(needle) ||
        lexeme.english.toLowerCase().includes(q) ||
        lexeme.pinyin.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      );
    }),
    entities: entitiesInLibrary(documents).filter(
      (entity) => entity.name.includes(needle) || entity.english.toLowerCase().includes(q) || entity.note.toLowerCase().includes(q)
    ),
    topics: categories.filter((category) => category.name.toLowerCase().includes(q) || category.short.toLowerCase().includes(q)),
  };
}

function ResultGroup({
  title,
  children,
  empty = false,
}: {
  title: string;
  children: ReactNode;
  empty?: boolean;
}) {
  const list = Array.isArray(children) ? children.filter(Boolean) : children;
  return (
    <section>
      <h3 className="mb-1 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{title}</h3>
      {empty ? <p className="px-2 text-xs text-muted-foreground">No matches.</p> : list}
    </section>
  );
}
