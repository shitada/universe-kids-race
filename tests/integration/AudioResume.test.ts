// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

class MockGainNode {
  gain = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn() };
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

  describe('bfcache / focus resume paths (iPad Safari)', () => {
    let windowListeners: Record<string, EventListener[]>;

    beforeEach(() => {
      windowListeners = {};
      vi.spyOn(window, 'addEventListener').mockImplementation(
        (event: string, handler: EventListenerOrEventListenerObject) => {
          if (!windowListeners[event]) windowListeners[event] = [];
          windowListeners[event].push(handler as EventListener);
        },
      );
    });

    function wireResumeHandlers(resume: () => void): void {
      window.addEventListener('pageshow', (event: Event) => {
        if ((event as PageTransitionEvent).persisted) resume();
      });
      window.addEventListener('focus', () => resume());
    }

    it('pageshow with persisted=true triggers ensureResumed() and gameLoop.resume()', () => {
      audioManager.initSync();
      const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      const gameLoop = { resume: vi.fn(), pause: vi.fn() };
      const resume = () => {
        gameLoop.resume();
        audioManager.ensureResumed();
      };
      wireResumeHandlers(resume);

      const evt = new Event('pageshow') as PageTransitionEvent;
      Object.defineProperty(evt, 'persisted', { value: true, configurable: true });
      for (const h of windowListeners['pageshow'] ?? []) h(evt);

      expect(gameLoop.resume).toHaveBeenCalledTimes(1);
      expect(ctx.resume).toHaveBeenCalledTimes(1);
    });

    it('pageshow with persisted=false does NOT trigger resume', () => {
      audioManager.initSync();
      const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      const gameLoop = { resume: vi.fn(), pause: vi.fn() };
      wireResumeHandlers(() => {
        gameLoop.resume();
        audioManager.ensureResumed();
      });

      const evt = new Event('pageshow') as PageTransitionEvent;
      Object.defineProperty(evt, 'persisted', { value: false, configurable: true });
      for (const h of windowListeners['pageshow'] ?? []) h(evt);

      expect(gameLoop.resume).not.toHaveBeenCalled();
      expect(ctx.resume).not.toHaveBeenCalled();
    });

    it('window focus triggers ensureResumed() and gameLoop.resume()', () => {
      audioManager.initSync();
      const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      const gameLoop = { resume: vi.fn(), pause: vi.fn() };
      wireResumeHandlers(() => {
        gameLoop.resume();
        audioManager.ensureResumed();
      });

      for (const h of windowListeners['focus'] ?? []) h(new Event('focus'));

      expect(gameLoop.resume).toHaveBeenCalledTimes(1);
      expect(ctx.resume).toHaveBeenCalledTimes(1);
    });

    it('focus from interrupted state (iOS) calls ctx.resume()', () => {
      audioManager.initSync();
      const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
      ctx.state = 'interrupted' as AudioContextState;
      ctx.resume.mockClear();

      wireResumeHandlers(() => audioManager.ensureResumed());
      for (const h of windowListeners['focus'] ?? []) h(new Event('focus'));

      expect(ctx.resume).toHaveBeenCalledTimes(1);
    });

    it('repeated resume events are idempotent (no double-loop / double-play)', () => {
      audioManager.initSync();
      const ctx = (audioManager as unknown as { ctx: MockAudioContext }).ctx;
      ctx.state = 'running';
      ctx.resume.mockClear();

      let runCount = 0;
      const gameLoop = {
        resume: vi.fn(() => { runCount++; }),
        pause: vi.fn(),
      };
      // Mimic GameLoop.resume() idempotency: only acts when paused.
      let paused = false;
      gameLoop.resume.mockImplementation(() => {
        if (!paused) return;
        paused = false;
        runCount++;
      });

      wireResumeHandlers(() => {
        gameLoop.resume();
        audioManager.ensureResumed();
      });

      // Fire focus 3 times and a persisted pageshow — all should be safe.
      for (let i = 0; i < 3; i++) {
        for (const h of windowListeners['focus'] ?? []) h(new Event('focus'));
      }
      const evt = new Event('pageshow') as PageTransitionEvent;
      Object.defineProperty(evt, 'persisted', { value: true, configurable: true });
      for (const h of windowListeners['pageshow'] ?? []) h(evt);

      // ctx.state is 'running' so resume must NOT be called.
      expect(ctx.resume).not.toHaveBeenCalled();
      // gameLoop was never paused, so no extra runs.
      expect(runCount).toBe(0);
    });
  });
});
