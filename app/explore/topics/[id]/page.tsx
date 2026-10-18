import { TopicView } from "@/components/explore/topic-view";
import { categories, categoryById } from "@/lib/data/categories";
import type { CategoryId } from "@/lib/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({ id: category.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = categoryById[id as CategoryId];
  return { title: category ? category.name : "Topic" };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!categoryById[id as CategoryId]) notFound();
  return <TopicView id={id as CategoryId} />;
}
