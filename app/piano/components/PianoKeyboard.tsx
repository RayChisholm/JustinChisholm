"use client";

import { Note, NoteName, Accidental, Clef, getEnharmonicPair, notesMatch } from "@/app/piano/lib/music";
import styles from "./PianoKeyboard.module.css";

interface Props {
  onWhiteKey: (note: Note) => void;
  onBlackKey: (pair: [Note, Note]) => void;
  activeOctave?: number;
  highlightNote?: Note | null;
}

interface KeyDef {
  name: NoteName;
  accidental: Accidental;
  octave: number;
  clef: Clef;
}

// Piano range: C2 to C6
const WHITE_NOTES: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];

// Black key positions within an octave (between which white keys)
// Position is the index of the white key to the LEFT of the black key
const BLACK_KEY_POSITIONS: { afterIndex: number; name: NoteName }[] = [
  { afterIndex: 0, name: "C" }, // C# between C(0) and D(1)
  { afterIndex: 1, name: "D" }, // D# between D(1) and E(2)
  { afterIndex: 3, name: "F" }, // F# between F(3) and G(4)
  { afterIndex: 4, name: "G" }, // G# between G(4) and A(5)
  { afterIndex: 5, name: "A" }, // A# between A(5) and B(6)
];

function makeNote(name: NoteName, accidental: Accidental, octave: number): Note {
  const acc = accidental ?? "";
  const clef: Clef = octave <= 3 ? "bass" : "treble";
  const displayAcc = accidental === "#" ? "♯" : accidental === "b" ? "♭" : "";
  return {
    name,
    accidental,
    octave,
    clef,
    vexKey: `${name.toLowerCase()}${acc}/${octave}`,
    displayName: `${name}${displayAcc}${octave}`,
  };
}

const WHITE_KEY_WIDTH = 28;
const BLACK_KEY_WIDTH = 17;


export function PianoKeyboard({ onWhiteKey, onBlackKey, activeOctave, highlightNote }: Props) {
  const octaves = [2, 3, 4, 5]; // C2 to B5, then add C6

  return (
    <div className={styles.keyboardWrapper}>
      <div className={styles.keyboard}>
        {octaves.map((octave) => (
          <div
            key={octave}
            className={`${styles.octave} ${activeOctave === octave ? styles.activeOctave : ""}`}
          >
            {/* White keys */}
            {WHITE_NOTES.map((name, i) => {
              const note = makeNote(name, null, octave);
              const lit = highlightNote ? notesMatch(note, highlightNote) : false;
              return (
                <button
                  key={`${name}${octave}`}
                  className={`${styles.whiteKey} ${lit ? styles.highlightWhite : ""}`}
                  onClick={() => onWhiteKey(note)}
                  title={note.displayName}
                  style={{ left: `${i * WHITE_KEY_WIDTH}px` }}
                />
              );
            })}
            {/* Black keys */}
            {BLACK_KEY_POSITIONS.map(({ afterIndex, name }) => {
              const sharpNote = makeNote(name, "#", octave);
              const pair = getEnharmonicPair(sharpNote);
              const lit = highlightNote ? notesMatch(sharpNote, highlightNote) : false;
              return (
                <button
                  key={`${name}#${octave}`}
                  className={`${styles.blackKey} ${lit ? styles.highlightBlack : ""}`}
                  onClick={() => onBlackKey(pair)}
                  title={pair[0].displayName}
                  style={{ left: `${afterIndex * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2}px` }}
                />
              );
            })}
          </div>
        ))}
        {/* Final C6 */}
        <div className={styles.octave}>
          <button
            className={styles.whiteKey}
            onClick={() => onWhiteKey(makeNote("C", null, 6))}
            title="C6"
            style={{ left: "0px" }}
          />
        </div>
      </div>
    </div>
  );
}
