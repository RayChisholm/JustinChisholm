"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { Note, buildFullPool, weightedRandom } from "@/app/piano/lib/music";
import styles from "./WorksheetView.module.css";
import "./worksheet-print.css";

interface Props {
  notes: Note[];
  onAllRendered?: () => void;
}

export function WorksheetView({ notes, onAllRendered }: Props) {
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
          <WorksheetStaff key={`${note.vexKey}-${i}`} note={note} index={i + 1} onRendered={handleStaffRendered} />
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

function WorksheetStaff({ note, index, onRendered }: { note: Note; index: number; onRendered: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    import("vexflow").then((VF) => {
      const { Renderer, Stave, StaveNote, GhostNote, Accidental, StaveConnector, Voice, Formatter } = VF;

      container.innerHTML = "";
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(160, 200);
      const ctx = renderer.getContext();

      const treble = new Stave(10, 10, 130);
      treble.addClef("treble");
      treble.setContext(ctx).draw();

      const bass = new Stave(10, 110, 130);
      bass.addClef("bass");
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
      if (note.accidental) {
        activeNoteObj.addModifier(new Accidental(note.accidental), 0);
      }

      const ghostRest = new GhostNote({ duration: "q" });

      const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      trebleVoice.addTickable(isInTreble ? activeNoteObj : ghostRest);
      new Formatter().joinVoices([trebleVoice]).format([trebleVoice], 90);
      trebleVoice.draw(ctx, treble);

      const bassVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      bassVoice.addTickable(isInTreble ? ghostRest : activeNoteObj);
      new Formatter().joinVoices([bassVoice]).format([bassVoice], 90);
      bassVoice.draw(ctx, bass);

      onRendered();
    });
  }, [note, onRendered]);

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

export function generateWorksheetNotes(count: number): Note[] {
  const pool = buildFullPool().filter((wn) => wn.note.accidental === null);
  const notes: Note[] = [];
  for (let i = 0; i < count; i++) {
    notes.push(weightedRandom(pool));
  }
  return notes;
}
