"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Note, KeySig, buildChromaticPool, buildPoolForKey, weightedRandom } from "@/app/piano/lib/music";
import styles from "./WorksheetView.module.css";
import "./worksheet-print.css";

interface Props {
  notes: Note[];
  keySig: KeySig;
  allowAccidentals: boolean;
  overlay?: boolean;
  onClose?: () => void;
  onAllRendered?: () => void;
}

export function WorksheetView({ notes, keySig, allowAccidentals, overlay = false, onClose, onAllRendered }: Props) {
  const renderedCount = useRef(0);
  const hasFired = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleStaffRendered = useCallback(() => {
    renderedCount.current += 1;
    if (!hasFired.current && renderedCount.current >= notes.length && onAllRendered) {
      hasFired.current = true;
      onAllRendered();
    }
  }, [notes.length, onAllRendered]);

  // Reset counters when notes change
  useEffect(() => {
    renderedCount.current = 0;
    hasFired.current = false;
  }, [notes]);

  if (!mounted || notes.length === 0) return null;

  const sheet = (
    <div className={`${styles.container} ${overlay ? styles.containerOverlay : ""}`} id="worksheet-print">
      <div className={styles.header}>
        <h1 className={styles.title}>Piano Sight-Reading Worksheet</h1>
        <div className={styles.headerMeta}>
          <span>Key: <strong>{keySig.name}</strong></span>
          <span>Accidentals: <strong>{allowAccidentals ? "Yes" : "No"}</strong></span>
        </div>
        <p className={styles.subtitle}>Name: _________________________ Date: _____________</p>
      </div>

      <div className={styles.grid}>
        {notes.map((note, i) => (
          <WorksheetStaff key={`${note.vexKey}-${i}`} note={note} keySig={keySig} index={i + 1} onRendered={handleStaffRendered} />
        ))}
      </div>

      <div className={styles.answerKey}>
        <h2 className={styles.answerTitle}>Answer Key</h2>
        <div className={styles.answers}>
          {notes.map((note, i) => (
            <div key={i} className={styles.answer}>
              <span className={styles.answerNum}>{i + 1}.</span>
              <span className={styles.answerNote}>{note.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (overlay) {
    return createPortal(
      <div className={styles.overlayBackdrop}>
        <div className={styles.overlayBar}>
          <span className={styles.overlayHint}>Use Share → Print to save as PDF</span>
          <button className={styles.overlayClose} onClick={onClose}>✕ Close</button>
        </div>
        <div className={styles.overlayScroll}>
          {sheet}
        </div>
      </div>,
      document.body
    );
  }

  // Portal renders directly into document.body so print CSS can target it
  // (a display:none parent would otherwise block its children from showing in print)
  return createPortal(sheet, document.body);
}

function WorksheetStaff({ note, keySig, index, onRendered }: { note: Note; keySig: KeySig; index: number; onRendered: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    import("vexflow").then((VF) => {
      const { Renderer, Stave, StaveNote, GhostNote, Accidental, StaveConnector, Voice, Formatter } = VF;

      // Fixed size wide enough for up to 7 key-sig accidentals.
      // Dynamic sizing caused the SVG to exceed the grid column width,
      // which made the browser scale it down and shrink the note display.
      const staveWidth = 155;
      const rendererWidth = 185;

      container.innerHTML = "";
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(rendererWidth, 200);
      const ctx = renderer.getContext();

      const treble = new Stave(10, 10, staveWidth);
      treble.addClef("treble").addKeySignature(keySig.vexKey);
      treble.setContext(ctx).draw();

      const bass = new Stave(10, 110, staveWidth);
      bass.addClef("bass").addKeySignature(keySig.vexKey);
      bass.setContext(ctx).draw();

      new StaveConnector(treble, bass)
        .setType(StaveConnector.type.BRACE)
        .setContext(ctx)
        .draw();
      new StaveConnector(treble, bass)
        .setType(StaveConnector.type.SINGLE_LEFT)
        .setContext(ctx)
        .draw();

      const isInTreble = note.clef === "treble";
      const activeNoteObj = new StaveNote({
        keys: [note.vexKey],
        duration: "q",
        clef: note.clef,
      });

      // Manually resolve which accidental symbol to show on the staff.
      // - Note is diatonic to key (e.g. F# in G major) → no symbol
      // - Note is natural but key would alter it (e.g. F♮ in G major) → natural sign
      // - Note has an accidental not in the key (e.g. Bb in G major) → show it
      const keyAcc = keySig.alterationType === "sharp" ? "#"
                   : keySig.alterationType === "flat"  ? "b"
                   : null;
      const noteIsAlteredInKey = keySig.alteredNotes.includes(note.name);
      let displayAcc: string | null = null;
      if (noteIsAlteredInKey) {
        if (note.accidental === null) displayAcc = "n";       // natural cancels key sig
        else if (note.accidental !== keyAcc) displayAcc = note.accidental; // different acc
        // else: matches key sig — no symbol needed
      } else {
        displayAcc = note.accidental; // chromatic acc shown as-is; null = no symbol
      }
      if (displayAcc) activeNoteObj.addModifier(new Accidental(displayAcc), 0);

      const ghostRest = new GhostNote({ duration: "q" });
      const noteWidth = staveWidth - 50;

      const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      trebleVoice.addTickable(isInTreble ? activeNoteObj : ghostRest);
      new Formatter().joinVoices([trebleVoice]).format([trebleVoice], noteWidth);

      const bassVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      bassVoice.addTickable(isInTreble ? ghostRest : activeNoteObj);
      new Formatter().joinVoices([bassVoice]).format([bassVoice], noteWidth);

      trebleVoice.draw(ctx, treble);
      bassVoice.draw(ctx, bass);

      onRendered();
    });
  }, [note, keySig, onRendered]);

  return (
    <div className={styles.staffCell}>
      <div ref={containerRef} className={styles.staffContainer} />
      <div className={styles.answerRow}>
        <span className={styles.noteNum}>{index}.</span>
        <svg width="55" height="10" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="9" x2="55" y2="9" stroke="black" strokeWidth="1"/>
        </svg>
      </div>
    </div>
  );
}

export function generateWorksheetNotes(count: number, keySig: KeySig, allowAccidentals: boolean): Note[] {
  const pool = allowAccidentals ? buildChromaticPool() : buildPoolForKey(keySig);
  const notes: Note[] = [];
  for (let i = 0; i < count; i++) {
    notes.push(weightedRandom(pool));
  }
  return notes;
}
