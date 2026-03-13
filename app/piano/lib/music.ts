export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Accidental = "b" | "#" | "n" | null;
export type Clef = "treble" | "bass";

export interface Note {
  name: NoteName;
  accidental: Accidental;
  octave: number;
  clef: Clef;
  vexKey: string;
  displayName: string;
}

export interface KeySig {
  name: string;
  vexKey: string;
  alteredNotes: NoteName[];
  alterationType: "sharp" | "flat" | "none";
}

export interface WeightedNote {
  note: Note;
  weight: number;
}

export const KEY_SIGNATURES: KeySig[] = [
  { name: "C major", vexKey: "C", alteredNotes: [], alterationType: "none" },
  { name: "G major", vexKey: "G", alteredNotes: ["F"], alterationType: "sharp" },
  { name: "D major", vexKey: "D", alteredNotes: ["F", "C"], alterationType: "sharp" },
  { name: "A major", vexKey: "A", alteredNotes: ["F", "C", "G"], alterationType: "sharp" },
  { name: "E major", vexKey: "E", alteredNotes: ["F", "C", "G", "D"], alterationType: "sharp" },
  { name: "B major", vexKey: "B", alteredNotes: ["F", "C", "G", "D", "A"], alterationType: "sharp" },
  { name: "F# major", vexKey: "F#", alteredNotes: ["F", "C", "G", "D", "A", "E"], alterationType: "sharp" },
  { name: "C# major", vexKey: "C#", alteredNotes: ["F", "C", "G", "D", "A", "E", "B"], alterationType: "sharp" },
  { name: "F major", vexKey: "F", alteredNotes: ["B"], alterationType: "flat" },
  { name: "Bb major", vexKey: "Bb", alteredNotes: ["B", "E"], alterationType: "flat" },
  { name: "Eb major", vexKey: "Eb", alteredNotes: ["B", "E", "A"], alterationType: "flat" },
  { name: "Ab major", vexKey: "Ab", alteredNotes: ["B", "E", "A", "D"], alterationType: "flat" },
  { name: "Db major", vexKey: "Db", alteredNotes: ["B", "E", "A", "D", "G"], alterationType: "flat" },
  { name: "Gb major", vexKey: "Gb", alteredNotes: ["B", "E", "A", "D", "G", "C"], alterationType: "flat" },
  { name: "Cb major", vexKey: "Cb", alteredNotes: ["B", "E", "A", "D", "G", "C", "F"], alterationType: "flat" },
];

function makeDisplayName(name: NoteName, accidental: Accidental, octave: number): string {
  const acc = accidental === "#" ? "♯" : accidental === "b" ? "♭" : accidental === "n" ? "♮" : "";
  return `${name}${acc}${octave}`;
}

function makeVexKey(name: NoteName, accidental: Accidental, octave: number): string {
  const acc = accidental ?? "";
  return `${name.toLowerCase()}${acc}/${octave}`;
}

function makeNote(name: NoteName, accidental: Accidental, octave: number, clef: Clef): Note {
  return {
    name,
    accidental,
    octave,
    clef,
    vexKey: makeVexKey(name, accidental, octave),
    displayName: makeDisplayName(name, accidental, octave),
  };
}

// Treble: C4–G5 (natural notes + chromatic)
function buildTreblePool(): Note[] {
  const notes: Note[] = [];
  // Naturals C4 to G5
  const naturals: { name: NoteName; octave: number }[] = [
    { name: "C", octave: 4 }, { name: "D", octave: 4 }, { name: "E", octave: 4 },
    { name: "F", octave: 4 }, { name: "G", octave: 4 }, { name: "A", octave: 4 },
    { name: "B", octave: 4 }, { name: "C", octave: 5 }, { name: "D", octave: 5 },
    { name: "E", octave: 5 }, { name: "F", octave: 5 }, { name: "G", octave: 5 },
  ];
  for (const { name, octave } of naturals) {
    notes.push(makeNote(name, null, octave, "treble"));
  }
  // Sharps/flats (chromatic — black keys)
  const chromatic: { name: NoteName; accidental: Accidental; octave: number }[] = [
    { name: "C", accidental: "#", octave: 4 }, { name: "D", accidental: "#", octave: 4 },
    { name: "F", accidental: "#", octave: 4 }, { name: "G", accidental: "#", octave: 4 },
    { name: "A", accidental: "#", octave: 4 }, { name: "C", accidental: "#", octave: 5 },
    { name: "D", accidental: "#", octave: 5 }, { name: "F", accidental: "#", octave: 5 },
  ];
  for (const { name, accidental, octave } of chromatic) {
    notes.push(makeNote(name, accidental, octave, "treble"));
  }
  return notes;
}

// Bass: F2–C4 (natural notes + chromatic)
function buildBassPool(): Note[] {
  const notes: Note[] = [];
  const naturals: { name: NoteName; octave: number }[] = [
    { name: "F", octave: 2 }, { name: "G", octave: 2 }, { name: "A", octave: 2 },
    { name: "B", octave: 2 }, { name: "C", octave: 3 }, { name: "D", octave: 3 },
    { name: "E", octave: 3 }, { name: "F", octave: 3 }, { name: "G", octave: 3 },
    { name: "A", octave: 3 }, { name: "B", octave: 3 }, { name: "C", octave: 4 },
  ];
  for (const { name, octave } of naturals) {
    notes.push(makeNote(name, null, octave, "bass"));
  }
  const chromatic: { name: NoteName; accidental: Accidental; octave: number }[] = [
    { name: "F", accidental: "#", octave: 2 }, { name: "G", accidental: "#", octave: 2 },
    { name: "A", accidental: "#", octave: 2 }, { name: "C", accidental: "#", octave: 3 },
    { name: "D", accidental: "#", octave: 3 }, { name: "F", accidental: "#", octave: 3 },
    { name: "G", accidental: "#", octave: 3 }, { name: "A", accidental: "#", octave: 3 },
  ];
  for (const { name, accidental, octave } of chromatic) {
    notes.push(makeNote(name, accidental, octave, "bass"));
  }
  return notes;
}

