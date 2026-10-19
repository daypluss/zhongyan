import { ImportView } from "@/components/import/import-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Import" };

export default function ImportPage() {
  return <ImportView />;
}
