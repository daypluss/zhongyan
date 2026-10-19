"use client";

import type { DeskItem, StoredDocument } from "@/lib/live/types";

const DB = "zhongyan-live";
const VERSION = 1;

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("documents")) db.createObjectStore("documents", { keyPath: "id" });
      if (!db.objectStoreNames.contains("feeds")) db.createObjectStore("feeds", { keyPath: "sourceId" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function notify() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("zhongyan-library"));
}

export async function saveDocument(document: StoredDocument) {
  const db = await openDb();
  const tx = db.transaction("documents", "readwrite");
  tx.objectStore("documents").put(document);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notify();
}

/** Refresh a feed card without erasing text already fetched or pasted for this item. */
export async function upsertFeedStub(incoming: StoredDocument) {
  const existing = await readDocument(incoming.id).catch(() => null);
  if (!existing || existing.kind === "import") {
    if (existing?.kind === "import") return;
    await saveDocument(incoming);
    return;
  }
  const keepText = existing.textMode !== "none" && existing.text.length > 0;
  await saveDocument({
    ...existing,
    title: incoming.title || existing.title,
    url: incoming.url || existing.url,
    publishedAt: incoming.publishedAt || existing.publishedAt,
    excerpt: incoming.excerpt || existing.excerpt,
    feedText: incoming.feedText || existing.feedText,
    supplied: incoming.supplied || existing.supplied,
    audioUrl: incoming.audioUrl || existing.audioUrl,
    category: incoming.category,
    sourceId: incoming.sourceId,
    sourceName: incoming.sourceName,
    text: keepText ? existing.text : existing.text,
    textMode: keepText ? existing.textMode : existing.textMode,
    textFrom: keepText ? existing.textFrom : existing.textFrom,
    study: existing.study,
    error: keepText ? existing.error : "",
  });
}

export async function readDocument(id: string) {
  const db = await openDb();
  const tx = db.transaction("documents", "readonly");
  const document = await requestToPromise(tx.objectStore("documents").get(id) as IDBRequest<StoredDocument | undefined>);
  db.close();
  return document ?? null;
}

export async function deleteDocument(id: string) {
  const db = await openDb();
  const tx = db.transaction("documents", "readwrite");
  tx.objectStore("documents").delete(id);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notify();
}

export async function listDocuments() {
  const db = await openDb();
  const tx = db.transaction("documents", "readonly");
  const all = await requestToPromise(tx.objectStore("documents").getAll() as IDBRequest<StoredDocument[]>);
  db.close();
  return all.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export type FeedCache = {
  sourceId: string;
  fetchedAt: string;
  items: DeskItem[];
  error: string;
};

export async function saveFeed(cache: FeedCache) {
  const db = await openDb();
  const tx = db.transaction("feeds", "readwrite");
  tx.objectStore("feeds").put(cache);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function readFeed(sourceId: string) {
  const db = await openDb();
  const tx = db.transaction("feeds", "readonly");
  const cache = await requestToPromise(tx.objectStore("feeds").get(sourceId) as IDBRequest<FeedCache | undefined>);
  db.close();
  return cache ?? null;
}
