"use client";

import { useReducer, useEffect, useCallback } from "react";
import {
  Note,
  KeySig,
  WeightedNote,
  buildFullPool,
  buildPoolForKey,
  weightedRandom,
  updateWeights,
  randomKeySig,
  notesMatch,
} from "@/app/piano/lib/music";

export type GamePhase = "settings" | "playing" | "feedback" | "summary";

export interface GameSettings {
  mode: "chromatic" | "random-key";
  keyChangeFrequency: "session" | "note";
  timerEnabled: boolean;
  timerSeconds: number;
  notesPerSession: number;
}

interface SessionState {
  notesRemaining: number;
  score: number;
  streak: number;
  maxStreak: number;
  currentNote: Note | null;
  currentKey: KeySig | null;
  lastWasCorrect: boolean | null;
  correctNote: Note | null;
  history: { note: Note; wasCorrect: boolean }[];
}

export interface GameState {
  phase: GamePhase;
  settings: GameSettings;
  session: SessionState;
  weightedPool: WeightedNote[];
  enharmonicPending: [Note, Note] | null;
}

type Action =
  | { type: "START_SESSION" }
  | { type: "SUBMIT_ANSWER"; payload: Note }
  | { type: "OPEN_ENHARMONIC"; payload: [Note, Note] }
  | { type: "CLOSE_ENHARMONIC" }
  | { type: "NEXT_NOTE" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<GameSettings> }
  | { type: "RESTART" }
  | { type: "TIMER_EXPIRED" };

const DEFAULT_SETTINGS: GameSettings = {
  mode: "chromatic",
  keyChangeFrequency: "session",
  timerEnabled: false,
  timerSeconds: 5,
  notesPerSession: 10,
};

function makeInitialSession(settings: GameSettings, pool: WeightedNote[]): SessionState {
  const key = settings.mode === "random-key" ? randomKeySig() : null;
  const effectivePool = key ? buildPoolForKey(key) : pool;
  const firstNote = weightedRandom(effectivePool);
  return {
    notesRemaining: settings.notesPerSession - 1,
    score: 0,
    streak: 0,
    maxStreak: 0,
    currentNote: firstNote,
    currentKey: key,
    lastWasCorrect: null,
    correctNote: null,
    history: [],
  };
}

function getInitialState(): GameState {
  return {
    phase: "settings",
    settings: DEFAULT_SETTINGS,
    session: {
      notesRemaining: DEFAULT_SETTINGS.notesPerSession,
      score: 0,
      streak: 0,
      maxStreak: 0,
      currentNote: null,
      currentKey: null,
      lastWasCorrect: null,
      correctNote: null,
      history: [],
    },
    weightedPool: buildFullPool(),
    enharmonicPending: null,
  };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case "START_SESSION": {
      const pool = buildFullPool();
      const session = makeInitialSession(state.settings, pool);
      return {
        ...state,
        phase: "playing",
        session,
        weightedPool: pool,
        enharmonicPending: null,
      };
    }

    case "OPEN_ENHARMONIC":
      return { ...state, enharmonicPending: action.payload };

    case "CLOSE_ENHARMONIC":
      return { ...state, enharmonicPending: null };

    case "SUBMIT_ANSWER": {
      const { currentNote } = state.session;
      if (!currentNote) return state;

      const wasCorrect = notesMatch(action.payload, currentNote);
      const newStreak = wasCorrect ? state.session.streak + 1 : 0;
      const newMaxStreak = Math.max(newStreak, state.session.maxStreak);
      const updatedPool = updateWeights(state.weightedPool, currentNote, wasCorrect);
      const newHistory = [...state.session.history, { note: currentNote, wasCorrect }];

      return {
        ...state,
        phase: "feedback",
        session: {
          ...state.session,
          score: wasCorrect ? state.session.score + 1 : state.session.score,
          streak: newStreak,
          maxStreak: newMaxStreak,
          lastWasCorrect: wasCorrect,
          correctNote: currentNote,
          history: newHistory,
        },
        weightedPool: updatedPool,
        enharmonicPending: null,
      };
    }

    case "TIMER_EXPIRED": {
      if (state.phase !== "playing" || !state.session.currentNote) return state;
      const currentNote = state.session.currentNote;
      const newHistory = [...state.session.history, { note: currentNote, wasCorrect: false }];
      return {
        ...state,
        phase: "feedback",
        session: {
          ...state.session,
          streak: 0,
          lastWasCorrect: false,
          correctNote: currentNote,
          history: newHistory,
        },
        enharmonicPending: null,
      };
    }

    case "NEXT_NOTE": {
      const { notesRemaining, currentKey } = state.session;

      if (notesRemaining <= 0) {
        return { ...state, phase: "summary" };
      }

      let newKey = currentKey;
      if (state.settings.mode === "random-key" && state.settings.keyChangeFrequency === "note") {
        newKey = randomKeySig();
      }

      const pool = newKey ? buildPoolForKey(newKey) : state.weightedPool;
      const nextNote = weightedRandom(pool);

      return {
        ...state,
        phase: "playing",
        session: {
          ...state.session,
          notesRemaining: notesRemaining - 1,
          currentNote: nextNote,
          currentKey: newKey,
          lastWasCorrect: null,
          correctNote: null,
        },
      };
    }

    case "RESTART":
      return getInitialState();

    default:
      return state;
  }
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Timer effect
  useEffect(() => {
    if (state.phase !== "playing" || !state.settings.timerEnabled) return;
    const id = setTimeout(
      () => dispatch({ type: "TIMER_EXPIRED" }),
      state.settings.timerSeconds * 1000
    );
    return () => clearTimeout(id);
  }, [state.phase, state.session.currentNote, state.settings.timerEnabled, state.settings.timerSeconds]);

  const startSession = useCallback(() => dispatch({ type: "START_SESSION" }), []);
  const submitAnswer = useCallback((note: Note) => dispatch({ type: "SUBMIT_ANSWER", payload: note }), []);
  const openEnharmonicModal = useCallback((pair: [Note, Note]) => dispatch({ type: "OPEN_ENHARMONIC", payload: pair }), []);
  const dismissEnharmonicModal = useCallback(() => dispatch({ type: "CLOSE_ENHARMONIC" }), []);
  const nextNote = useCallback(() => dispatch({ type: "NEXT_NOTE" }), []);
  const updateSettings = useCallback((s: Partial<GameSettings>) => dispatch({ type: "UPDATE_SETTINGS", payload: s }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);

  return {
    state,
    startSession,
    submitAnswer,
    openEnharmonicModal,
    dismissEnharmonicModal,
    nextNote,
    updateSettings,
    restart,
  };
}
