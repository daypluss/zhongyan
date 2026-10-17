import { ReviewSession } from "@/components/learn/review-session";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Daily review" };

export default function ReviewPage() {
  return <ReviewSession />;
}
