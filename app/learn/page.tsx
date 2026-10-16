import { LearnView } from "@/components/learn/learn-view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <Suspense fallback={<p className="px-6 py-16 text-sm text-muted-foreground">Opening the vault…</p>}>
      <LearnView />
    </Suspense>
  );
}
