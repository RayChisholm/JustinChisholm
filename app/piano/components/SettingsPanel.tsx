"use client";

import { GameSettings } from "@/app/piano/hooks/useGameLogic";
import { KEY_SIGNATURES } from "@/app/piano/lib/music";
import styles from "./SettingsPanel.module.css";

interface Props {
  settings: GameSettings;
  onUpdate: (s: Partial<GameSettings>) => void;
  onStart: () => void;
  onPrintWorksheet: (keySig: string, count: number) => void;
}

export function SettingsPanel({ settings, onUpdate, onStart, onPrintWorksheet }: Props) {
  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Piano Sight-Reading</h1>
      <p className={styles.subtitle}>Practice identifying notes on the grand staff</p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Mode</h2>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${settings.mode === "chromatic" ? styles.active : ""}`}
            onClick={() => onUpdate({ mode: "chromatic" })}
          >
            Chromatic
          </button>
          <button
            className={`${styles.toggleBtn} ${settings.mode === "random-key" ? styles.active : ""}`}
            onClick={() => onUpdate({ mode: "random-key" })}
          >
            Random Key
          </button>
        </div>

        {settings.mode === "random-key" && (
          <div className={styles.subsection}>
            <label className={styles.label}>Key changes</label>
            <div className={styles.toggle}>
              <button
                className={`${styles.toggleBtn} ${settings.keyChangeFrequency === "session" ? styles.active : ""}`}
                onClick={() => onUpdate({ keyChangeFrequency: "session" })}
              >
                Per Session
              </button>
              <button
                className={`${styles.toggleBtn} ${settings.keyChangeFrequency === "note" ? styles.active : ""}`}
                onClick={() => onUpdate({ keyChangeFrequency: "note" })}
              >
                Per Note
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Notes per session</h2>
        <div className={styles.toggle}>
          {[10, 20, 30].map((n) => (
            <button
              key={n}
              className={`${styles.toggleBtn} ${settings.notesPerSession === n ? styles.active : ""}`}
              onClick={() => onUpdate({ notesPerSession: n })}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Timer</h2>
        <label className={styles.checkRow}>
          <input
            type="checkbox"
            checked={settings.timerEnabled}
            onChange={(e) => onUpdate({ timerEnabled: e.target.checked })}
            className={styles.checkbox}
          />
          <span>Enable countdown timer</span>
        </label>
        {settings.timerEnabled && (
          <div className={styles.timerRow}>
            <label className={styles.label}>Seconds per note</label>
            <input
              type="number"
              min={2}
              max={30}
              value={settings.timerSeconds}
              onChange={(e) => onUpdate({ timerSeconds: Number(e.target.value) })}
              className={styles.numberInput}
            />
          </div>
        )}
      </div>

      <button className={styles.startBtn} onClick={onStart}>
        Start Practice
      </button>

      <div className={styles.worksheetSection}>
        <h2 className={styles.sectionTitle}>Printable Worksheet</h2>
        <WorksheetControls onPrint={onPrintWorksheet} />
      </div>
    </div>
  );
}

function WorksheetControls({ onPrint }: { onPrint: (keySig: string, count: number) => void }) {
  return (
    <div className={styles.worksheetControls}>
      <p className={styles.worksheetNote}>
        Generate a worksheet with random notes to print and practice offline.
      </p>
      <div className={styles.worksheetRow}>
        <button
          className={styles.worksheetBtn}
          onClick={() => onPrint("C", 10)}
        >
          Print 10 Notes
        </button>
        <button
          className={styles.worksheetBtn}
          onClick={() => onPrint("C", 20)}
        >
          Print 20 Notes
        </button>
      </div>
    </div>
  );
}
