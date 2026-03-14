"use client";

import { useState } from "react";
import { GameSettings } from "@/app/piano/hooks/useGameLogic";
import { KEY_SIGNATURES } from "@/app/piano/lib/music";
import styles from "./SettingsPanel.module.css";

function notesForPages(pages: number): number {
  // Page 1 fits 12 notes (header takes space); subsequent pages fit 16 each
  return 12 + Math.max(0, pages - 1) * 16;
}

interface Props {
  settings: GameSettings;
  onUpdate: (s: Partial<GameSettings>) => void;
  onStart: () => void;
  onPrintWorksheet: (keySig: string, count: number, allowAccidentals: boolean) => void;
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

function WorksheetControls({ onPrint }: { onPrint: (keySig: string, count: number, allowAccidentals: boolean) => void }) {
  const [pages, setPages] = useState(1);
  const [keySig, setKeySig] = useState("C");
  const [allowAccidentals, setAllowAccidentals] = useState(false);

  return (
    <div className={styles.worksheetControls}>
      <p className={styles.worksheetNote}>
        Generate a worksheet with random notes to print and practice offline.
      </p>
      <div className={styles.worksheetOption}>
        <label className={styles.label}>Key</label>
        <select
          className={styles.numberInput}
          value={keySig}
          onChange={(e) => setKeySig(e.target.value)}
          style={{ width: "auto" }}
        >
          {KEY_SIGNATURES.map((k) => (
            <option key={k.vexKey} value={k.vexKey}>{k.name}</option>
          ))}
        </select>
      </div>
      <label className={`${styles.checkRow} ${styles.worksheetOption}`}>
        <input
          type="checkbox"
          checked={allowAccidentals}
          onChange={(e) => setAllowAccidentals(e.target.checked)}
          className={styles.checkbox}
        />
        <span>Include accidentals</span>
      </label>
      <div className={styles.worksheetRow}>
        <label className={styles.label} style={{ margin: 0, alignSelf: "center" }}>Pages:</label>
        <select
          className={styles.numberInput}
          value={pages}
          onChange={(e) => setPages(Number(e.target.value))}
          style={{ width: "auto" }}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button
          className={styles.worksheetBtn}
          onClick={() => onPrint(keySig, notesForPages(pages), allowAccidentals)}
        >
          Generate Worksheet
        </button>
      </div>
    </div>
  );
}
