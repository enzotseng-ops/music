import { tempoTermFor } from '../lib/tempo';

interface BpmDisplayProps {
  readonly bpm: number;
}

export function BpmDisplay({ bpm }: BpmDisplayProps) {
  return (
    <div className="bpm-display">
      <div className="bpm-number">{bpm}</div>
      <div className="bpm-unit">BPM</div>
      <div className="bpm-term">{tempoTermFor(bpm)}</div>
    </div>
  );
}
