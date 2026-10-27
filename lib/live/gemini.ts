import { StudyError } from "@/lib/live/study-error";
import { DEFAULT_MODELS, type ConnectionSettings } from "@/lib/live/settings";

const MODEL_ID = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

const STUDY_INSTRUCTION =
  "You tutor one Chinese article for a personal reader. Use only the supplied text. Do not add companies, figures, dates, or causes that the text does not state. Put anything you infer only in inferences, and start each of those strings with 'Inference:'. Every sentences.cn, quiz.sentence, and quiz.keyPhrase must be copied verbatim from the article. Return JSON with keys sentences (array of {cn, en}), takeaways (array of {cn, en}), whyItMatters (string), facts (string array), inferences (string array), entities (array of {name, note}), quiz (array of {prompt, options, answer, explanation, sentence, keyPhrase}). options has exactly 4 strings. answer is the index of the correct option. sentences are the lines worth translating. takeaways are the business points. whyItMatters explains the desk relevance without new facts. facts are claims the text reports. inferences are labeled guesses. entities.name is a company, product, person, or institution copied verbatim from the title or article. entities.note is a short English gloss using only that text. Omit any name that is not in the text.";

const STUDY_SCHEMA = {
  type: "object",
  properties: {
    sentences: {
      type: "array",
      items: {
        type: "object",
        properties: { cn: { type: "string" }, en: { type: "string" } },
        required: ["cn", "en"],
      },
    },
    takeaways: {
      type: "array",
      items: {
        type: "object",
        properties: { cn: { type: "string" }, en: { type: "string" } },
        required: ["cn", "en"],
      },
    },
    whyItMatters: { type: "string" },
    facts: { type: "array", items: { type: "string" } },
    inferences: { type: "array", items: { type: "string" } },
    entities: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, note: { type: "string" } },
        required: ["name"],
      },
    },
    quiz: {
      type: "array",
      items: {
        type: "object",
        properties: {
          prompt: { type: "string" },
          options: { type: "array", items: { type: "string" } },
          answer: { type: "integer" },
          explanation: { type: "string" },
          sentence: { type: "string" },
          keyPhrase: { type: "string" },
        },
        required: ["prompt", "options", "answer", "explanation", "sentence", "keyPhrase"],
      },
    },
  },
  required: ["sentences", "takeaways", "whyItMatters", "facts", "inferences", "entities", "quiz"],
};

type GeminiPart = { text?: string; thought?: boolean };
type GeminiBody = {
  candidates?: { content?: { parts?: GeminiPart[] } }[];
  error?: { message?: string };
};

function modelId(settings: ConnectionSettings) {
  const raw = settings.aiModel.trim() || DEFAULT_MODELS.gemini;
  if (!MODEL_ID.test(raw)) {
    throw new StudyError("bad_model", "The model name is not a plain id such as gemini-3.8-flash.");
  }
  return raw;
}

function redact(message: string, key: string) {
  const cleaned = key ? message.split(key).join("…") : message;
  return cleaned.replace(/\s+/g, " ").trim().slice(0, 240);
}

function visibleText(body: GeminiBody) {
  const parts = body.candidates?.[0]?.content?.parts ?? [];
  return parts
    .filter((part) => part.text && !part.thought)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

function generationConfig(model: string, json: boolean) {
  const thinking = model.startsWith("gemini-2.") ? { thinkingBudget: 0 } : { thinkingLevel: "low" };
  if (!json) return { maxOutputTokens: 32, thinkingConfig: thinking };
  if (model.startsWith("gemini-2.")) {
    return {
      temperature: 0.2,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: STUDY_SCHEMA,
      thinkingConfig: thinking,
    };
  }
  return {
    maxOutputTokens: 8192,
    responseFormat: { text: { mimeType: "APPLICATION_JSON", schema: STUDY_SCHEMA } },
    thinkingConfig: thinking,
  };
}

async function generate(settings: ConnectionSettings, prompt: string, json: boolean, system?: string) {
  const key = settings.aiKey.trim();
  if (!key) throw new StudyError("missing_ai_key", "Add an API key first.");
  if (key.length > 400) throw new StudyError("missing_ai_key", "That API key is too long to send.");
  const model = modelId(settings);
  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: generationConfig(model, json),
      }),
    });
  } catch {
    throw new StudyError("gemini_unreachable", "The browser could not reach Gemini.");
  }
  let body: GeminiBody;
  try {
    body = (await response.json()) as GeminiBody;
  } catch {
    throw new StudyError("bad_response", `Gemini returned an unreadable response (${response.status}).`);
  }
  if (!response.ok) {
    throw new StudyError(`gemini_${response.status}`, redact(body.error?.message || `Gemini returned ${response.status}.`, key));
  }
  const text = visibleText(body);
  if (!text) throw new StudyError("gemini_blocked", "Gemini returned no text.");
  return text;
}

export function geminiStudy(settings: ConnectionSettings, title: string, text: string) {
  const article = text.slice(0, 12_000);
  if (article.trim().length < 40) throw new StudyError("article_too_short", "There is not enough text to send.");
  return generate(
    settings,
    `Title: ${title.slice(0, 200)}\n\n${article}`,
    true,
    STUDY_INSTRUCTION
  );
}

export async function geminiProbe(settings: ConnectionSettings) {
  const text = await generate(settings, "Reply with the single word ok.", false);
  if (!text) throw new StudyError("gemini_blocked", "Gemini returned no text.");
}
