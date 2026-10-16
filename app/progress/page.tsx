import { ProgressView } from "@/components/progress/progress-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Progress" };

export default function ProgressPage() {
  return <ProgressView />;
}
