"use client";

import { readerHref } from "@/lib/live/id";
import { documentBlob, entitiesInLibrary } from "@/lib/live/mentions";
import { useDocuments } from "@/lib/live/use-documents";
import { formatWhen } from "@/lib/format";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function EntityQuery() {
  const name = useSearchParams().get("name")?.trim() ?? "";
  const { documents, ready } = useDocuments();
  const entity = entitiesInLibrary(documents).find((item) => item.name === name);
  const stories = documents.filter((document) => name && documentBlob(document).includes(name));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="text-xs text-muted-foreground hover:text-foreground">
        Explore
      </Link>
      {!name && <h1 className="mt-4 font-serif text-4xl tracking-tight">No name in this link</h1>}
      {name && (
        <>
          <h1 className="mt-4 font-cn text-4xl tracking-tight">{name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{entity?.english || "Named in text stored in this browser."}</p>
          {entity?.note && <p className="mt-3 text-sm leading-relaxed">{entity.note}</p>}
        </>
      )}
      {!ready && <p className="mt-6 text-sm text-muted-foreground">Reading this browser…</p>}
      {ready && name && stories.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed px-4 py-8 text-sm text-muted-foreground">
          This name is not in any article stored here.
        </p>
      )}
      <ul className="mt-6 space-y-3">
        {stories.map((document) => (
          <li key={document.id} className="rounded-xl border bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{document.sourceName || "Pasted"}</p>
            <Link href={readerHref(document.id)} className="mt-1 block font-cn text-lg leading-snug hover:underline">
              {document.title || "Untitled"}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {document.publishedAt ? formatWhen(document.publishedAt) : formatWhen(document.savedAt)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
