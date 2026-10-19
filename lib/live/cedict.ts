"use client";

import { BASE_PATH } from "@/lib/base-path";
import { setDictionary } from "@/lib/live/segment";

let loading: Promise<void> | null = null;

export function loadCedict() {
  if (!loading) {
    loading = (async () => {
      const response = await fetch(`${BASE_PATH}/cedict.txt.gz`);
      if (!response.ok || !response.body) throw new Error("cedict_unavailable");
      const stream = response.body.pipeThrough(new DecompressionStream("gzip"));
      const text = await new Response(stream).text();
      const map = new Map<string, { pinyin: string; english: string }>();
      for (const line of text.split("\n")) {
        const [word, pinyin, english] = line.split("\t");
        if (word && pinyin && english) map.set(word, { pinyin, english });
      }
      setDictionary(map);
    })().catch((error) => {
      loading = null;
      throw error;
    });
  }
  return loading;
}
