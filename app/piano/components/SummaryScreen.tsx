"use client";

import { GameState } from "@/app/piano/hooks/useGameLogic";
import styles from "./SummaryScreen.module.css";

interface Props {
  state: GameState;
  onRestart: () => void;
}

export function SummaryScreen({ state, onRestart }: Props) {
  const { session, settings } = state;
  const total = settings.notesPerSession;
  const accuracy = total > 0 ? Math.round((session.score / total) * 100) : 0;

  // Count wrong answers per note
  const missedMap = new Map<string, number>();
  for (const h of session.history) {
    if (!h.wasCorrect) {
      const key = h.note.displayName;
      missedMap.set(key, (missedMap.get(key) ?? 0) + 1);
    }
  }
  const mostMissed = [...missedMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Session Complete</h2>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{session.score}/{total}</span>
          <span className={styles.statLabel}>Score</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{accuracy}%</span>
          <span className={styles.statLabel}>Accuracy</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{session.maxStreak}</span>
          <span className={styles.statLabel}>Best streak</span>
        </div>
      </div>

      {mostMissed.length > 0 && (
        <div className={styles.missed}>
          <h3 className={styles.missedTitle}>Most missed</h3>
          <div className={styles.missedList}>
            {mostMissed.map(([note, count]) => (
              <div key={note} className={styles.missedNote}>
                <span className={styles.noteName}>{note}</span>
                <span className={styles.missCount}>{count}×</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {mostMissed.length === 0 && (
        <p className={styles.perfect}>Perfect score! Great work!</p>
      )}

      <button className={styles.restart} onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}
