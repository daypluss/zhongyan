import type { Article, ArticleDraft, Segment } from "@/lib/types";
import { capitalArticles } from "@/lib/data/articles/capital";
import { marketArticles } from "@/lib/data/articles/market";
import { techArticles } from "@/lib/data/articles/tech";
import { categories } from "@/lib/data/categories";
import { entities, entityByName } from "@/lib/data/entities";
import { lexemeById, lexemes } from "@/lib/data/lexicon";

const PUNCT = /^[，。、：；？！（）—…·、]+$/u;

const drafts: ArticleDraft[] = [
  ...techArticles,
  ...capitalArticles,
  ...marketArticles,
];

function segmentPart(text: string): Segment {
  if (PUNCT.test(text)) {
    return { text, pinyin: "", punctuation: true };
  }
  const lex = lexemeById.get(text);
  if (!lex) {
    throw new Error(`No lexicon entry for 「${text}」`);
  }
  return {
    text,
    pinyin: lex.pinyin,
    punctuation: false,
    lexemeId: lex.id,
    entityId: entityByName.get(text)?.id,
  };
}

export function segmentChineseText(text: string): Segment[] {
  const dict = [...lexemes].sort((a, b) => b.chinese.length - a.chinese.length);
  const out: Segment[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (PUNCT.test(ch) || /\s/.test(ch)) {
      out.push({ text: ch, pinyin: "", punctuation: true });
      i += 1;
      continue;
    }
    const hit = dict.find((lex) => text.startsWith(lex.chinese, i));
    if (!hit) {
      out.push({ text: ch, pinyin: "", punctuation: false });
      i += 1;
      continue;
    }
    out.push(segmentPart(hit.chinese));
    i += hit.chinese.length;
  }
  return out;
}

function hydrate(draft: ArticleDraft): Article {
  const paragraphs = draft.paragraphs.map((sentences, pi) => ({
    id: `${draft.id}-p${pi + 1}`,
    sentences: sentences.map((sentence, si) => ({
      id: `${draft.id}-s${pi + 1}-${si + 1}`,
      en: sentence.en,
      key: Boolean(sentence.key),
      segments: sentence.parts.map(segmentPart),
    })),
  }));
  const seen = new Set<string>();
  for (const paragraph of paragraphs) {
    for (const sentence of paragraph.sentences) {
      for (const segment of sentence.segments) {
        if (!segment.lexemeId) continue;
        const lex = lexemeById.get(segment.lexemeId);
        if (lex && lex.kind !== "function") seen.add(lex.id);
      }
    }
  }
  for (const id of draft.lingo) {
    if (!lexemeById.has(id)) {
      throw new Error(`${draft.id} lingo missing from lexicon: ${id}`);
    }
    if (!seen.has(id)) {
      throw new Error(`${draft.id} lingo not in body: ${id}`);
    }
  }
  return {
    ...draft,
    paragraphs,
    quiz: draft.quiz.map((question, index) => ({
      ...question,
      id: `${draft.id}-q${index + 1}`,
    })),
    newWordIds: [...seen],
  };
}

export const articles: Article[] = drafts.map(hydrate);

export const articleById = new Map(articles.map((article) => [article.id, article]));

export function getArticle(id: string) {
  return articleById.get(id);
}

export function getLexeme(id: string) {
  return lexemeById.get(id);
}

export function sentenceText(segments: Segment[]) {
  return segments.map((segment) => segment.text).join("");
}

export function examplesFor(chinese: string, exceptSentenceId?: string, limit = 3) {
  const found: { articleId: string; sentenceId: string; cn: string; en: string }[] = [];
  for (const article of articles) {
    for (const paragraph of article.paragraphs) {
      for (const sentence of paragraph.sentences) {
        if (sentence.id === exceptSentenceId) continue;
        if (!sentence.segments.some((segment) => segment.text === chinese)) continue;
        found.push({
          articleId: article.id,
          sentenceId: sentence.id,
          cn: sentenceText(sentence.segments),
          en: sentence.en,
        });
        if (found.length >= limit) return found;
      }
    }
  }
  return found;
}

export function relatedArticles(article: Article) {
  return article.relatedIds
    .map((id) => articleById.get(id))
    .filter((item): item is Article => Boolean(item));
}

export function nextArticle(id: string) {
  const index = articles.findIndex((article) => article.id === id);
  if (index < 0) return articles[0];
  return articles[(index + 1) % articles.length];
}

export function articlesInCategory(category: Article["category"]) {
  return articles.filter((article) => article.category === category);
}

export type SearchResults = {
  articles: Article[];
  terms: ReturnType<typeof getLexeme>[];
  entities: { id: string; nameCn: string; nameEn: string; sector: string }[];
  topics: { id: Article["category"]; name: string }[];
};

export function searchCorpus(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { articles: [], terms: [], entities: [], topics: [] };
  return {
    articles: articles.filter((article) => {
      const blob = [
        article.titleCn,
        article.titleEn,
        article.summaryEn,
        article.summaryCn,
        article.whyItMatters,
        article.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    }),
    terms: lexemes.filter((lexeme) => {
      if (lexeme.kind === "function") return false;
      return (
        lexeme.chinese.includes(query.trim()) ||
        lexeme.english.toLowerCase().includes(q) ||
        lexeme.pinyin.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
      );
    }),
    entities: entities.filter(
      (entity) =>
        entity.nameCn.includes(query.trim()) ||
        entity.nameEn.toLowerCase().includes(q) ||
        entity.sector.toLowerCase().includes(q)
    ),
    topics: categories.filter(
      (category) =>
        category.name.toLowerCase().includes(q) || category.short.toLowerCase().includes(q)
    ),
  };
}
