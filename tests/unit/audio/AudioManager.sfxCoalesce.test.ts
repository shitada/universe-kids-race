import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Web Audio API (mirrors AudioManager.test.ts patterns)
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

const { AudioManager } = await import('../../../src/game/audio/AudioManager');

type Mgr = InstanceType<typeof AudioManager>;

function getCtx(mgr: Mgr): MockAudioContext {
  // Tests need to advance currentTime on the underlying mock context.
  return (mgr as unknown as { ctx: MockAudioContext }).ctx;
}

describe('AudioManager SFX coalescing', () => {
  let audioManager: Mgr;

  beforeEach(() => {
    audioManager = new AudioManager();
    vi.clearAllMocks();
    audioManager.initSync();
  });

  it('coalesces multiple same-type playSFX calls within the debounce window', () => {
    const ctx = getCtx(audioManager);
    ctx.currentTime = 0;
    for (let i = 0; i < 5; i++) {
      audioManager.playSFX('starCollect');
    }
    // starCollect uses playSweep -> exactly 1 oscillator created.
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
  });

  it('plays again after the coalesce window elapses', () => {
    const ctx = getCtx(audioManager);
    ctx.currentTime = 0;
    audioManager.playSFX('starCollect');
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);

    // Inside window: should be dropped.
    ctx.currentTime = 0.02;
    audioManager.playSFX('starCollect');
    expect(ctx.createOscillator).toHaveBeenCalledTimes(1);

    // After window (35ms > 30ms): should play again.
    ctx.currentTime = 0.035;
    audioManager.playSFX('starCollect');
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
  });

  it('tracks coalescing per SFX type independently', () => {
    const ctx = getCtx(audioManager);
    ctx.currentTime = 0;
    audioManager.playSFX('starCollect'); // 1 oscillator (sweep)
    audioManager.playSFX('meteoriteHit'); // 1 oscillator (sweep)
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);

    // Repeats of either type within the window are dropped.
    audioManager.playSFX('starCollect');
    audioManager.playSFX('meteoriteHit');
    expect(ctx.createOscillator).toHaveBeenCalledTimes(2);
  });

  it('does not throw and does not create nodes after dispose()', () => {
    audioManager.dispose();
    expect(() => audioManager.playSFX('starCollect')).not.toThrow();
    // After dispose, ctx is null; getCtx would be null. Just ensure no throw.
    const ctx = (audioManager as unknown as { ctx: MockAudioContext | null }).ctx;
    expect(ctx).toBeNull();
  });

  it('clears coalesce timestamps on dispose so re-init plays immediately', () => {
    const ctx1 = getCtx(audioManager);
    ctx1.currentTime = 10;
    audioManager.playSFX('starCollect');
    expect(ctx1.createOscillator).toHaveBeenCalledTimes(1);

    audioManager.dispose();
    audioManager.initSync();
    const ctx2 = getCtx(audioManager);
    // Fresh context starts at currentTime=0 (< previously stored 10s),
    // so without dispose-time clearing the next play could spuriously fire
    // or be incorrectly suppressed depending on direction. Verify it plays.
    ctx2.currentTime = 0;
    audioManager.playSFX('starCollect');
    expect(ctx2.createOscillator).toHaveBeenCalledTimes(1);
  });
});
