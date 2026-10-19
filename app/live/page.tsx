import { LiveReader } from "@/components/live/live-reader";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Live" };

export default function LivePage() {
  return (
    <Suspense fallback={<p className="px-6 py-16 text-sm text-muted-foreground">Opening…</p>}>
      <LiveReader />
    </Suspense>
  );
}
