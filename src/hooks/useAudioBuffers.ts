import { useEffect, useState } from 'react';
import { loadAudioBuffer } from '../lib/audio';

interface MetronomeBuffers {
  readonly tick: AudioBuffer;
  readonly accent: AudioBuffer;
}

export function useAudioBuffers(): MetronomeBuffers | null {
  const [buffers, setBuffers] = useState<MetronomeBuffers | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      loadAudioBuffer(`${import.meta.env.BASE_URL}sounds/tick.wav`),
      loadAudioBuffer(`${import.meta.env.BASE_URL}sounds/tick-accent.wav`),
    ])
      .then(([tick, accent]) => {
        if (!cancelled) setBuffers({ tick, accent });
      })
      .catch((err: unknown) => {
        console.error('Failed to load audio buffers:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return buffers;
}
