import { ArticleReader } from "@/components/reader/article-reader";
import { articles, getArticle } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((article) => ({ id: article.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticle(id);
  if (!article) return { title: "Story" };
  return { title: article.titleEn };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getArticle(id)) notFound();
  return <ArticleReader id={id} />;
}
