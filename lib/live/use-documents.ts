"use client";

import { listDocuments } from "@/lib/live/db";
import type { StoredDocument } from "@/lib/live/types";
import { useEffect, useState } from "react";

export function useDocuments() {
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    const load = () => {
      void listDocuments()
        .then((all) => {
          if (!cancel) {
            setDocuments(all);
            setReady(true);
          }
        })
        .catch(() => {
          if (!cancel) {
            setDocuments([]);
            setReady(true);
          }
        });
    };
    load();
    window.addEventListener("zhongyan-library", load);
    return () => {
      cancel = true;
      window.removeEventListener("zhongyan-library", load);
    };
  }, []);

  return { documents, ready };
}
