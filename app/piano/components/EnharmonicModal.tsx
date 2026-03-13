"use client";

import { Note } from "@/app/piano/lib/music";
import styles from "./EnharmonicModal.module.css";

interface Props {
  pair: [Note, Note];
  onSelect: (note: Note) => void;
  onDismiss: () => void;
}

export function EnharmonicModal({ pair, onSelect, onDismiss }: Props) {
  return (
    <div className={styles.overlay} onClick={onDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.question}>Which note is this?</p>
        <div className={styles.buttons}>
          {pair.map((note, i) => (
            <button
              key={i}
              className={styles.choice}
              onClick={() => onSelect(note)}
            >
              {note.displayName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
