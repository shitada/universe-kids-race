import { describe, it, expect, beforeEach, vi } from 'vitest';

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
  createdOscillators: MockOscillatorNode[] = [];
  createdGains: MockGainNode[] = [];
  resume = vi.fn().mockImplementation(async () => { this.state = 'running'; });
  suspend = vi.fn().mockImplementation(async () => { this.state = 'suspended'; });
  close = vi.fn().mockImplementation(async () => { this.state = 'closed'; });
  createOscillator = vi.fn(() => {
    const o = new MockOscillatorNode();
    this.createdOscillators.push(o);
    return o;
  });
  createGain = vi.fn(() => {
    const g = new MockGainNode();
    this.createdGains.push(g);
    return g;
  });
  createBufferSource = vi.fn(() => new MockAudioBufferSourceNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
  createBuffer = vi.fn(() => new MockAudioBuffer());
  destination = {};
}

vi.stubGlobal('AudioContext', MockAudioContext);

const { AudioManager } = await import('../../../src/game/audio/AudioManager');

function getCtx(am: any): MockAudioContext {
  return am.ctx as MockAudioContext;
}

function snapshotNewNodes(ctx: MockAudioContext, prevOscCount: number, prevGainCount: number) {
  return {
    oscs: ctx.createdOscillators.slice(prevOscCount),
    gains: ctx.createdGains.slice(prevGainCount),
  };
}

describe('AudioManager SFX one-shot cleanup', () => {
  let am: any;
  let ctx: MockAudioContext;

  beforeEach(() => {
    am = new AudioManager();
    am.initSync();
    ctx = getCtx(am);
  });

  it('playSweep sets onended on the oscillator', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('starCollect'); // playSweep
    const { oscs } = snapshotNewNodes(ctx, prevO, prevG);
    expect(oscs.length).toBeGreaterThan(0);
    for (const osc of oscs) {
      expect(typeof osc.onended).toBe('function');
    }
  });

  it('playSweep onended disconnects oscillator and gain', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('meteoriteHit'); // playSweep
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    expect(oscs).toHaveLength(1);
    expect(gains).toHaveLength(1);
    oscs[0].onended!();
    expect(oscs[0].disconnect).toHaveBeenCalledTimes(1);
    expect(gains[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it('playArpeggio sets onended on every oscillator', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('rainbowCollect'); // playArpeggio with 3 freqs
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    expect(oscs).toHaveLength(3);
    expect(gains).toHaveLength(3);
    for (const osc of oscs) {
      expect(typeof osc.onended).toBe('function');
    }
  });

  it('playArpeggio onended disconnects each oscillator/gain pair', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('stageClear'); // playArpeggio with 4 freqs
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    expect(oscs).toHaveLength(4);
    expect(gains).toHaveLength(4);
    for (let i = 0; i < oscs.length; i++) {
      oscs[i].onended!();
      expect(oscs[i].disconnect).toHaveBeenCalledTimes(1);
      expect(gains[i].disconnect).toHaveBeenCalledTimes(1);
    }
  });

  it('continues gain.disconnect even if osc.disconnect throws', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('boost'); // playSweep
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    oscs[0].disconnect = vi.fn(() => { throw new Error('boom'); });
    expect(() => oscs[0].onended!()).not.toThrow();
    expect(gains[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it('does not throw if gain.disconnect itself throws', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('boostReady'); // playSweep
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    gains[0].disconnect = vi.fn(() => { throw new Error('boom'); });
    expect(() => oscs[0].onended!()).not.toThrow();
    expect(oscs[0].disconnect).toHaveBeenCalledTimes(1);
  });

  it('boostDenied uses playSweep and registers cleanup', () => {
    const prevO = ctx.createdOscillators.length;
    const prevG = ctx.createdGains.length;
    am.playSFX('boostDenied');
    const { oscs, gains } = snapshotNewNodes(ctx, prevO, prevG);
    expect(oscs).toHaveLength(1);
    expect(gains).toHaveLength(1);
    expect(oscs[0].type).toBe('triangle');
    expect(typeof oscs[0].onended).toBe('function');
    oscs[0].onended!();
    expect(oscs[0].disconnect).toHaveBeenCalledTimes(1);
    expect(gains[0].disconnect).toHaveBeenCalledTimes(1);
  });
});
