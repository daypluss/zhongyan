"use client";

import { deleteDocument, listDocuments } from "@/lib/live/db";
import type { StoredDocument } from "@/lib/live/types";
import { formatWhen } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";

function visible(document: StoredDocument) {
  if (document.kind === "import") return true;
  return document.textMode !== "none" && document.text.trim().length > 0;
}

export function PersonalLibrary() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      void listDocuments()
        .then((all) => {
          if (!cancel) setDocuments(all.filter(visible));
        })
        .catch(() => {
          if (!cancel) setDocuments([]);
        });
    };
    load();
    window.addEventListener("zhongyan-library", load);
    return () => {
      cancel = true;
      window.removeEventListener("zhongyan-library", load);
    };
  }, []);

  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl tracking-tight">Saved / Imported</h2>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Pasted articles, and live items you have opened. They stay in this browser only.
      </p>
      {documents.length === 0 && (
        <p className="mt-4 rounded-xl border border-dashed px-4 py-6 text-sm text-muted-foreground">
          Nothing saved here yet. Paste a story on Import, or open a live item.
        </p>
      )}
      <ul className="mt-4 space-y-3">
        {documents.map((document) => (
          <li key={document.id} className="rounded-xl border bg-card px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              <span>{document.kind === "import" ? "Imported" : document.kind === "podcast" ? "Podcast" : "Live"}</span>
              <span className="tracking-normal normal-case">{document.sourceName}</span>
            </div>
            <h3 className="mt-1 font-cn text-lg leading-snug">{document.title || "Untitled"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.publishedAt ? formatWhen(document.publishedAt) : formatWhen(document.savedAt)}
              {document.textMode === "excerpt" ? " · Excerpt" : ""}
              {document.textMode === "shownotes" ? " · Show notes" : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-sm">
              <Link href={`/live/?id=${encodeURIComponent(document.id)}`} className="underline-offset-4 hover:underline">
                Open
              </Link>
              {document.url && (
                <a href={document.url} target="_blank" rel="noreferrer" className="text-muted-foreground underline-offset-4 hover:underline">
                  Open original
                </a>
              )}
              <button
                type="button"
                className="text-muted-foreground underline-offset-4 hover:underline"
                onClick={() => void deleteDocument(document.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
