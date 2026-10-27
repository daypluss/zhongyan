import type { StoredDocument } from "@/lib/live/types";

export function stableId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function progressKey(document: Pick<StoredDocument, "id" | "kind">) {
  return document.kind === "import" ? `import:${document.id}` : `live:${document.id}`;
}

export function readerHref(id: string) {
  return `/read/?id=${encodeURIComponent(id)}`;
}
