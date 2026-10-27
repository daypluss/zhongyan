"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories } from "@/lib/data/categories";
import { DEFAULT_SECTORS } from "@/lib/sectors";
import { useUser } from "@/lib/store";
import type { CategoryId } from "@/lib/types";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SectorPicker({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state, setSectors } = useUser();
  const router = useRouter();
  const [draft, setDraft] = useState<CategoryId[]>(state.interests);

  useEffect(() => {
    if (open) setDraft(state.interests);
  }, [open, state.interests]);

  function toggle(id: CategoryId) {
    setDraft((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sectors</DialogTitle>
          <DialogDescription>
            These sectors lead the briefing and filter the live list. None selected shows every sector. Saved in this browser.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const on = draft.includes(category.id);
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => toggle(category.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm",
                  on ? "bg-foreground text-background" : "text-muted-foreground"
                )}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => {
              setSectors(draft);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDraft(DEFAULT_SECTORS);
              setSectors(DEFAULT_SECTORS);
            }}
          >
            Reset to defaults
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              router.push("/onboarding");
            }}
          >
            Redo onboarding
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
