import { categoryById } from "@/lib/data/categories";
import { getLexeme } from "@/lib/data/index";
import { isoDate } from "@/lib/format";
import type { CategoryId, DayActivity, Domain, UserState } from "@/lib/types";

const DOMAIN_LABELS: { id: Domain; label: string }[] = [
  { id: "finance", label: "Finance" },
  { id: "ai", label: "AI" },
  { id: "technology", label: "Technology" },
  { id: "vc", label: "VC / PE" },
  { id: "semiconductors", label: "Semiconductors" },
  { id: "ev", label: "EV & mobility" },
  { id: "consumer", label: "Consumer" },
  { id: "internet", label: "Internet" },
  { id: "robotics", label: "Robotics" },
  { id: "policy", label: "Policy" },
  { id: "outbound", label: "Outbound" },
  { id: "macro", label: "Macro" },
];

export type ReadPiece = { key: string; category: CategoryId };

export function todayActivity(state: UserState): DayActivity {
  const today = isoDate();
  return (
    state.activity.find((day) => day.date === today) ?? {
      date: today,
      seconds: 0,
      articles: [],
      reviews: 0,
    }
  );
}

export function streak(activity: DayActivity[]) {
  const active = new Set(
    activity.filter((day) => day.articles.length > 0 || day.reviews > 0).map((day) => day.date)
  );
  const cursor = new Date();
  if (!active.has(isoDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!active.has(isoDate(cursor))) return 0;
  }
  let count = 0;
  while (active.has(isoDate(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function weekMinutes(activity: DayActivity[]) {
  const days: { date: string; label: string; minutes: number }[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = isoDate(date);
    const found = activity.find((day) => day.date === key);
    days.push({
      date: key,
      label: date.toLocaleDateString("en-GB", { weekday: "narrow" }),
      minutes: Math.round((found?.seconds ?? 0) / 60),
    });
  }
  return days;
}

export function domainProficiency(state: UserState, pieces: ReadPiece[]) {
  return DOMAIN_LABELS.map((domain) => {
    const saved = Object.values(state.terms).filter((term) => getLexeme(term.lexemeId)?.domain === domain.id);
    const mastered = saved.filter((term) => term.status === "mastered").length;
    const reviewing = saved.filter((term) => term.status === "reviewing").length;
    const learning = saved.filter((term) => term.status === "learning" || term.status === "new").length;
    const readArticles = pieces.filter((piece) => {
      const progress = state.read[piece.key];
      return progress?.readingDone && categoryById[piece.category]?.domain === domain.id;
    });
    const quizScores = readArticles
      .map((piece) => state.read[piece.key])
      .filter((progress) => progress?.quizDone && progress.quizTotal);
    const quizAvg = quizScores.length
      ? quizScores.reduce((sum, progress) => sum + (progress.quizScore ?? 0) / (progress.quizTotal || 1), 0) /
        quizScores.length
      : 0;
    const evidence = saved.length + readArticles.length;
    const points = mastered * 12 + reviewing * 6 + learning * 2 + readArticles.length * 8 + quizAvg * 10;
    return {
      ...domain,
      saved: saved.length,
      mastered,
      articles: readArticles.length,
      score: evidence === 0 ? null : Math.min(100, Math.round(points)),
    };
  });
}

export function quizAverage(state: UserState) {
  const done = Object.values(state.read).filter((progress) => progress.quizDone && progress.quizTotal);
  if (!done.length) return null;
  const ratio =
    done.reduce((sum, progress) => sum + (progress.quizScore ?? 0) / (progress.quizTotal || 1), 0) / done.length;
  return Math.round(ratio * 100);
}
