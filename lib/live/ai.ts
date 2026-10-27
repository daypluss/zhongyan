import { geminiProbe, geminiStudy } from "@/lib/live/gemini";
import { fetchStudy, probeStudyKey, RelayError, relayErrorCopy } from "@/lib/live/relay";
import type { ConnectionSettings } from "@/lib/live/settings";
import { StudyError } from "@/lib/live/study-error";
import type { StudyNotes } from "@/lib/live/types";

function numbersIn(text: string) {
  return new Set(text.match(/\d+(?:\.\d+)?%?/g) ?? []);
}

function keepsNumbers(sentence: string, source: Set<string>) {
  const found = sentence.match(/\d+(?:\.\d+)?%?/g) ?? [];
  return found.every((value) => source.has(value));
}

function extractJson(raw: string): Partial<StudyNotes> {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as Partial<StudyNotes>;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1)) as Partial<StudyNotes>;
    throw new StudyError("bad_study_json", "The model reply was not usable JSON.");
  }
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return Number.NaN;
}

export function parseStudyNotes(raw: string, article: string): StudyNotes {
  const parsed = extractJson(raw);
  const sourceNumbers = numbersIn(article);
  const sentences = (Array.isArray(parsed.sentences) ? parsed.sentences : []).filter(
    (item) => item && typeof item.cn === "string" && article.includes(item.cn) && keepsNumbers(item.en || "", sourceNumbers)
  );
  const takeaways = (Array.isArray(parsed.takeaways) ? parsed.takeaways : []).filter(
    (item) => item?.cn && item.en && keepsNumbers(`${item.cn} ${item.en}`, sourceNumbers)
  );
  const facts = (Array.isArray(parsed.facts) ? parsed.facts : []).filter((item) => typeof item === "string" && keepsNumbers(item, sourceNumbers));
  const inferences = (Array.isArray(parsed.inferences) ? parsed.inferences : []).filter(
    (item) => typeof item === "string" && keepsNumbers(item, sourceNumbers)
  );
  const quiz = (Array.isArray(parsed.quiz) ? parsed.quiz : []).flatMap((item) => {
    if (!item?.prompt || !Array.isArray(item.options) || item.options.length < 2) return [];
    const answer = asNumber(item.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= item.options.length) return [];
    if (item.sentence && !article.includes(item.sentence)) return [];
    if (item.keyPhrase && !article.includes(item.keyPhrase)) return [];
    if (!keepsNumbers(`${item.prompt} ${item.explanation ?? ""} ${item.options.join(" ")}`, sourceNumbers)) return [];
    return [{ ...item, answer }];
  });
  const why = typeof parsed.whyItMatters === "string" && keepsNumbers(parsed.whyItMatters, sourceNumbers) ? parsed.whyItMatters : "";
  return { sentences, takeaways, whyItMatters: why, facts, inferences, quiz };
}

export async function requestStudy(settings: ConnectionSettings, title: string, text: string) {
  const content = settings.aiProvider === "gemini" ? await geminiStudy(settings, title, text) : (await fetchStudy(settings, title, text)).content ?? "";
  if (!content.trim()) throw new StudyError("empty_study", "The model returned an empty reply.");
  return parseStudyNotes(content, text);
}

export async function testAiKey(settings: ConnectionSettings) {
  if (!settings.aiKey.trim()) throw new StudyError("missing_ai_key", "Add an API key first.");
  if (settings.aiProvider === "gemini") {
    await geminiProbe(settings);
    return;
  }
  try {
    const body = await probeStudyKey(settings);
    if (!body.content?.trim()) throw new StudyError("empty_study", "The provider returned an empty reply.");
  } catch (error) {
    if (error instanceof RelayError && error.code === "article_too_short") {
      throw new StudyError(
        "relay_probe_missing",
        "This relay does not have the key check yet. Redeploy it from the relay folder. Gemini is checked in this browser and does not need the relay."
      );
    }
    if (error instanceof RelayError) throw new StudyError(error.code, relayErrorCopy(error.code));
    throw error;
  }
}

export function studyErrorCopy(error: unknown) {
  if (error instanceof StudyError) return error.message;
  if (error instanceof RelayError) return relayErrorCopy(error.code);
  return "The study request failed.";
}
