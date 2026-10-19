import { getLexeme } from "@/lib/data";
import type { Lexeme, SavedTerm } from "@/lib/types";

/** Demo lexicon first. Words saved from a live or pasted article carry their own gloss. */
export function resolveSavedLexeme(term: SavedTerm): Lexeme | undefined {
  const known = getLexeme(term.lexemeId);
  if (known) return known;
  const gloss = term.gloss;
  if (!gloss?.chinese || !gloss.english) return undefined;
  return {
    id: term.lexemeId,
    chinese: gloss.chinese,
    pinyin: gloss.pinyin,
    english: gloss.english,
    pos: gloss.pos || "word",
    difficulty: "intermediate",
    category: gloss.kind === "business" ? "business" : "vocabulary",
    domain: "technology",
    kind: gloss.kind === "business" ? "business" : "vocabulary",
    businessUsage: gloss.businessUsage,
  };
}
