"use client";

import { useState, useCallback } from "react";
import { useGameLogic } from "@/app/piano/hooks/useGameLogic";
import { StaffDisplay } from "@/app/piano/components/StaffDisplay";
import { PianoKeyboard } from "@/app/piano/components/PianoKeyboard";
import { EnharmonicModal } from "@/app/piano/components/EnharmonicModal";
import { FeedbackBanner } from "@/app/piano/components/FeedbackBanner";
import { SettingsPanel } from "@/app/piano/components/SettingsPanel";
import { SummaryScreen } from "@/app/piano/components/SummaryScreen";
import { WorksheetView, generateWorksheetNotes } from "@/app/piano/components/WorksheetView";
import { Note, KeySig, KEY_SIGNATURES } from "@/app/piano/lib/music";
import styles from "./page.module.css";

export default function PianoPage() {
  const game = useGameLogic();
  const { state, startSession, submitAnswer, openEnharmonicModal, dismissEnharmonicModal, nextNote, updateSettings, restart } = game;
  const { phase, session, settings } = state;

  const [worksheetNotes, setWorksheetNotes] = useState<Note[]>([]);
  const [worksheetKeySig, setWorksheetKeySig] = useState<KeySig>(KEY_SIGNATURES[0]);

  function handlePrintWorksheet(keySigVexKey: string, count: number, allowAccidentals: boolean) {
    const keySig = KEY_SIGNATURES.find((k) => k.vexKey === keySigVexKey) ?? KEY_SIGNATURES[0];
    setWorksheetKeySig(keySig);
    setWorksheetNotes(generateWorksheetNotes(count, keySig, allowAccidentals));
    // window.print() fires via onAllRendered callback in WorksheetView
  }

  const handleAllRendered = useCallback(() => {
    setTimeout(() => {
      window.print();         // synchronous — blocks until dialog closes/cancels
      setWorksheetNotes([]);  // clear so effects don't re-fire
    }, 150);
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {phase === "settings" && (
          <SettingsPanel
            settings={settings}
            onUpdate={updateSettings}
            onStart={startSession}
            onPrintWorksheet={handlePrintWorksheet}
          />
        )}

        {(phase === "playing" || phase === "feedback") && (
          <>
            <ScoreBar
              score={session.score}
              streak={session.streak}
              remaining={session.notesRemaining}
              total={settings.notesPerSession}
              currentKey={session.currentKey?.name}
              currentNote={session.currentNote}
            />

            <StaffDisplay
              note={session.currentNote}
              keySignature={phase === "feedback" ? null : session.currentKey}
            />

            <PianoKeyboard
              onWhiteKey={phase === "playing" ? submitAnswer : () => {}}
              onBlackKey={phase === "playing" ? openEnharmonicModal : () => {}}
              activeOctave={session.currentNote?.octave}
              highlightNote={phase === "feedback" && !session.lastWasCorrect ? session.correctNote : null}
            />

            {phase === "feedback" && session.lastWasCorrect !== null && session.correctNote && (
              <FeedbackBanner
                wasCorrect={session.lastWasCorrect}
                correctNote={session.correctNote.displayName}
                streak={session.streak}
                onNext={nextNote}
              />
            )}

            {state.enharmonicPending && (
              <EnharmonicModal
                pair={state.enharmonicPending}
                onSelect={submitAnswer}
                onDismiss={dismissEnharmonicModal}
              />
            )}
          </>
        )}

        {phase === "summary" && (
          <SummaryScreen state={state} onRestart={restart} />
        )}
      </div>

      <WorksheetView notes={worksheetNotes} keySig={worksheetKeySig} onAllRendered={handleAllRendered} />
    </main>
  );
}

interface ScoreBarProps {
  score: number;
  streak: number;
  remaining: number;
  total: number;
  currentKey?: string;
  currentNote: Note | null;
}

function ScoreBar({ score, streak, remaining, total, currentKey }: ScoreBarProps) {
  const answered = total - remaining - 1;
  const progress = Math.max(0, Math.min(100, (answered / total) * 100));

  return (
    <div className={styles.scoreBar}>
      <div className={styles.scoreInfo}>
        <span className={styles.score}>{score} pts</span>
        {streak > 1 && <span className={styles.streak}>{streak}x</span>}
        {currentKey && <span className={styles.key}>{currentKey}</span>}
      </div>
      <div className={styles.progress}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.remaining}>
        {remaining + 1} / {total}
      </div>
    </div>
  );
}
