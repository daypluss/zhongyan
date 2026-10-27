import { EntityQuery } from "@/components/explore/entity-query";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Company" };

export default function EntityPage() {
  return (
    <Suspense fallback={<p className="px-6 py-16 text-sm text-muted-foreground">Opening…</p>}>
      <EntityQuery />
    </Suspense>
  );
}
