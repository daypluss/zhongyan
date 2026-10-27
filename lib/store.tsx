"use client";

import { isoDate } from "@/lib/format";
import { reviewTerm } from "@/lib/srs";
import type {
  ArticleProgress,
  CategoryId,
  DayActivity,
  Difficulty,
  Grade,
  LearningPriority,
  SavedTerm,
  UserState,
} from "@/lib/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const KEY = "zhongyan.v1";

export const defaultState: UserState = {
  onboarded: false,
  dismissedDesk: false,
  interests: [],
  level: "intermediate",
  priorities: ["reading", "vocabulary", "business"],
  dailyGoal: { minutes: 15, articles: 1, reviews: 10 },
  savedArticles: [],
  follows: { topics: [], entities: [] },
  notes: {},
  terms: {},
  read: {},
  activity: [],
  reader: { pinyin: false, english: false, learning: false, audio: false },
  theme: "light",
};

function emptyProgress(): ArticleProgress {
  return {
    lookups: [],
    saved: [],
    readingDone: false,
    vocabDone: false,
    quizDone: false,
    seconds: 0,
    quizScore: undefined,
    quizTotal: undefined,
  };
}

function withActivity(state: UserState, patch: Partial<DayActivity>): UserState {
  const today = isoDate();
  const current = state.activity.find((day) => day.date === today) ?? {
    date: today,
    seconds: 0,
    articles: [],
    reviews: 0,
  };
  const next: DayActivity = {
    ...current,
    seconds: current.seconds + (patch.seconds ?? 0),
    reviews: current.reviews + (patch.reviews ?? 0),
    articles: patch.articles
      ? [...new Set([...current.articles, ...patch.articles])]
      : current.articles,
  };
  return {
    ...state,
    activity: [...state.activity.filter((day) => day.date !== today), next],
  };
}

type Store = {
  ready: boolean;
  state: UserState;
  saveTerm: (lexemeId: string, articleId: string, sentence: string, gloss?: SavedTerm["gloss"]) => void;
  gradeTerm: (lexemeId: string, grade: Grade) => void;
  lookup: (articleId: string, lexemeId: string) => void;
  toggleArticle: (articleId: string) => void;
  markReading: (articleId: string) => void;
  markQuiz: (articleId: string, score: number, total: number) => void;
  addSeconds: (articleId: string, seconds: number) => void;
  toggleTopic: (id: CategoryId) => void;
  toggleEntity: (id: string) => void;
  setNote: (id: string, note: string) => void;
  setReader: (patch: Partial<UserState["reader"]>) => void;
  setTheme: (theme: UserState["theme"]) => void;
  setInterests: (ids: CategoryId[]) => void;
  setSectors: (ids: CategoryId[]) => void;
  completeOnboarding: (input: {
    interests: CategoryId[];
    level: Difficulty;
    priorities: LearningPriority[];
    dailyGoal: UserState["dailyGoal"];
  }) => void;
  dismissDesk: () => void;
  resetDesk: () => void;
};