export function buildFullPool(): WeightedNote[] {
  return [...buildTreblePool(), ...buildBassPool()].map((note) => ({ note, weight: 1 }));
}

export function buildNaturalPool(): WeightedNote[] {
  return [...buildTreblePool(), ...buildBassPool()]
    .filter((n) => n.accidental === null)
    .map((note) => ({ note, weight: 1 }));
}

export function weightedRandom(pool: WeightedNote[]): Note {
  const total = pool.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of pool) {
    r -= w.weight;
    if (r <= 0) return w.note;
  }
  return pool[pool.length - 1].note;
}

export function updateWeights(pool: WeightedNote[], note: Note, wasCorrect: boolean): WeightedNote[] {
  return pool.map((w) => {
    if (w.note.vexKey === note.vexKey) {
      return { ...w, weight: wasCorrect ? Math.max(1, w.weight - 1) : w.weight + 2 };
    }
    return w;
  });
}

// Get enharmonic spelling for a black key note
export function getEnharmonicPair(note: Note): [Note, Note] {
  // note is always a sharp; return [sharp, flat] pair
  const sharps: Record<string, { flatName: NoteName; flatOctave: number }> = {
    "c#/4": { flatName: "D", flatOctave: 4 },
    "d#/4": { flatName: "E", flatOctave: 4 },
    "f#/4": { flatName: "G", flatOctave: 4 },
    "g#/4": { flatName: "A", flatOctave: 4 },
    "a#/4": { flatName: "B", flatOctave: 4 },
    "c#/5": { flatName: "D", flatOctave: 5 },
    "d#/5": { flatName: "E", flatOctave: 5 },
    "f#/5": { flatName: "G", flatOctave: 5 },
    "f#/2": { flatName: "G", flatOctave: 2 },
    "g#/2": { flatName: "A", flatOctave: 2 },
    "a#/2": { flatName: "B", flatOctave: 2 },
    "c#/3": { flatName: "D", flatOctave: 3 },
    "d#/3": { flatName: "E", flatOctave: 3 },
    "f#/3": { flatName: "G", flatOctave: 3 },
    "g#/3": { flatName: "A", flatOctave: 3 },
    "a#/3": { flatName: "B", flatOctave: 3 },
  };
  const key = note.vexKey;
  const flat = sharps[key];
  if (!flat) return [note, note];
  const flatNote = makeNote(flat.flatName, "b", flat.flatOctave, note.clef);
  return [note, flatNote];
}

// Check if two notes are enharmonically equivalent
export function notesMatch(a: Note, b: Note): boolean {
  // Same exact note
  if (a.vexKey === b.vexKey) return true;
  // Enharmonic: one is sharp, other is flat with same pitch
  const ENHARMONIC_MAP: Record<string, string> = {
    "c#": "db", "db": "c#",
    "d#": "eb", "eb": "d#",
    "f#": "gb", "gb": "f#",
    "g#": "ab", "ab": "g#",
    "a#": "bb", "bb": "a#",
    "b#": "c",  "c": "b#",
    "e#": "f",  "f": "e#",
  };
  const aBase = `${a.name.toLowerCase()}${a.accidental ?? ""}`;
  const bBase = `${b.name.toLowerCase()}${b.accidental ?? ""}`;

  // Check octave-aware enharmonic equality
  // B#4 = C5, E#4 = F4, Cb5 = B4, Fb4 = E4
  const aEnharm = ENHARMONIC_MAP[aBase];
  if (aEnharm && aEnharm === bBase) {
    // Most common case: same octave
    if (a.octave === b.octave) return true;
    // B#/C boundary: B#4 = C5
    if (aBase === "b#" && bBase === "c" && b.octave === a.octave + 1) return true;
    if (bBase === "b#" && aBase === "c" && a.octave === b.octave + 1) return true;
    // Cb boundary: Cb5 = B4
    if (aBase === "cb" && bBase === "b" && b.octave === a.octave - 1) return true;
    if (bBase === "cb" && aBase === "b" && a.octave === b.octave - 1) return true;
  }
  return false;
}

export function randomKeySig(): KeySig {
  return KEY_SIGNATURES[Math.floor(Math.random() * KEY_SIGNATURES.length)];
}

// Build note pool for a specific key signature (only diatonic notes, altered by key sig)
export function buildPoolForKey(keySig: KeySig): WeightedNote[] {
  return buildNaturalPool().map((wn) => {
    // In a key sig context, altered notes use the key's accidental
    if (keySig.alteredNotes.includes(wn.note.name)) {
      const acc: Accidental = keySig.alterationType === "sharp" ? "#" : keySig.alterationType === "flat" ? "b" : null;
      const alteredNote = makeNote(wn.note.name, acc, wn.note.octave, wn.note.clef);
      return { note: alteredNote, weight: 1 };
    }
    return wn;
  });
}
