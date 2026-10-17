"use client";

import { SearchDialog } from "@/components/search/search-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { articles } from "@/lib/data";
import { useUser } from "@/lib/store";
import { cn } from "cn";
import {
  BookOpen,
  ChartColumn,
  Compass,
  Keyboard,
  Library,
  Moon,
  Newspaper,
  Search,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { href: "/", label: "Briefing", icon: Newspaper, match: (path: string) => path === "/" },
  {
    href: "/read",
    label: "Read",
    icon: BookOpen,
    match: (path: string) => path.startsWith("/read"),
  },
  {
    href: "/learn",
    label: "Learn",
    icon: Library,
    match: (path: string) => path.startsWith("/learn"),
  },
  {
    href: "/explore",
    label: "Explore",
    icon: Compass,
    match: (path: string) => path.startsWith("/explore"),
  },
  {
    href: "/progress",
    label: "Progress",
    icon: ChartColumn,
    match: (path: string) => path.startsWith("/progress"),
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { state } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const onboarding = path.startsWith("/onboarding");
  const due = Object.values(state.terms).filter((term) => new Date(term.due) <= new Date()).length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (typing) return;
      if (event.key === "?") setHelpOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  if (onboarding) {
    return <div className="min-h-dvh bg-background">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[228px] flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <Link href="/" className="px-5 pt-6 pb-5">
          <div className="font-cn text-[1.65rem] leading-none tracking-tight">中研</div>
          <div className="mt-1 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            Zhongyan
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="mx-3 mb-3 flex h-8 items-center gap-2 rounded-lg border bg-card px-2.5 text-left text-sm text-muted-foreground hover:text-foreground"
        >
          <Search className="size-3.5" />
          Search
          <span className="ml-auto text-[10px] tracking-wide">⌘K</span>
        </button>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            const active = item.match(path);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                  active && "bg-sidebar-accent font-medium text-foreground"
                )}
              >
                <span className={cn("size-1.5 rounded-full", active ? "bg-cinnabar" : "bg-transparent")} />
                <Icon className="size-4" />
                {item.label}
                {item.href === "/learn" && due > 0 && (
                  <span className="ml-auto text-[11px] text-cinnabar tabular-nums">{due}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-2 border-t px-4 py-4 text-[11px] leading-relaxed text-muted-foreground">
          <div>Demo edition · 16 Oct 2026</div>
          <div>{articles.length} original study pieces</div>
          <div className="flex items-center gap-2 pt-1">
            <ThemeButton />
            <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setHelpOpen(true)}>
              <Keyboard className="size-3.5" />
              Shortcuts
            </button>
          </div>
        </div>
      </aside>

      <div className="md:pl-[228px]">
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b bg-background/90 px-4 backdrop-blur md:hidden">
          <Link href="/" className="font-cn text-lg leading-none">
            中研
          </Link>
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="rounded-md p-2 text-muted-foreground">
            <Search className="size-4" />
          </button>
        </header>
        <main className="pb-24 md:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-background/95 backdrop-blur md:hidden">
        {NAV.map((item) => {
          const active = item.match(path);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] tracking-wide text-muted-foreground",
                active && "text-foreground"
              )}
            >
              <Icon className={cn("size-4", active && "text-cinnabar")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shortcuts</DialogTitle>
            <DialogDescription>For the desk, not a game.</DialogDescription>
          </DialogHeader>
          <ul className="grid gap-2 text-sm">
            {[
              ["⌘K", "Search articles, terms, companies"],
              ["j / k", "Move through the briefing"],
              ["Enter", "Open the selected story"],
              ["s", "Save the story, or the open term"],
              ["p / e / l / a", "Pinyin, English, learning mode, audio"],
              ["?", "This list"],
            ].map(([key, label]) => (
              <li key={key} className="flex items-baseline justify-between gap-4 border-b border-dashed py-1.5 last:border-0">
                <span className="font-mono text-xs">{key}</span>
                <span className="text-muted-foreground">{label}</span>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ThemeButton() {
  const { state, setTheme } = useUser();
  const dark = state.theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="Toggle color theme"
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
