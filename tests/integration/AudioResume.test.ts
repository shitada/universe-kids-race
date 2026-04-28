// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

class MockGainNode {
  gain = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
}

class MockOscillatorNode {
  type: OscillatorType = 'sine';
  frequency = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class MockAudioBuffer {
  numberOfChannels = 1;
  length = 44100;
  sampleRate = 44100;
  private data = new Float32Array(44100);
  getChannelData = vi.fn().mockReturnValue(this.data);
}

class MockAudioBufferSourceNode {
  buffer: any = null;
  loop = false;
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}

class MockBiquadFilterNode {
  type: BiquadFilterType = 'lowpass';
  frequency = { value: 350 };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
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
  createBufferSource = vi.fn(() => new MockAudioBufferSourceNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createBuffer = vi.fn(() => new MockAudioBuffer());
  destination = {};
}

vi.stubGlobal('AudioContext', MockAudioContext);

const { AudioManager } = await import('../../src/game/audio/AudioManager');

describe('AudioResume integration (T003)', () => {
  let audioManager: InstanceType<typeof AudioManager>;
  let listeners: Record<string, EventListener[]>;

  beforeEach(() => {
    audioManager = new AudioManager();
    listeners = {};
    vi.spyOn(document, 'addEventListener').mockImplementation((event: string, handler: EventListener) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
    });
  });

  afterEach(() => {
    audioManager.dispose();
    vi.restoreAllMocks();
  });

  it('ensureResumed() is called when document becomes visible', () => {
    audioManager.initSync();
    const spy = vi.spyOn(audioManager, 'ensureResumed');

    // Simulate visibilitychange registration as done in main.ts
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        audioManager.ensureResumed();
      }
    });

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    for (const handler of listeners['visibilitychange'] ?? []) {
      handler(new Event('visibilitychange'));
    }

    expect(spy).toHaveBeenCalled();
  });

  it('suspend() is called when document becomes hidden', () => {
    audioManager.initSync();
    audioManager.playBGM(1);
    const ctx = (audioManager as any).ctx as { suspend: ReturnType<typeof vi.fn>; state: AudioContextState };
    // Simulate running state (initSync's resume is async; force running for the test)
    ctx.state = 'running';
    ctx.suspend.mockClear();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audioManager.suspend();
      } else {
        audioManager.ensureResumed();
      }
    });

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    for (const handler of listeners['visibilitychange'] ?? []) {
      handler(new Event('visibilitychange'));
    }

    expect(ctx.suspend).toHaveBeenCalledTimes(1);
    expect(ctx.state).toBe('suspended');
  });

  it('suspend() transitions AudioContext to suspended on hidden, and ensureResumed() restores running on visible', () => {
    audioManager.initSync();
    const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
    ctx.state = 'running';

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audioManager.suspend();
      } else {
        audioManager.ensureResumed();
      }
    });

    // Hidden -> suspended
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    for (const handler of listeners['visibilitychange'] ?? []) {
      handler(new Event('visibilitychange'));
    }
    expect(ctx.suspend).toHaveBeenCalled();
    expect(ctx.state).toBe('suspended');

    // Visible -> running
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    for (const handler of listeners['visibilitychange'] ?? []) {
      handler(new Event('visibilitychange'));
    }
    expect(ctx.resume).toHaveBeenCalled();
    expect(ctx.state).toBe('running');
  });

  it('ctx.suspend() is called when document becomes hidden via visibilitychange', () => {
    audioManager.initSync();
    // After initSync, ctx.resume() was called; emulate the running state for this test.
    const ctx = (audioManager as any).ctx as InstanceType<typeof MockAudioContext>;
    ctx.state = 'running';

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audioManager.suspend();
      }
    });

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    for (const handler of listeners['visibilitychange'] ?? []) {
      handler(new Event('visibilitychange'));
    }

    expect(ctx.suspend).toHaveBeenCalledTimes(1);
  });

  it('suspend() is idempotent when ctx is already suspended', () => {
    audioManager.initSync();
    const ctx = (audioManager as any).ctx as InstanceType<typeof MockAudioContext>;
    ctx.state = 'suspended';

    audioManager.suspend();
    audioManager.suspend();

    expect(ctx.suspend).not.toHaveBeenCalled();
  });
});