const Ctx = createContext<Store | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserState;
        setState({ ...defaultState, ...parsed, reader: { ...defaultState.reader, ...parsed.reader } });
      }
    } catch {
      /* keep defaults */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [ready, state]);

  const saveTerm = useCallback((lexemeId: string, articleId: string, sentence: string, gloss?: SavedTerm["gloss"]) => {
    setState((current) => {
      const progress = { ...emptyProgress(), ...current.read[articleId] };
      const saved = [...new Set([...progress.saved, lexemeId])];
      const nextRead = {
        ...current.read,
        [articleId]: { ...progress, saved, vocabDone: saved.length > 0 },
      };
      if (current.terms[lexemeId]) {
        return { ...current, read: nextRead };
      }
      const now = new Date().toISOString();
      return {
        ...current,
        read: nextRead,
        terms: {
          ...current.terms,
          [lexemeId]: {
            lexemeId,
            articleId,
            sentence,
            gloss,
            savedAt: now,
            ease: 2.5,
            interval: 0,
            due: now,
            reps: 0,
            lapses: 0,
            status: "new",
          },
        },
      };
    });
  }, []);

  const gradeTerm = useCallback((lexemeId: string, grade: Grade) => {
    setState((current) => {
      const term = current.terms[lexemeId];
      if (!term) return current;
      const reviewed = reviewTerm(term, grade);
      return withActivity(
        { ...current, terms: { ...current.terms, [lexemeId]: reviewed } },
        { reviews: 1 }
      );
    });
  }, []);

  const lookup = useCallback((articleId: string, lexemeId: string) => {
    setState((current) => {
      const progress = { ...emptyProgress(), ...current.read[articleId] };
      if (progress.lookups.includes(lexemeId)) return current;
      return {
        ...current,
        read: {
          ...current.read,
          [articleId]: { ...progress, lookups: [...progress.lookups, lexemeId] },
        },
      };
    });
  }, []);

  const toggleArticle = useCallback((articleId: string) => {
    setState((current) => ({
      ...current,
      savedArticles: current.savedArticles.includes(articleId)
        ? current.savedArticles.filter((id) => id !== articleId)
        : [...current.savedArticles, articleId],
    }));
  }, []);

  const markReading = useCallback((articleId: string) => {
    setState((current) => {
      const progress = { ...emptyProgress(), ...current.read[articleId] };
      if (progress.readingDone) return current;
      return withActivity(
        {
          ...current,
          read: {
            ...current.read,
            [articleId]: { ...progress, readingDone: true, completedAt: new Date().toISOString() },
          },
        },
        { articles: [articleId] }
      );
    });
  }, []);

  const markQuiz = useCallback((articleId: string, score: number, total: number) => {
    setState((current) => {
      const progress = { ...emptyProgress(), ...current.read[articleId] };
      return {
        ...current,
        read: {
          ...current.read,
          [articleId]: { ...progress, quizDone: true, quizScore: score, quizTotal: total },
        },
      };
    });
  }, []);

  const addSeconds = useCallback((articleId: string, seconds: number) => {
    setState((current) => {
      const progress = { ...emptyProgress(), ...current.read[articleId] };
      return withActivity(
        {
          ...current,
          read: {
            ...current.read,
            [articleId]: { ...progress, seconds: progress.seconds + seconds },
          },
        },
        { seconds }
      );
    });
  }, []);

  const toggleTopic = useCallback((id: CategoryId) => {
    setState((current) => {
      const has = current.follows.topics.includes(id);
      return {
        ...current,
        follows: {
          ...current.follows,
          topics: has
            ? current.follows.topics.filter((topic) => topic !== id)
            : [...current.follows.topics, id],
        },
      };
    });
  }, []);

  const toggleEntity = useCallback((id: string) => {
    setState((current) => {
      const has = current.follows.entities.includes(id);
      return {
        ...current,
        follows: {
          ...current.follows,
          entities: has
            ? current.follows.entities.filter((entity) => entity !== id)
            : [...current.follows.entities, id],
        },
      };
    });
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    setState((current) => ({ ...current, notes: { ...current.notes, [id]: note } }));
  }, []);

  const setReader = useCallback((patch: Partial<UserState["reader"]>) => {
    setState((current) => ({ ...current, reader: { ...current.reader, ...patch } }));
  }, []);

  const setTheme = useCallback((theme: UserState["theme"]) => {
    setState((current) => ({ ...current, theme }));
  }, []);

  const setInterests = useCallback((ids: CategoryId[]) => {
    setState((current) => ({ ...current, interests: ids }));
  }, []);

  const setSectors = useCallback((ids: CategoryId[]) => {
    setState((current) => ({
      ...current,
      interests: ids,
      follows: { ...current.follows, topics: ids },
    }));
  }, []);

  const completeOnboarding = useCallback(
    (input: {
      interests: CategoryId[];
      level: Difficulty;
      priorities: LearningPriority[];
      dailyGoal: UserState["dailyGoal"];
    }) => {
      setState((current) => ({
        ...current,
        ...input,
        onboarded: true,
        follows: { ...current.follows, topics: input.interests },
      }));
    },
    []
  );

  const dismissDesk = useCallback(() => {
    setState((current) => ({ ...current, dismissedDesk: true }));
  }, []);

  const resetDesk = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready,
      state,
      saveTerm,
      gradeTerm,
      lookup,
      toggleArticle,
      markReading,
      markQuiz,
      addSeconds,
      toggleTopic,
      toggleEntity,
      setNote,
      setReader,
      setTheme,
      setInterests,
      setSectors,
      completeOnboarding,
      dismissDesk,
      resetDesk,
    }),
    [
      ready,
      state,
      saveTerm,
      gradeTerm,
      lookup,
      toggleArticle,
      markReading,
      markQuiz,
      addSeconds,
      toggleTopic,
      toggleEntity,
      setNote,
      setReader,
      setTheme,
      setInterests,
      setSectors,
      completeOnboarding,
      dismissDesk,
      resetDesk,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useUser must be used inside UserProvider");
  return value;
}
