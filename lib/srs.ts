import type { Grade, Lexeme, SavedTerm } from "@/lib/types";

export function reviewTerm(term: SavedTerm, grade: Grade, now = new Date()): SavedTerm {
  const ease = term.ease;
  let nextEase = ease;
  let interval = term.interval;
  let reps = term.reps;
  let lapses = term.lapses;
  let status = term.status;

  if (grade === "again") {
    reps = 0;
    lapses += 1;
    interval = 0;
    nextEase = Math.max(1.3, ease - 0.2);
    status = "learning";
  } else if (grade === "hard") {
    interval = Math.max(1, interval === 0 ? 1 : interval * 1.2);
    nextEase = Math.max(1.3, ease - 0.15);
    reps += 1;
    status = "reviewing";
  } else if (grade === "good") {
    interval = reps === 0 ? 1 : reps === 1 ? 3 : interval * ease;
    reps += 1;
    nextEase = ease;
    status = reps >= 4 && interval >= 21 ? "mastered" : reps === 0 ? "learning" : "reviewing";
  } else {
    interval = reps === 0 ? 4 : interval * ease * 1.3;
    reps += 1;
    nextEase = ease + 0.1;
    status = interval >= 21 ? "mastered" : "reviewing";
  }

  const due = new Date(now);
  if (grade === "again") due.setMinutes(due.getMinutes() + 10);
  else due.setDate(due.getDate() + Math.max(1, Math.round(interval)));

  return {
    ...term,
    ease: Math.round(nextEase * 100) / 100,
    interval: Math.round(interval * 10) / 10,
    reps,
    lapses,
    status,
    due: due.toISOString(),
  };
}

export function isDue(term: SavedTerm, now = new Date()) {
  return new Date(term.due).getTime() <= now.getTime();
}

export type ReviewFormat =
  | "cn-en"
  | "en-cn"
  | "py-cn"
  | "audio"
  | "cloze"
  | "usage";

export function formatFor(term: SavedTerm): ReviewFormat {
  const formats: ReviewFormat[] = ["cn-en", "en-cn", "py-cn", "audio", "cloze", "usage"];
  return formats[term.reps % formats.length];
}

export function distractors(target: Lexeme, pool: Lexeme[], count = 3) {
  const same = pool.filter(
    (item) => item.id !== target.id && item.kind !== "function" && item.domain === target.domain
  );
  const rest = pool.filter(
    (item) => item.id !== target.id && item.kind !== "function" && item.domain !== target.domain
  );
  const picked: Lexeme[] = [];
  for (const source of [same, rest]) {
    for (const item of source) {
      if (picked.length >= count) break;
      if (!picked.some((chosen) => chosen.id === item.id)) picked.push(item);
    }
  }
  return picked.slice(0, count);
}

export function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
