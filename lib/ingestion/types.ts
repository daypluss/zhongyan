/**
 * Future ingestion boundary. The MVP reads the local corpus only.
 * Do not pretend a live feed is attached.
 */
export type RawInboundArticle = {
  sourceId: string;
  title: string;
  body: string;
  url: string;
  publishedAt: string;
};

export interface ArticleIngestionAdapter {
  id: string;
  /** Pull items the product is allowed to store. Not implemented in the MVP. */
  fetchLatest(): Promise<RawInboundArticle[]>;
}

export const localCorpusAdapter: ArticleIngestionAdapter = {
  id: "local-corpus",
  async fetchLatest() {
    return [];
  },
};
