import type { DraftSentence, QuizKind, QuizQuestion } from "@/lib/types";

export function s(en: string, spaced: string, key = false): DraftSentence {
  return {
    en,
    parts: spaced.trim().split(/\s+/).filter(Boolean),
    key,
  };
}

export function q(
  kind: QuizKind,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  sentence?: string,
  keyPhrase?: string
): Omit<QuizQuestion, "id"> {
  return { kind, prompt, options, answer, explanation, sentence, keyPhrase };
}
