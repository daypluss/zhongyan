"use client";

import { AppShell } from "@/components/shell/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/lib/store";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <UserProvider>
        <AppShell>{children}</AppShell>
      </UserProvider>
    </TooltipProvider>
  );
}
