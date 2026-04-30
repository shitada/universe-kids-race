import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Web Audio API (mirrors AudioManager.sfxCoalesce.test.ts patterns)
class MockGainNode {
  gain = {
    value: 0,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
    setTargetAtTime: vi.fn(),
  };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
}

class MockOscillatorNode {
  type: OscillatorType = 'sine';
  frequency = {
    value: 0,
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
  };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
  onended: (() => void) | null = null;
}

class MockAudioContext {
  state: AudioContextState = 'suspended';
  currentTime = 0;
  sampleRate = 44100;
  resume = vi.fn().mockImplementation(async () => { this.state = 'running'; });
  suspend = vi.fn().mockImplementation(async () => { this.state = 'suspended'; });
  close = vi.fn().mockImplementation(async () => { this.state = 'closed'; });
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  createBufferSource = vi.fn();
  createBiquadFilter = vi.fn();
  createBuffer = vi.fn();
  destination = {};
}

vi.stubGlobal('AudioContext', MockAudioContext);

const { AudioManager, BGM_CONFIGS } = await import('../../../src/game/audio/AudioManager');

type Mgr = InstanceType<typeof AudioManager>;

function getCtx(mgr: Mgr): MockAudioContext {
  return (mgr as unknown as { ctx: MockAudioContext }).ctx;
}

describe('AudioManager BGM muted short-voice skip', () => {
  let audioManager: Mgr;
  // Stage 1 config: 1 bass + 3 pad oscillators (chord[0].length === 3)
  const STAGE = 1;
  const initialOscCount =
    1 + BGM_CONFIGS[STAGE].chords[0].length;
  const beatIntervalMs = (60 / BGM_CONFIGS[STAGE].tempo) * 1000;

  beforeEach(() => {
    vi.useFakeTimers();
    audioManager = new AudioManager();
    audioManager.initSync();
  });

  afterEach(() => {
    audioManager.dispose();
    vi.useRealTimers();
  });

  it('does not create short-lived voices while muted', () => {
    audioManager.setMuted(true);
    audioManager.playBGM(STAGE);
    const ctx = getCtx(audioManager);
    // Initial bass + pad nodes are created synchronously by playBGM().
    // The first tick() call also runs synchronously at the end of playBGM.
    const baselineOsc = ctx.createOscillator.mock.calls.length;
    const baselineGain = ctx.createGain.mock.calls.length;
    expect(baselineOsc).toBe(initialOscCount);

    // Advance through several beats. While muted no new oscillators/gains
    // should be allocated for arpeggio/melody.
    ctx.currentTime = 5;
    vi.advanceTimersByTime(beatIntervalMs * 5 + 5);

    expect(ctx.createOscillator.mock.calls.length).toBe(baselineOsc);
    expect(ctx.createGain.mock.calls.length).toBe(baselineGain);
  });

  it('creates short-lived voices each beat when not muted (regression guard)', () => {
    audioManager.setMuted(false);
    audioManager.playBGM(STAGE);
    const ctx = getCtx(audioManager);
    // playBGM() runs the first tick synchronously, which when unmuted also
    // emits arpeggio + melody voices. Capture this baseline before stepping.
    const baselineOsc = ctx.createOscillator.mock.calls.length;
    expect(baselineOsc).toBeGreaterThanOrEqual(initialOscCount);

    ctx.currentTime = 5;
    vi.advanceTimersByTime(beatIntervalMs * 5 + 5);

    // 5 ticks * (arpeggio + melody) = 10 additional oscillators at minimum.
    expect(ctx.createOscillator.mock.calls.length).toBeGreaterThanOrEqual(
      baselineOsc + 5 * 2
    );
  });

  it('resumes short-lived voice generation after unmute', () => {
    audioManager.setMuted(true);
    audioManager.playBGM(STAGE);
    const ctx = getCtx(audioManager);
    const baselineOsc = ctx.createOscillator.mock.calls.length;

    // Advance a few beats while muted - no new oscillators.
    ctx.currentTime = 2;
    vi.advanceTimersByTime(beatIntervalMs * 3 + 5);
    expect(ctx.createOscillator.mock.calls.length).toBe(baselineOsc);

    // Unmute and advance one more beat - short voices must resume.
    audioManager.setMuted(false);
    ctx.currentTime = 4;
    vi.advanceTimersByTime(beatIntervalMs + 5);

    expect(ctx.createOscillator.mock.calls.length).toBeGreaterThanOrEqual(
      baselineOsc + 2
    );
  });
});
