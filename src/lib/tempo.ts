export const BPM_MIN = 40;
export const BPM_MAX = 240;
export const BPM_DEFAULT = 100;

interface TempoTerm {
  readonly name: string;
  readonly minBpm: number;
}

const TEMPO_TERMS: readonly TempoTerm[] = [
  { name: 'Largo', minBpm: 40 },
  { name: 'Adagio', minBpm: 60 },
  { name: 'Andante', minBpm: 76 },
  { name: 'Moderato', minBpm: 108 },
  { name: 'Allegro', minBpm: 120 },
  { name: 'Presto', minBpm: 168 },
  { name: 'Prestissimo', minBpm: 200 },
];

export function tempoTermFor(bpm: number): string {
  let term = TEMPO_TERMS[0].name;
  for (const t of TEMPO_TERMS) {
    if (bpm >= t.minBpm) term = t.name;
  }
  return term;
}

export function clampBpm(bpm: number): number {
  return Math.max(BPM_MIN, Math.min(BPM_MAX, Math.round(bpm)));
}
