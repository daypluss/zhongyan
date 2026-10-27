import { lexemes } from "@/lib/data/lexicon";
import type { StoredDocument } from "@/lib/live/types";

export type DeskEntity = {
  name: string;
  english: string;
  note: string;
  count: number;
  articleIds: string[];
};

const lexiconEntities = lexemes.filter((lexeme) => lexeme.category === "entity" && lexeme.chinese.length >= 2);

export function documentBlob(document: StoredDocument) {
  return `${document.title}\n${document.excerpt}\n${document.feedText}\n${document.text}`;
}

export function entitiesInLibrary(documents: StoredDocument[]): DeskEntity[] {
  const map = new Map<string, DeskEntity>();

  function add(name: string, english: string, note: string, id: string) {
    const current = map.get(name) ?? { name, english, note, count: 0, articleIds: [] };
    if (!current.english && english) current.english = english;
    if (!current.note && note) current.note = note;
    if (!current.articleIds.includes(id)) {
      current.articleIds.push(id);
      current.count += 1;
    }
    map.set(name, current);
  }

  for (const document of documents) {
    const blob = documentBlob(document);
    if (!blob.trim()) continue;
    for (const lexeme of lexiconEntities) {
      if (blob.includes(lexeme.chinese)) add(lexeme.chinese, lexeme.english, "", document.id);
    }
    for (const entity of document.study?.entities ?? []) {
      const name = entity.name?.trim();
      if (!name || name.length < 2 || !blob.includes(name)) continue;
      add(name, "", entity.note ?? "", document.id);
    }
  }

  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh"));
}
