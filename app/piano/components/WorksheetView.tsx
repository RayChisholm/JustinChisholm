"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Note, KeySig, buildChromaticPool, buildPoolForKey, weightedRandom } from "@/app/piano/lib/music";
import styles from "./WorksheetView.module.css";
import "./worksheet-print.css";

interface Props {
  notes: Note[];
  keySig: KeySig;
  onAllRendered?: () => void;
}

export function WorksheetView({ notes, keySig, onAllRendered }: Props) {
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

  const content = (
    <div className={styles.container} id="worksheet-print">
      <div className={styles.header}>
        <h1 className={styles.title}>Piano Sight-Reading Worksheet</h1>
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

  // Portal renders directly into document.body so print CSS can target it
  // (a display:none parent would otherwise block its children from showing in print)
  return createPortal(content, document.body);
}

function WorksheetStaff({ note, keySig, index, onRendered }: { note: Note; keySig: KeySig; index: number; onRendered: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    import("vexflow").then((VF) => {
      const { Renderer, Stave, StaveNote, GhostNote, Accidental, StaveConnector, Voice, Formatter } = VF;

      // Wider stave to accommodate key signature accidentals (~13px each)
      const numAcc = keySig.alteredNotes.length;
      const staveWidth = 130 + numAcc * 13;
      const rendererWidth = staveWidth + 30;

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
      // Do NOT manually add accidentals — applyAccidentals handles it,
      // suppressing signs that are already implied by the key signature.

      const ghostRest = new GhostNote({ duration: "q" });
      const noteWidth = staveWidth - 50;

      const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      trebleVoice.addTickable(isInTreble ? activeNoteObj : ghostRest);
      new Formatter().joinVoices([trebleVoice]).format([trebleVoice], noteWidth);

      const bassVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      bassVoice.addTickable(isInTreble ? ghostRest : activeNoteObj);
      new Formatter().joinVoices([bassVoice]).format([bassVoice], noteWidth);

      // Apply accidentals only to the voice with the real StaveNote.
      // GhostNote in the other voice causes an unformatted-note crash.
      Accidental.applyAccidentals([isInTreble ? trebleVoice : bassVoice], keySig.vexKey);

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
