"use client";

import { useEffect, useRef } from "react";
import { Note, KeySig } from "@/app/piano/lib/music";
import styles from "./StaffDisplay.module.css";

interface Props {
  note: Note | null;
  keySignature: KeySig | null;
}

export function StaffDisplay({ note, keySignature }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !note) return;
    const container = containerRef.current;

    import("vexflow").then((VF) => {
      const { Renderer, Stave, StaveNote, GhostNote, Accidental, StaveConnector, Voice, Formatter } = VF;

      container.innerHTML = "";

      const width = Math.min(container.clientWidth || 340, 340);
      const staveWidth = width - 20;
      const renderer = new Renderer(container, Renderer.Backends.SVG);
      renderer.resize(width, 300);
      const ctx = renderer.getContext();
      ctx.setFont("Arial", 10);

      // Treble stave
      const trebleStave = new Stave(10, 20, staveWidth);
      trebleStave.addClef("treble");
      if (keySignature && keySignature.vexKey !== "C") {
        trebleStave.addKeySignature(keySignature.vexKey);
      }
      trebleStave.setContext(ctx).draw();

      // Bass stave
      const bassStave = new Stave(10, 160, staveWidth);
      bassStave.addClef("bass");
      if (keySignature && keySignature.vexKey !== "C") {
        bassStave.addKeySignature(keySignature.vexKey);
      }
      bassStave.setContext(ctx).draw();

      // Connect staves with brace and barline
      new StaveConnector(trebleStave, bassStave)
        .setType(StaveConnector.type.BRACE)
        .setContext(ctx)
        .draw();
      new StaveConnector(trebleStave, bassStave)
        .setType(StaveConnector.type.SINGLE_LEFT)
        .setContext(ctx)
        .draw();

      // Build the note for the active clef, ghost rest for the other
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

      const trebleNote = isInTreble ? activeNoteObj : ghostRest;
      const bassNote = isInTreble ? ghostRest : activeNoteObj;

      // Voices
      const trebleVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      trebleVoice.addTickable(trebleNote);

      const bassVoice = new Voice({ numBeats: 1, beatValue: 4 }).setStrict(false);
      bassVoice.addTickable(bassNote);

      new Formatter()
        .joinVoices([trebleVoice])
        .format([trebleVoice], staveWidth - 60);
      trebleVoice.draw(ctx, trebleStave);

      new Formatter()
        .joinVoices([bassVoice])
        .format([bassVoice], staveWidth - 60);
      bassVoice.draw(ctx, bassStave);
    });
  }, [note, keySignature]);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.container} />
    </div>
  );
}
