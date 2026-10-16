import { LibraryView } from "@/components/read/library-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Read" };

export default function ReadPage() {
  return <LibraryView />;
}
