"use client";

import { LiveReader } from "@/components/live/live-reader";
import { LibraryView } from "@/components/read/library-view";
import { useSearchParams } from "next/navigation";

export function ReadGate() {
  const id = useSearchParams().get("id");
  if (id) return <LiveReader />;
  return <LibraryView />;
}
