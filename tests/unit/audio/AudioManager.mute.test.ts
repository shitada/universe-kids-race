import { describe, it, expect, beforeEach, vi } from 'vitest';

// Web Audio API mocks (mirrors AudioManager.test.ts)
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
  frequency = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() };
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
  onended: (() => void) | null = null;
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
  currentTime = 1.234;
  sampleRate = 44100;
  resume = vi.fn().mockImplementation(async () => { this.state = 'running'; });
  suspend = vi.fn().mockImplementation(async () => { this.state = 'suspended'; });
  close = vi.fn().mockImplementation(async () => { this.state = 'closed'; });
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  createBufferSource = vi.fn(() => new MockAudioBufferSourceNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createBuffer = vi.fn(() => new MockAudioBuffer());
  destination = { __label: 'destination' };
}

vi.stubGlobal('AudioContext', MockAudioContext);

const { AudioManager } = await import('../../../src/game/audio/AudioManager');

describe('AudioManager mute control', () => {
  let am: InstanceType<typeof AudioManager>;

  beforeEach(() => {
    vi.stubGlobal('AudioContext', MockAudioContext);
    am = new AudioManager();
    vi.clearAllMocks();
  });

  describe('default state', () => {
    it('is unmuted by default', () => {
      expect(am.isMuted()).toBe(false);
    });

    it('isMuted() is safe to call before initialization', () => {
      expect(() => am.isMuted()).not.toThrow();
    });

    it('setMuted() before initialization records intent without throwing', () => {
      expect(() => am.setMuted(true)).not.toThrow();
      expect(am.isMuted()).toBe(true);
    });

    it('toggleMute() before initialization toggles the recorded state', () => {
      expect(am.toggleMute()).toBe(true);
      expect(am.toggleMute()).toBe(false);
    });
  });

  describe('master gain wiring', () => {
    it('initSync() creates a master gain connected to ctx.destination', () => {
      am.initSync();
      const ctx = (am as any).ctx;
      expect(ctx.createGain).toHaveBeenCalledTimes(1);
      const masterGain = (am as any).masterGain;
      expect(masterGain).not.toBeNull();
      expect(masterGain.connect).toHaveBeenCalledWith(ctx.destination);
      expect(masterGain.gain.value).toBe(1);
      am.dispose();
    });

    it('init() (async) also creates a master gain connected to ctx.destination', async () => {
      await am.init();
      const ctx = (am as any).ctx;
      const masterGain = (am as any).masterGain;
      expect(masterGain).not.toBeNull();
      expect(masterGain.connect).toHaveBeenCalledWith(ctx.destination);
      am.dispose();
    });

    it('master gain initial value reflects pre-init mute state', () => {
      am.setMuted(true);
      am.initSync();
      const masterGain = (am as any).masterGain;
      expect(masterGain.gain.value).toBe(0);
      am.dispose();
    });

    it('all BGM voices route through the master gain (no direct ctx.destination connect)', () => {
      am.initSync();
      const ctx = (am as any).ctx;
      const masterGain = (am as any).masterGain;
      ctx.createGain.mockClear();

      am.playBGM(1);

      const voiceGains = ctx.createGain.mock.results.map((r: any) => r.value);
      expect(voiceGains.length).toBeGreaterThan(0);
      for (const g of voiceGains) {
        // Each voice gain should be connected to the master gain.
        expect(g.connect).toHaveBeenCalledWith(masterGain);
        // None of them should be wired directly to ctx.destination.
        const destCalls = g.connect.mock.calls.filter((c: any[]) => c[0] === ctx.destination);
        expect(destCalls).toHaveLength(0);
      }
      am.dispose();
    });

    it('boost SFX routes through the master gain', () => {
      am.initSync();
      const ctx = (am as any).ctx;
      const masterGain = (am as any).masterGain;

      am.startBoostSFX();

      const boostGain = (am as any).boostNoiseGain as MockGainNode;
      expect(boostGain).not.toBeNull();
      expect(boostGain.connect).toHaveBeenCalledWith(masterGain);
      const destCalls = boostGain.connect.mock.calls.filter((c: any[]) => c[0] === ctx.destination);
      expect(destCalls).toHaveLength(0);
      am.dispose();
    });

    it('one-shot SFX route through the master gain', () => {
      am.initSync();
      const ctx = (am as any).ctx;
      const masterGain = (am as any).masterGain;
      ctx.createGain.mockClear();

      am.playSFX('starCollect');

      const sfxGain = ctx.createGain.mock.results[0].value;
      expect(sfxGain.connect).toHaveBeenCalledWith(masterGain);
      const destCalls = sfxGain.connect.mock.calls.filter((c: any[]) => c[0] === ctx.destination);
      expect(destCalls).toHaveLength(0);
      am.dispose();
    });
  });

  describe('setMuted() after initialization', () => {
    it('schedules a setTargetAtTime ramp toward 0 when muting', () => {
      am.initSync();
      const ctx = (am as any).ctx;
      const masterGain = (am as any).masterGain as MockGainNode;
      masterGain.gain.setTargetAtTime.mockClear();

      am.setMuted(true);

      expect(masterGain.gain.setTargetAtTime).toHaveBeenCalledTimes(1);
      const [target, when, timeConstant] = masterGain.gain.setTargetAtTime.mock.calls[0];
      expect(target).toBe(0);
      expect(when).toBe(ctx.currentTime);
      // ~10ms time constant per implementation
      expect(timeConstant).toBeCloseTo(0.01, 5);
      expect(am.isMuted()).toBe(true);
      am.dispose();
    });

    it('schedules a ramp toward 1 when unmuting', () => {
      am.initSync();
      const masterGain = (am as any).masterGain as MockGainNode;
      am.setMuted(true);
      masterGain.gain.setTargetAtTime.mockClear();

      am.setMuted(false);

      const [target] = masterGain.gain.setTargetAtTime.mock.calls[0];
      expect(target).toBe(1);
      expect(am.isMuted()).toBe(false);
      am.dispose();
    });

    it('toggleMute() returns the new state and applies it to the master gain', () => {
      am.initSync();
      const masterGain = (am as any).masterGain as MockGainNode;
      masterGain.gain.setTargetAtTime.mockClear();

      const r1 = am.toggleMute();
      expect(r1).toBe(true);
      expect(am.isMuted()).toBe(true);

      const r2 = am.toggleMute();
      expect(r2).toBe(false);
      expect(am.isMuted()).toBe(false);

      expect(masterGain.gain.setTargetAtTime).toHaveBeenCalledTimes(2);
      am.dispose();
    });

    it('repeated setMuted(true) calls remain idempotent (still muted)', () => {
      am.initSync();
      am.setMuted(true);
      am.setMuted(true);
      am.setMuted(true);
      expect(am.isMuted()).toBe(true);
      am.dispose();
    });

    it('falls back to direct gain.value assignment if setTargetAtTime throws', () => {
      am.initSync();
      const masterGain = (am as any).masterGain as MockGainNode;
      masterGain.gain.setTargetAtTime.mockImplementation(() => {
        throw new Error('not supported');
      });

      expect(() => am.setMuted(true)).not.toThrow();
      expect(masterGain.gain.value).toBe(0);
      am.dispose();
    });
  });

  describe('dispose() cleanup', () => {
    it('disconnects and clears the master gain', () => {
      am.initSync();
      const masterGain = (am as any).masterGain as MockGainNode;
      am.dispose();
      expect(masterGain.disconnect).toHaveBeenCalled();
      expect((am as any).masterGain).toBeNull();
    });
  });
});
