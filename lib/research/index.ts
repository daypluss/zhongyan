import { articlesInCategory, getLexeme } from "@/lib/data/index";
import { entities } from "@/lib/data/entities";
import type { CategoryId } from "@/lib/types";

export type ResearchDossier = {
  status: "not_enabled";
  topic: CategoryId;
  note: string;
  linkedArticleIds: string[];
  linkedEntityIds: string[];
  linkedTerms: string[];
};

/**
 * Research mode is intentionally not a product surface yet.
 * Callers can already assemble the linked material this stub returns.
 */
export function researchTopic(topic: CategoryId): ResearchDossier {
  const linked = articlesInCategory(topic);
  const terms = new Set<string>();
  for (const article of linked) {
    for (const id of article.lingo) {
      const lex = getLexeme(id);
      if (lex) terms.add(lex.chinese);
    }
  }
  return {
    status: "not_enabled",
    topic,
    note: "A research dossier — timeline, policy history, funding map — is not built in this edition. Linked articles, firms, and terms are already queryable.",
    linkedArticleIds: linked.map((article) => article.id),
    linkedEntityIds: entities.filter((entity) => entity.topics.includes(topic)).map((entity) => entity.id),
    linkedTerms: [...terms],
  };
}
