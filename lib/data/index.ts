import { lexemeById, lexemes } from "@/lib/data/lexicon";

export { lexemeById, lexemes };

export function getLexeme(id: string) {
  return lexemeById.get(id);
}
