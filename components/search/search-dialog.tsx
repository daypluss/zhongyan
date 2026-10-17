"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchCorpus } from "@/lib/data";
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
  const results = useMemo(() => searchCorpus(query), [query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Search the desk</DialogTitle>
          <DialogDescription>Articles, business terms, companies, and topics in this edition.</DialogDescription>
        </DialogHeader>
        <Input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="商业化, gross margin, CATL…"
        />
        <div className="max-h-[50vh] space-y-4 overflow-y-auto pr-1 text-sm">
          <ResultGroup title="Articles" empty={query.length > 0 && results.articles.length === 0}>
            {results.articles.slice(0, 6).map((article) => (
              <Link key={article.id} href={`/read/${article.id}`} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                <div className="font-cn">{article.titleCn}</div>
                <div className="text-xs text-muted-foreground">{article.titleEn}</div>
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Terms">
            {results.terms.slice(0, 8).map((term) =>
              term ? (
                <Link key={term.id} href={`/learn?q=${encodeURIComponent(term.chinese)}`} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                  <span className="font-cn">{term.chinese}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{term.pinyin}</span>
                  <div className="text-xs text-muted-foreground">{term.english}</div>
                </Link>
              ) : null
            )}
          </ResultGroup>
          <ResultGroup title="Companies and institutions">
            {results.entities.slice(0, 6).map((entity) => (
              <Link key={entity.id} href={`/explore/entities/${entity.id}`} onClick={() => onOpenChange(false)} className="block rounded-md px-2 py-1.5 hover:bg-muted">
                <span className="font-cn">{entity.nameCn}</span>
                <span className="ml-2 text-xs text-muted-foreground">{entity.nameEn}</span>
              </Link>
            ))}
          </ResultGroup>
          <ResultGroup title="Topics">
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
