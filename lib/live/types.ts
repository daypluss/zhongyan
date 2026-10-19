import type { CategoryId } from "@/lib/types";

export type LiveKind = "article" | "podcast";

export type FeedSupply = "full" | "excerpt" | "shownotes";

export type FeedItem = {
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  /** Longer plain text from the feed, when the feed included more than a blurb. */
  body: string;
  supplied: FeedSupply;
  audioUrl: string;
  kind: LiveKind;
};

export type DeskItem = FeedItem & {
  id: string;
  sourceId: string;
  sourceName: string;
  category: CategoryId;
};

export type StoredDocument = {
  id: string;
  kind: "live" | "import" | "podcast";
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  /** Plain text the feed itself included, kept even after a page fetch. */
  feedText: string;
  supplied: FeedSupply | "pasted" | "";
  text: string;
  textMode: "full" | "excerpt" | "pasted" | "shownotes" | "none";
  textFrom: "page" | "feed" | "paste" | "notes" | "";
  audioUrl: string;
  category: CategoryId;
  error: string;
  savedAt: string;
  study?: StudyNotes;
};

export type StudyNotes = {
  sentences: { cn: string; en: string }[];
  takeaways: { cn: string; en: string }[];
  whyItMatters: string;
  facts: string[];
  inferences: string[];
  quiz: {
    prompt: string;
    options: string[];
    answer: number;
    explanation: string;
    sentence: string;
    keyPhrase: string;
  }[];
};
