import type { StudyNotes } from "@/lib/live/types";

function numbersIn(text: string) {
  return new Set(text.match(/\d+(?:\.\d+)?%?/g) ?? []);
}

function keepsNumbers(sentence: string, source: Set<string>) {
  const found = sentence.match(/\d+(?:\.\d+)?%?/g) ?? [];
  return found.every((value) => source.has(value));
}

export function parseStudyNotes(raw: string, article: string): StudyNotes {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  const parsed = JSON.parse(cleaned) as Partial<StudyNotes>;
  const sourceNumbers = numbersIn(article);
  const sentences = (parsed.sentences ?? []).filter(
    (item) => item && article.includes(item.cn) && keepsNumbers(item.en || "", sourceNumbers)
  );
  const takeaways = (parsed.takeaways ?? []).filter((item) => item?.cn && item.en && keepsNumbers(`${item.cn} ${item.en}`, sourceNumbers));
  const facts = (parsed.facts ?? []).filter((item) => typeof item === "string" && keepsNumbers(item, sourceNumbers));
  const inferences = (parsed.inferences ?? []).filter((item) => typeof item === "string" && keepsNumbers(item, sourceNumbers));
  const quiz = (parsed.quiz ?? []).filter((item) => {
    if (!item?.prompt || !Array.isArray(item.options) || item.options.length < 2) return false;
    if (typeof item.answer !== "number" || item.answer < 0 || item.answer >= item.options.length) return false;
    if (item.sentence && !article.includes(item.sentence)) return false;
    if (item.keyPhrase && !article.includes(item.keyPhrase)) return false;
    return keepsNumbers(`${item.prompt} ${item.explanation ?? ""} ${item.options.join(" ")}`, sourceNumbers);
  });
  const why = typeof parsed.whyItMatters === "string" && keepsNumbers(parsed.whyItMatters, sourceNumbers) ? parsed.whyItMatters : "";
  return { sentences, takeaways, whyItMatters: why, facts, inferences, quiz };
}
