export type CategoryId =
  | "ai"
  | "vc"
  | "internet"
  | "semiconductors"
  | "ev"
  | "consumer"
  | "robotics"
  | "policy"
  | "macro"
  | "outbound";

export type Difficulty = "foundational" | "intermediate" | "advanced";

export type Domain =
  | "finance"
  | "technology"
  | "ai"
  | "vc"
  | "consumer"
  | "policy"
  | "semiconductors"
  | "ev"
  | "robotics"
  | "internet"
  | "outbound"
  | "macro";

export type LexemeKind = "function" | "vocabulary" | "business";

export type SourceCategory =
  | "Mainstream Business Media"
  | "Technology Media"
  | "VC/PE"
  | "Investor/Fund"
  | "Data/Research"
  | "Individual Writers"
  | "Corporate Accounts";

export type Lexeme = {
  id: string;
  chinese: string;
  pinyin: string;
  english: string;
  pos: string;
  difficulty: Difficulty;
  category: string;
  domain: Domain;
  kind: LexemeKind;
  businessUsage?: string;
  collocations?: string[];
  related?: string[];
};

export type Segment = {
  text: string;
  pinyin: string;
  punctuation: boolean;
  lexemeId?: string;
  entityId?: string;
};

export type Sentence = {
  id: string;
  segments: Segment[];
  en: string;
  key: boolean;
};

export type Paragraph = {
  id: string;
  sentences: Sentence[];
};

export type QuizKind =
  | "comprehension"
  | "vocabulary"
  | "context"
  | "business"
  | "recognition";

export type QuizQuestion = {
  id: string;
  kind: QuizKind;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  sentence?: string;
  keyPhrase?: string;
};

export type InvestorPoint = {
  label: string;
  text: string;
  kind: "fact" | "inference";
};

export type Article = {
  id: string;
  titleCn: string;
  titleEn: string;
  sourceId: string;
  publishedAt: string;
  category: CategoryId;
  subcategory: string;
  tags: string[];
  difficulty: Difficulty;
  readingMinutes: number;
  summaryEn: string;
  summaryCn: string;
  whyItMatters: string;
  paragraphs: Paragraph[];
  lingo: string[];
  entityIds: string[];
  quiz: QuizQuestion[];
  takeaways: { en: string; cn: string }[];
  investor: {
    facts: string[];
    inferences: string[];
    relevance: InvestorPoint[];
    watch: string[];
  };
  relatedIds: string[];
  newWordIds: string[];
};

export type DraftSentence = {
  en: string;
  parts: string[];
  key?: boolean;
};

export type ArticleDraft = Omit<
  Article,
  "paragraphs" | "quiz" | "newWordIds"
> & {
  paragraphs: DraftSentence[][];
  quiz: Omit<QuizQuestion, "id">[];
};

export type EntityType =
  | "company"
  | "investor"
  | "product"
  | "person"
  | "policy"
  | "agency";

export type Entity = {
  id: string;
  nameCn: string;
  nameEn: string;
  type: EntityType;
  sector: string;
  description: string;
  topics: CategoryId[];
  fictional?: boolean;
};

export type Source = {
  id: string;
  name: string;
  nameEn: string;
  category: SourceCategory;
  description: string;
  url: string;
  credibility: string;
  active: boolean;
  type: "media" | "fund" | "research" | "writer" | "corporate";
};

export type Grade = "again" | "hard" | "good" | "easy";

export type SavedTerm = {
  lexemeId: string;
  articleId: string;
  sentence: string;
  /** Present when the word is not in the bundled business lexicon, so review can still show it. */
  gloss?: {
    chinese: string;
    pinyin: string;
    english: string;
    pos?: string;
    kind?: LexemeKind;
    businessUsage?: string;
  };
  savedAt: string;
  ease: number;
  interval: number;
  due: string;
  reps: number;
  lapses: number;
  status: "new" | "learning" | "reviewing" | "mastered";
};

export type ArticleProgress = {
  lookups: string[];
  saved: string[];
  readingDone: boolean;
  vocabDone: boolean;
  quizDone: boolean;
  quizScore?: number;
  quizTotal?: number;
  seconds: number;
  completedAt?: string;
};

export type DayActivity = {
  date: string;
  seconds: number;
  articles: string[];
  reviews: number;
};

export type LearningPriority =
  | "reading"
  | "listening"
  | "vocabulary"
  | "speaking"
  | "business";

export type UserState = {
  onboarded: boolean;
  dismissedDesk: boolean;
  interests: CategoryId[];
  level: Difficulty;
  priorities: LearningPriority[];
  dailyGoal: { minutes: number; articles: number; reviews: number };
  savedArticles: string[];
  follows: { topics: CategoryId[]; entities: string[] };
  notes: Record<string, string>;
  terms: Record<string, SavedTerm>;
  read: Record<string, ArticleProgress>;
  activity: DayActivity[];
  reader: { pinyin: boolean; english: boolean; learning: boolean; audio: boolean };
  theme: "light" | "dark";
};
