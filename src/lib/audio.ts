let ctx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
  }
  return ctx;
}

export async function unlockAudioContext(): Promise<void> {
  const c = getAudioContext();
  if (c.state === 'suspended') {
    await c.resume();
  }
}

export async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return await getAudioContext().decodeAudioData(arrayBuffer);
}

export function playBufferAt(buffer: AudioBuffer, when: number, gain = 1): void {
  const c = getAudioContext();
  const source = c.createBufferSource();
  source.buffer = buffer;
  const gainNode = c.createGain();
  gainNode.gain.value = gain;
  source.connect(gainNode).connect(c.destination);
  source.start(when);
}
