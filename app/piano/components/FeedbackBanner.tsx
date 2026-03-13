"use client";

import styles from "./FeedbackBanner.module.css";

interface Props {
  wasCorrect: boolean;
  correctNote: string;
  streak: number;
  onNext: () => void;
}

export function FeedbackBanner({ wasCorrect, correctNote, streak, onNext }: Props) {
  return (
    <div className={`${styles.banner} ${wasCorrect ? styles.correct : styles.wrong}`}>
      <div className={styles.message}>
        {wasCorrect ? (
          <>
            <span className={styles.icon}>✓</span>
            <span>Correct!</span>
            {streak > 1 && <span className={styles.streak}>{streak} in a row!</span>}
          </>
        ) : (
          <>
            <span className={styles.icon}>✗</span>
            <span>Wrong — it was <strong>{correctNote}</strong></span>
          </>
        )}
      </div>
      <button className={styles.next} onClick={onNext}>
        Next →
      </button>
    </div>
  );
}
