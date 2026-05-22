import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../public/sounds');

const SAMPLE_RATE = 44100;

function encodeWav(samples) {
  const byteRate = SAMPLE_RATE * 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }
  return buffer;
}

function generateTick({ durationMs, frequency, harmonics = [], decay = 60 }) {
  const length = Math.floor((durationMs / 1000) * SAMPLE_RATE);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-decay * t);
    let signal = Math.sin(2 * Math.PI * frequency * t);
    for (const h of harmonics) {
      signal += h.amp * Math.sin(2 * Math.PI * h.freq * t);
    }
    samples[i] = signal * env * 0.6;
  }
  return samples;
}

const tickWeak = generateTick({
  durationMs: 60,
  frequency: 1200,
  harmonics: [{ freq: 2400, amp: 0.3 }],
  decay: 80,
});

const tickAccent = generateTick({
  durationMs: 80,
  frequency: 1600,
  harmonics: [
    { freq: 800, amp: 0.4 },
    { freq: 3200, amp: 0.2 },
  ],
  decay: 60,
});

writeFileSync(resolve(outDir, 'tick.wav'), encodeWav(tickWeak));
writeFileSync(resolve(outDir, 'tick-accent.wav'), encodeWav(tickAccent));

console.log(`Generated:
  ${resolve(outDir, 'tick.wav')}
  ${resolve(outDir, 'tick-accent.wav')}`);
