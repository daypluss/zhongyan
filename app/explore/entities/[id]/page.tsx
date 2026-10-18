import { EntityView } from "@/components/explore/entity-view";
import { entities, entityById } from "@/lib/data/entities";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return entities.map((entity) => ({ id: entity.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entity = entityById[id];
  return { title: entity ? entity.nameEn : "Entity" };
}

export default async function EntityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!entityById[id]) notFound();
  return <EntityView id={id} />;
}
