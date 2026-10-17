import { getArticle, getLexeme, segmentChineseText } from "@/lib/data/index";
import { lexemes } from "@/lib/data/lexicon";

/**
 * Mock AI boundary. Each function returns structured editorial data already
 * checked into the corpus. A later model can replace the body of a function
 * without changing callers. These functions do not invent article facts.
 */
export const ai = {
  generateArticleSummary(articleId: string) {
    const article = getArticle(articleId);
    if (!article) return null;
    return { en: article.summaryEn, cn: article.summaryCn };
  },
  extractVocabulary(articleId: string) {
    const article = getArticle(articleId);
    if (!article) return [];
    return article.newWordIds
      .map((id) => getLexeme(id))
      .filter((lexeme) => lexeme && lexeme.kind === "vocabulary");
  },
  extractBusinessTerms(articleId: string) {
    const article = getArticle(articleId);
    if (!article) return [];
    return article.lingo.map((id) => getLexeme(id)).filter(Boolean);
  },
  segmentChineseText,
  generatePinyin(text: string) {
    return segmentChineseText(text)
      .filter((segment) => !segment.punctuation)
      .map((segment) => segment.pinyin)
      .filter(Boolean)
      .join(" ");
  },
  generateQuiz(articleId: string) {
    return getArticle(articleId)?.quiz ?? [];
  },
  generateTakeaways(articleId: string) {
    return getArticle(articleId)?.takeaways ?? [];
  },
  generateInvestmentRelevance(articleId: string) {
    return getArticle(articleId)?.investor ?? null;
  },
  generateExamples(chinese: string) {
    const lex = lexemes.find((item) => item.chinese === chinese);
    return lex?.collocations ?? [];
  },
  explainBusinessTerm(chinese: string) {
    const lex = lexemes.find((item) => item.chinese === chinese);
    if (!lex) return null;
    return {
      chinese: lex.chinese,
      pinyin: lex.pinyin,
      english: lex.english,
      usage: lex.businessUsage ?? lex.english,
      collocations: lex.collocations ?? [],
      kind: lex.kind === "business" ? ("business" as const) : ("vocabulary" as const),
    };
  },
};
