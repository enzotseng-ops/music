import { BPM_MAX, BPM_MIN, clampBpm } from '../lib/tempo';

interface BpmControlsProps {
  readonly bpm: number;
  readonly onChange: (bpm: number) => void;
}

export function BpmControls({ bpm, onChange }: BpmControlsProps) {
  return (
    <div className="bpm-controls">
      <button
        type="button"
        className="bpm-step"
        aria-label="Decrease BPM"
        onClick={() => onChange(clampBpm(bpm - 1))}
        disabled={bpm <= BPM_MIN}
      >
        −
      </button>

      <input
        type="range"
        className="bpm-slider"
        min={BPM_MIN}
        max={BPM_MAX}
        step={1}
        value={bpm}
        onChange={e => onChange(clampBpm(Number(e.target.value)))}
        aria-label="BPM slider"
      />

      <button
        type="button"
        className="bpm-step"
        aria-label="Increase BPM"
        onClick={() => onChange(clampBpm(bpm + 1))}
        disabled={bpm >= BPM_MAX}
      >
        +
      </button>
    </div>
  );
}
