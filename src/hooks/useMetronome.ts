import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { getAudioContext, playBufferAt, unlockAudioContext } from '../lib/audio';

interface UseMetronomeArgs {
  readonly bpm: number;
  readonly tickBuffer: AudioBuffer | null;
  readonly pendulumRef: RefObject<SVGGElement | null>;
}

interface UseMetronomeResult {
  readonly isPlaying: boolean;
  readonly start: () => Promise<void>;
  readonly stop: () => void;
  readonly toggle: () => Promise<void>;
}

const MAX_ANGLE_DEG = 30;
const SCHEDULE_AHEAD_SEC = 0.1;
const SCHEDULER_INTERVAL_MS = 25;
const FRAME_LEAD_SEC = 1 / 60;
const PLAY_START_DELAY_SEC = 0.1;

function applyAngle(el: SVGGElement | null, angle: number): void {
  if (el) el.style.transform = `rotate(${angle}deg)`;
}

function visualLeadFor(ctx: AudioContext): number {
  const base = ctx.baseLatency ?? 0;
  const output = ctx.outputLatency ?? 0;
  return FRAME_LEAD_SEC - base - output;
}

export function useMetronome({ bpm, tickBuffer, pendulumRef }: UseMetronomeArgs): UseMetronomeResult {
  const [isPlaying, setIsPlaying] = useState(false);

  const bpmRef = useRef(bpm);
  const startTimeRef = useRef(0);
  const nextBeatIndexRef = useRef(0);
  const tickBufferRef = useRef<AudioBuffer | null>(tickBuffer);
  const rafIdRef = useRef<number | null>(null);
  const schedulerIdRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    applyAngle(pendulumRef.current, MAX_ANGLE_DEG);
  }, [pendulumRef]);

  useEffect(() => {
    tickBufferRef.current = tickBuffer;
  }, [tickBuffer]);

  useEffect(() => {
    const oldBpm = bpmRef.current;
    if (isPlaying && oldBpm !== bpm) {
      const ctx = getAudioContext();
      const oldPeriod = 60 / oldBpm;
      const newPeriod = 60 / bpm;
      const elapsed = ctx.currentTime - startTimeRef.current;
      const phase = elapsed / oldPeriod;
      startTimeRef.current = ctx.currentTime - phase * newPeriod;
      nextBeatIndexRef.current = Math.ceil(phase);
    }
    bpmRef.current = bpm;
  }, [bpm, isPlaying]);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    const buffer = tickBufferRef.current;
    if (!buffer) return;
    const period = 60 / bpmRef.current;
    while (true) {
      const beatTime = startTimeRef.current + nextBeatIndexRef.current * period;
      if (beatTime >= ctx.currentTime + SCHEDULE_AHEAD_SEC) break;
      if (beatTime >= ctx.currentTime) {
        playBufferAt(buffer, beatTime);
      }
      nextBeatIndexRef.current += 1;
    }
  }, []);

  const animate = useCallback(() => {
    const ctx = getAudioContext();
    const period = 60 / bpmRef.current;
    const lead = visualLeadFor(ctx);
    const elapsed = (ctx.currentTime + lead) - startTimeRef.current;
    const angle = MAX_ANGLE_DEG * Math.cos((Math.PI * elapsed) / period);
    applyAngle(pendulumRef.current, angle);
    rafIdRef.current = requestAnimationFrame(animate);
  }, [pendulumRef]);

  const start = useCallback(async () => {
    if (isPlaying) return;
    await unlockAudioContext();
    const ctx = getAudioContext();
    startTimeRef.current = ctx.currentTime + PLAY_START_DELAY_SEC;
    nextBeatIndexRef.current = 0;
    setIsPlaying(true);
    scheduler();
    schedulerIdRef.current = window.setInterval(scheduler, SCHEDULER_INTERVAL_MS);
    rafIdRef.current = requestAnimationFrame(animate);
  }, [animate, isPlaying, scheduler]);

  const stop = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    if (schedulerIdRef.current !== null) {
      clearInterval(schedulerIdRef.current);
      schedulerIdRef.current = null;
    }
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    applyAngle(pendulumRef.current, MAX_ANGLE_DEG);
  }, [isPlaying, pendulumRef]);

  const toggle = useCallback(async () => {
    if (isPlaying) stop();
    else await start();
  }, [isPlaying, start, stop]);

  useEffect(() => {
    return () => {
      if (schedulerIdRef.current !== null) clearInterval(schedulerIdRef.current);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return { isPlaying, start, stop, toggle };
}
