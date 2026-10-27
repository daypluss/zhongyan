import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">Missing page</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">That page is not here.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The briefing, your library, and the vocabulary vault are the pages that hold your reading.
      </p>
      <Link href="/" className="mt-6 inline-block text-sm underline-offset-4 hover:underline">
        Back to the briefing
      </Link>
    </div>
  );
}
