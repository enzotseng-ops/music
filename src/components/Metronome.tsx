import { useRef, useState } from 'react';
import { BPM_DEFAULT, clampBpm } from '../lib/tempo';
import { useAudioBuffers } from '../hooks/useAudioBuffers';
import { useMetronome } from '../hooks/useMetronome';
import { useTheme } from '../hooks/useTheme';
import { Pendulum } from './Pendulum';
import { BpmDisplay } from './BpmDisplay';
import { BpmControls } from './BpmControls';
import { PlayButton } from './PlayButton';
import { ThemeToggle } from './ThemeToggle';

export function Metronome() {
  const [bpm, setBpm] = useState(BPM_DEFAULT);
  const buffers = useAudioBuffers();
  const { theme, toggleTheme } = useTheme();
  const pendulumRef = useRef<SVGGElement>(null);
  const { isPlaying, toggle } = useMetronome({
    bpm,
    tickBuffer: buffers?.tick ?? null,
    pendulumRef,
  });

  return (
    <div className="metronome">
      <header className="metronome-header">
        <h1>Metronome</h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <div className="pendulum-wrapper">
        <Pendulum ref={pendulumRef} />
      </div>

      <BpmDisplay bpm={bpm} />

      <BpmControls bpm={bpm} onChange={next => setBpm(clampBpm(next))} />

      <PlayButton
        isPlaying={isPlaying}
        onToggle={() => { void toggle(); }}
        disabled={!buffers}
      />

      {!buffers && <p className="loading">Loading sounds…</p>}
    </div>
  );
}
