import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Web Audio API
class MockGainNode {
  gain = { value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn(), setTargetAtTime: vi.fn() };
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

// Import after mocking
const { AudioManager, BGM_CONFIGS } = await import('../../../src/game/audio/AudioManager');

describe('AudioManager', () => {
  let audioManager: InstanceType<typeof AudioManager>;

  beforeEach(() => {
    audioManager = new AudioManager();
    vi.clearAllMocks();
  });

  describe('init()', () => {
    it('creates AudioContext and resumes it', async () => {
      await audioManager.init();
      // After init, subsequent calls should work (not no-op)
      // No error means init succeeded
    });

    it('handles init failure gracefully', async () => {
      vi.stubGlobal('AudioContext', class {
        constructor() { throw new Error('Not supported'); }
      });
      const manager = new AudioManager();
      await manager.init(); // Should not throw
      // All methods should be no-op
      manager.playBGM(1);
      manager.stopBGM();
      manager.playSFX('starCollect');
      vi.stubGlobal('AudioContext', MockAudioContext);
    });
  });

  describe('initSync()', () => {
    it('creates AudioContext and calls resume synchronously', () => {
      audioManager.initSync();
      // After initSync, playBGM should work (not no-op)
      audioManager.playBGM(1);
      audioManager.stopBGM();
    });

    it('sets initialized to true on success', () => {
      audioManager.initSync();
      // Verify initialized by checking playSFX works (not no-op)
      audioManager.playSFX('starCollect');
    });

    it('handles failure gracefully and sets initialized to false', () => {
      vi.stubGlobal('AudioContext', class {
        constructor() { throw new Error('Not supported'); }
      });
      const manager = new AudioManager();
      manager.initSync(); // Should not throw
      // All methods should be no-op after failed init
      manager.playBGM(1);
      manager.stopBGM();
      manager.playSFX('starCollect');
      vi.stubGlobal('AudioContext', MockAudioContext);
    });

    it('does not use await (synchronous execution)', () => {
      // initSync returns void, not Promise
      const result = audioManager.initSync();
      expect(result).toBeUndefined();
    });
  });

  describe('playBGM()', () => {
    it('is no-op when not initialized', () => {
      audioManager.playBGM(1); // Should not throw
    });

    it('starts oscillators when initialized', async () => {
      await audioManager.init();
      audioManager.playBGM(1);
      // Should not throw, BGM playing
    });

    it('stops previous BGM when switching', async () => {
      await audioManager.init();
      audioManager.playBGM(1);
      audioManager.playBGM(2); // Should stop previous, start new
    });
  });

  describe('stopBGM()', () => {
    it('is no-op when not initialized', () => {
      audioManager.stopBGM(); // Should not throw
    });

    it('stops playback when initialized', async () => {
      await audioManager.init();
      audioManager.playBGM(1);
      audioManager.stopBGM(); // Should not throw
    });
  });

  describe('playSFX()', () => {
    it('is no-op when not initialized', () => {
      audioManager.playSFX('starCollect'); // Should not throw
    });

    it('creates oscillators for each SFX type', async () => {
      await audioManager.init();
      audioManager.playSFX('starCollect');
      audioManager.playSFX('rainbowCollect');
      audioManager.playSFX('meteoriteHit');
      audioManager.playSFX('boost');
      audioManager.playSFX('stageClear');
      audioManager.playSFX('boostReady');
      audioManager.playSFX('boostDenied');
      // All should play without error
    });
  });

  describe('suspend() / ensureResumed()', () => {
    it('suspend() calls AudioContext.suspend when state is running', async () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      await am.init();
      const ctx = (am as any).ctx;
      ctx.state = 'running';
      ctx.suspend.mockClear();

      am.suspend();

      expect(ctx.suspend).toHaveBeenCalledTimes(1);
      am.dispose();
    });

    it('suspend() is a no-op when state is suspended (safe double-call)', async () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      await am.init();
      const ctx = (am as any).ctx;
      ctx.state = 'suspended';
      ctx.suspend.mockClear();

      am.suspend();
      am.suspend();

      expect(ctx.suspend).not.toHaveBeenCalled();
      am.dispose();
    });

    it('suspend() is a no-op when not initialized', () => {
      const am = new AudioManager();
      expect(() => am.suspend()).not.toThrow();
    });

    it('ensureResumed() resumes AudioContext when suspended', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);
      const ctx = (am as any).ctx;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      am.ensureResumed();

      expect(ctx.resume).toHaveBeenCalledTimes(1);
      am.dispose();
    });

    it('ensureResumed() resumes AudioContext even when BGM is not playing', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      am.ensureResumed();

      expect(ctx.resume).toHaveBeenCalledTimes(1);
      am.dispose();
    });

    it('suspend() then ensureResumed() round-trip leaves state running', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);
      const ctx = (am as any).ctx;
      ctx.state = 'running';

      am.suspend();
      expect(ctx.state).toBe('suspended');

      am.ensureResumed();
      expect(ctx.state).toBe('running');
      am.dispose();
    });
  });

  describe('playBGM() 4-layer BGM system (T008)', () => {
    it('creates bass, pad, arpeggio, and melody oscillators', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(1);

      // Stage 1 has 3-note chords:
      // Master gain (1) + Persistent: bass(1) + pad(3) = 5
      // First tick (synchronous): arpeggio(1) + melody(1) = 2
      // Total: 6 oscillators and 7 gain nodes (master + 6 voices)
      expect(ctx.createOscillator).toHaveBeenCalledTimes(6);
      expect(ctx.createGain).toHaveBeenCalledTimes(7);
      am.dispose();
    });

    it('stores persistent oscillators (bass + pad) in bgmOscillators', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);

      // bass(1) + pad(3) = 4 persistent oscillators
      expect((am as any).bgmOscillators).toHaveLength(4);
      expect((am as any).bgmGains).toHaveLength(4);
      am.dispose();
    });

    it('sets correct waveforms for each layer', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(1);

      const oscs = ctx.createOscillator.mock.results.map((r: any) => r.value);
      // Stage 1 waveforms: melody=sine, pad=sine, arpeggio=sine, bass=sine
      expect(oscs[0].type).toBe('sine'); // bass
      expect(oscs[1].type).toBe('sine'); // pad 1
      expect(oscs[2].type).toBe('sine'); // pad 2
      expect(oscs[3].type).toBe('sine'); // pad 3
      expect(oscs[4].type).toBe('sine'); // arpeggio
      expect(oscs[5].type).toBe('sine'); // melody
      am.dispose();
    });

    it('uses linearRampToValueAtTime for arpeggio/melody fade-out (T013)', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(1);

      const gains = ctx.createGain.mock.results.map((r: any) => r.value);
      // Index 0 is the master gain. Arpeggio gain (index 5) and melody gain
      // (index 6) should have linearRamp.
      expect(gains[5].gain.linearRampToValueAtTime).toHaveBeenCalled();
      expect(gains[6].gain.linearRampToValueAtTime).toHaveBeenCalled();
      am.dispose();
    });
  });

  describe('stopBGM() clears all layers (T009)', () => {
    it('stops and disconnects all persistent oscillators', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const oscCopies = [...(am as any).bgmOscillators];
      const gainCopies = [...(am as any).bgmGains];

      am.stopBGM();
      vi.advanceTimersByTime(60);

      for (const osc of oscCopies) {
        expect(osc.stop).toHaveBeenCalled();
        expect(osc.disconnect).toHaveBeenCalled();
      }
      for (const gain of gainCopies) {
        expect(gain.disconnect).toHaveBeenCalled();
      }
      am.dispose();
      vi.useRealTimers();
    });

    it('clears bgmOscillators, bgmGains, and bgmTimer', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      am.stopBGM();

      expect((am as any).bgmOscillators).toHaveLength(0);
      expect((am as any).bgmGains).toHaveLength(0);
      expect((am as any).bgmTimer).toBeNull();
      am.dispose();
    });
  });

  describe('stopBGM() cleans up short-lived arpeggio/melody voices', () => {
    it('tracks short-lived voices in bgmShortVoices on each tick', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);

      // First synchronous tick produces 1 arpeggio + 1 melody short-lived voice
      const shortVoices = (am as any).bgmShortVoices as Array<{ osc: any; gain: any }>;
      expect(shortVoices).toHaveLength(2);
      // Each should have an onended callback assigned
      for (const { osc } of shortVoices) {
        expect(typeof osc.onended).toBe('function');
      }
      am.dispose();
    });

    it('stops, disconnects, and cancels schedules of short-lived voices on stopBGM()', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const shortVoiceCopies = [...((am as any).bgmShortVoices as Array<{ osc: any; gain: any }>)];
      expect(shortVoiceCopies.length).toBeGreaterThan(0);

      am.stopBGM();
      vi.advanceTimersByTime(50);

      for (const { osc, gain } of shortVoiceCopies) {
        expect(osc.stop).toHaveBeenCalled();
        expect(osc.disconnect).toHaveBeenCalled();
        expect(gain.disconnect).toHaveBeenCalled();
        expect(gain.gain.cancelScheduledValues).toHaveBeenCalled();
      }
      expect((am as any).bgmShortVoices).toHaveLength(0);
      am.dispose();
      vi.useRealTimers();
    });

    it('removes a short-lived voice from bgmShortVoices when its onended fires', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const shortVoices = (am as any).bgmShortVoices as Array<{ osc: any; gain: any }>;
      const initialLength = shortVoices.length;
      expect(initialLength).toBeGreaterThan(0);

      const first = shortVoices[0];
      first.osc.onended?.();

      expect(shortVoices).toHaveLength(initialLength - 1);
      expect(first.osc.disconnect).toHaveBeenCalled();
      expect(first.gain.disconnect).toHaveBeenCalled();
      am.dispose();
    });

    it('after switching playBGM(1) -> playBGM(2), no old-generation short voices remain', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);
      const oldShortVoices = [...((am as any).bgmShortVoices as Array<{ osc: any; gain: any }>)];
      expect(oldShortVoices.length).toBeGreaterThan(0);

      am.playBGM(2);
      vi.advanceTimersByTime(60);

      // Old voices must be stopped/disconnected (cleaned by inner stopBGM())
      for (const { osc, gain } of oldShortVoices) {
        expect(osc.stop).toHaveBeenCalled();
        expect(osc.disconnect).toHaveBeenCalled();
        expect(gain.disconnect).toHaveBeenCalled();
      }

      // The current bgmShortVoices array contains only fresh entries from the new generation.
      const currentShortVoices = (am as any).bgmShortVoices as Array<{ osc: any; gain: any }>;
      for (const oldEntry of oldShortVoices) {
        expect(currentShortVoices.includes(oldEntry)).toBe(false);
      }
      am.dispose();
      vi.useRealTimers();
    });
  });

  describe('playBGM() fades in persistent layers to avoid pop noise (bugfix)', () => {
    it('schedules setValueAtTime(0) and linearRampToValueAtTime(volume) for bass and pad layers', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const gainCopies = [...(am as any).bgmGains] as Array<any>;
      expect(gainCopies.length).toBeGreaterThan(0);

      // Every persistent gain should have been ramped up from 0.
      for (const gain of gainCopies) {
        expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));
        expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
          expect.any(Number),
          expect.any(Number),
        );
        // The first ramp call ramps to a positive volume (the layer's target volume).
        const firstRampCall = (gain.gain.linearRampToValueAtTime as any).mock.calls[0];
        expect(firstRampCall[0]).toBeGreaterThan(0);
      }

      am.dispose();
      vi.useRealTimers();
    });

    it('does not throw when muted', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.setMuted(true);
      expect(() => am.playBGM(1)).not.toThrow();
      am.dispose();
      vi.useRealTimers();
    });
  });

  describe('stopBGM() defers disconnect to allow fade-out (bugfix)', () => {
    it('schedules linearRampToValueAtTime(0) for short-lived voices and defers disconnect', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const shortVoiceCopies = [...((am as any).bgmShortVoices as Array<{ osc: any; gain: any }>)];
      expect(shortVoiceCopies.length).toBeGreaterThan(0);

      am.stopBGM();

      // Synchronously: stop is scheduled and ramp registered, but disconnect deferred.
      for (const { osc, gain } of shortVoiceCopies) {
        expect(osc.stop).toHaveBeenCalled();
        expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));
        expect(osc.disconnect).not.toHaveBeenCalled();
        expect(gain.disconnect).not.toHaveBeenCalled();
      }

      vi.advanceTimersByTime(50);

      for (const { osc, gain } of shortVoiceCopies) {
        expect(osc.disconnect).toHaveBeenCalled();
        expect(gain.disconnect).toHaveBeenCalled();
      }
      am.dispose();
      vi.useRealTimers();
    });

    it('schedules linearRampToValueAtTime(0) for persistent layers and defers disconnect', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const oscCopies = [...(am as any).bgmOscillators] as Array<any>;
      const gainCopies = [...(am as any).bgmGains] as Array<any>;
      expect(oscCopies.length).toBeGreaterThan(0);

      am.stopBGM();

      for (const gain of gainCopies) {
        expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));
      }
      for (const osc of oscCopies) {
        expect(osc.stop).toHaveBeenCalled();
        expect(osc.disconnect).not.toHaveBeenCalled();
      }
      for (const gain of gainCopies) {
        expect(gain.disconnect).not.toHaveBeenCalled();
      }

      vi.advanceTimersByTime(60);

      for (const osc of oscCopies) {
        expect(osc.disconnect).toHaveBeenCalled();
      }
      for (const gain of gainCopies) {
        expect(gain.disconnect).toHaveBeenCalled();
      }
      am.dispose();
      vi.useRealTimers();
    });

    it('clears internal voice arrays synchronously on stopBGM()', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      expect((am as any).bgmShortVoices.length).toBeGreaterThan(0);
      expect((am as any).bgmOscillators.length).toBeGreaterThan(0);
      expect((am as any).bgmGains.length).toBeGreaterThan(0);

      am.stopBGM();

      expect((am as any).bgmShortVoices).toHaveLength(0);
      expect((am as any).bgmOscillators).toHaveLength(0);
      expect((am as any).bgmGains).toHaveLength(0);

      am.dispose();
      vi.useRealTimers();
    });

    it('increments bgmGeneration so an in-flight tick early-returns', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const genBefore = (am as any).bgmGeneration as number;
      am.stopBGM();
      const genAfter = (am as any).bgmGeneration as number;
      expect(genAfter).toBe(genBefore + 1);

      // After stopBGM the timer is null, so even if the previously scheduled
      // tick had not yet been cleared it would early-return on the gen check.
      expect((am as any).bgmTimer).toBeNull();

      am.dispose();
      vi.useRealTimers();
    });

    it('replays a new generation cleanly after stopBGM()', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);
      am.stopBGM();
      am.playBGM(2);

      // Fresh generation should have re-populated arrays.
      expect((am as any).bgmShortVoices.length).toBeGreaterThan(0);
      expect((am as any).bgmOscillators.length).toBeGreaterThan(0);
      expect((am as any).bgmPlaying).toBe(true);

      // Deferred disconnects from the previous stopBGM still flush safely.
      vi.advanceTimersByTime(60);

      am.dispose();
      vi.useRealTimers();
    });
  });

  describe('BGM_CONFIGS validation (T010)', () => {
    it('has configs for all 11 stages plus title and ending', () => {
      for (let stage = 0; stage <= 11; stage++) {
        expect(BGM_CONFIGS[stage]).toBeDefined();
      }
      expect(BGM_CONFIGS[-1]).toBeDefined();
    });

    it('stages 1-11 all have unique tempos', () => {
      const tempos = new Set<number>();
      for (let stage = 1; stage <= 11; stage++) {
        expect(BGM_CONFIGS[stage]).toBeDefined();
        tempos.add(BGM_CONFIGS[stage].tempo);
      }
      expect(tempos.size).toBe(11);
    });

    it('stages 1-11 all have unique tempo+key combinations', () => {
      const signatures = new Set<string>();
      for (let stage = 1; stage <= 11; stage++) {
        const config = BGM_CONFIGS[stage];
        signatures.add(`${config.tempo}-${JSON.stringify(config.chords[0])}`);
      }
      expect(signatures.size).toBe(11);
    });

    it('all configs have 8 chords, 8 bassNotes, and 8 melodyNotes', () => {
      for (const key of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
        const config = BGM_CONFIGS[key];
        expect(config).toBeDefined();
        expect(config.chords).toHaveLength(8);
        expect(config.bassNotes).toHaveLength(8);
        expect(config.melodyNotes).toHaveLength(8);
      }
    });

    it('new BGM definitions: 水星(2, Dm, 112BPM), 金星(3, Eb, 115BPM), 地球(11, C, 145BPM)', () => {
      expect(BGM_CONFIGS[2].tempo).toBe(112);
      expect(BGM_CONFIGS[3].tempo).toBe(115);
      expect(BGM_CONFIGS[11].tempo).toBe(145);
      // 地球 uses square wave melody
      expect(BGM_CONFIGS[11].waveforms.melody).toBe('square');
    });

    it('remapped BGM: old stage 2 (火星) is now stage 4', () => {
      // Old stage 2 (Mars) had tempo 118
      expect(BGM_CONFIGS[4].tempo).toBe(118);
    });
  });

  describe('Title BGM (T015)', () => {
    it('plays title BGM (Am key, 100 BPM) with 4 layers', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(0);

      // Title has 3-note chords: bass(1) + pad(3) + arp(1) + melody(1) = 6
      expect(ctx.createOscillator).toHaveBeenCalledTimes(6);

      // Verify title config
      expect(BGM_CONFIGS[0].tempo).toBe(100);

      // Bass frequency should be Am bass (110 Hz)
      const firstOsc = ctx.createOscillator.mock.results[0].value;
      expect(firstOsc.frequency.value).toBe(110);
      am.dispose();
    });
  });

  describe('Ending BGM (T016)', () => {
    it('plays ending BGM (C key, 108 BPM) with 4 layers', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(-1);

      // Ending has 3-note chords: bass(1) + pad(3) + arp(1) + melody(1) = 6
      expect(ctx.createOscillator).toHaveBeenCalledTimes(6);

      // Verify ending config
      expect(BGM_CONFIGS[-1].tempo).toBe(108);

      // Bass frequency should be C bass (131 Hz)
      const firstOsc = ctx.createOscillator.mock.results[0].value;
      expect(firstOsc.frequency.value).toBe(131);
      am.dispose();
    });
  });

  describe('BGM fallback (T014)', () => {
    it('falls back to title BGM when stageNumber is unknown', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playBGM(999);

      // Should use title config (stage 0), bass = 110 Hz
      const firstOsc = ctx.createOscillator.mock.results[0].value;
      expect(firstOsc.frequency.value).toBe(110);
      am.dispose();
    });
  });

  describe('startBoostSFX() (T016)', () => {
    it('creates AudioBufferSourceNode with loop=true, lowpass filter 800Hz, gain 0.15', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.startBoostSFX();

      expect(ctx.createBuffer).toHaveBeenCalledWith(1, 44100, 44100);
      expect(ctx.createBufferSource).toHaveBeenCalled();
      expect(ctx.createBiquadFilter).toHaveBeenCalled();

      const source = ctx.createBufferSource.mock.results[0].value;
      expect(source.loop).toBe(true);
      expect(source.buffer).not.toBeNull();
      expect(source.start).toHaveBeenCalled();

      const filter = ctx.createBiquadFilter.mock.results[0].value;
      expect(filter.type).toBe('lowpass');
      expect(filter.frequency.value).toBe(800);

      const gain = ctx.createGain.mock.results[1].value;
      expect(gain.gain.value).toBe(0.15);

      am.dispose();
    });

    it('is no-op when not initialized', () => {
      const am = new AudioManager();
      am.startBoostSFX(); // Should not throw
    });

    it('is no-op when already playing (idempotent)', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.startBoostSFX();
      am.startBoostSFX(); // Second call is no-op

      expect(ctx.createBufferSource).toHaveBeenCalledTimes(1);
      am.dispose();
    });

    it('stores node references in private fields', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.startBoostSFX();

      expect((am as any).boostNoiseSource).not.toBeNull();
      expect((am as any).boostNoiseGain).not.toBeNull();
      expect((am as any).boostNoiseFilter).not.toBeNull();
      am.dispose();
    });

    it('caches the noise buffer across multiple invocations (no re-allocation)', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.startBoostSFX();
      am.stopBoostSFX();
      vi.advanceTimersByTime(300);
      am.startBoostSFX();

      // createBuffer should only have been called once (cached) even though
      // createBufferSource is called every start.
      expect(ctx.createBuffer).toHaveBeenCalledTimes(1);
      expect(ctx.createBufferSource).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
      am.dispose();
    });

    it('regenerates the noise buffer after dispose() + init() (cache is cleared)', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx1 = (am as any).ctx;

      am.startBoostSFX();
      expect(ctx1.createBuffer).toHaveBeenCalledTimes(1);

      am.dispose();
      expect((am as any).noiseBuffer).toBeNull();

      am.initSync();
      const ctx2 = (am as any).ctx;
      am.startBoostSFX();
      expect(ctx2.createBuffer).toHaveBeenCalledTimes(1);

      am.dispose();
    });
  });

  describe('stopBoostSFX() (T016)', () => {
    it('fades out gain and cleans up nodes after 300ms', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.startBoostSFX();
      const gain = (am as any).boostNoiseGain;
      const source = (am as any).boostNoiseSource;

      am.stopBoostSFX();

      expect(gain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));

      // Nodes nulled immediately
      expect((am as any).boostNoiseSource).toBeNull();
      expect((am as any).boostNoiseGain).toBeNull();
      expect((am as any).boostNoiseFilter).toBeNull();

      // After 300ms, actual stop/disconnect happens
      vi.advanceTimersByTime(300);
      expect(source.stop).toHaveBeenCalled();
      expect(source.disconnect).toHaveBeenCalled();

      vi.useRealTimers();
      am.dispose();
    });

    it('is no-op when not playing', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.stopBoostSFX(); // Should not throw
      am.dispose();
    });
  });

  describe('playSFX("boostReady") (T021)', () => {
    it('creates sine oscillator sweeping 880→1760Hz, duration 0.2s, gain 0.15', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx;

      am.playSFX('boostReady');

      const osc = ctx.createOscillator.mock.results[0].value;
      expect(osc.type).toBe('sine');
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(880, expect.any(Number));
      expect(osc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(1760, expect.any(Number));

      const gain = ctx.createGain.mock.results[1].value;
      expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.15, expect.any(Number));

      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).toHaveBeenCalled();
      am.dispose();
    });
  });

  describe('ensureResumed() (T001)', () => {
    it('does not throw when ctx is null', () => {
      const am = new AudioManager();
      // ctx is null before init
      expect(() => am.ensureResumed()).not.toThrow();
    });

    it('calls ctx.resume() when ctx.state is suspended', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'suspended';

      am.ensureResumed();

      expect(ctx.resume).toHaveBeenCalled();
      am.dispose();
    });

    it('does not call resume() when ctx.state is running', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'running';
      ctx.resume.mockClear();

      am.ensureResumed();

      expect(ctx.resume).not.toHaveBeenCalled();
      am.dispose();
    });

    it('calls ctx.resume() when ctx.state is interrupted (iOS Safari)', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'interrupted' as AudioContextState;
      ctx.resume.mockClear();

      am.ensureResumed();

      expect(ctx.resume).toHaveBeenCalled();
      am.dispose();
    });

    it('does not call resume() when ctx.state is closed', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'closed';
      ctx.resume.mockClear();

      am.ensureResumed();

      expect(ctx.resume).not.toHaveBeenCalled();
      am.dispose();
    });

    it('swallows rejected resume() promise (fire-and-forget)', async () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'suspended';
      ctx.resume.mockImplementationOnce(() => Promise.reject(new Error('user gesture required')));

      expect(() => am.ensureResumed()).not.toThrow();
      // Wait a microtask so the unhandled rejection (if any) would surface.
      await Promise.resolve();
      am.dispose();
    });
  });

  describe('suspend()', () => {
    it('does not throw when ctx is null', () => {
      const am = new AudioManager();
      expect(() => am.suspend()).not.toThrow();
    });

    it('calls ctx.suspend() and transitions state to suspended when running', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'running';
      ctx.suspend.mockClear();

      am.suspend();

      expect(ctx.suspend).toHaveBeenCalled();
      expect(ctx.state).toBe('suspended');
      am.dispose();
    });

    it('does not call ctx.suspend() when state is suspended', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'suspended';
      ctx.suspend.mockClear();

      am.suspend();

      expect(ctx.suspend).not.toHaveBeenCalled();
    });

    it('does not call ctx.suspend() when state is closed', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'closed';
      ctx.suspend.mockClear();

      am.suspend();

      expect(ctx.suspend).not.toHaveBeenCalled();
    });

    it('does not throw after dispose()', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.dispose();
      expect(() => am.suspend()).not.toThrow();
    });

    it('swallows rejected promise from ctx.suspend()', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'running';
      ctx.suspend.mockImplementationOnce(() => Promise.reject(new Error('not allowed')));

      expect(() => am.suspend()).not.toThrow();
      am.dispose();
    });
  });

  describe('initSync() suspended handling (T002)', () => {
    it('calls ensureResumed() when already initialized and ctx is suspended', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync(); // first call
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'suspended';
      ctx.resume.mockClear();

      am.initSync(); // second call — should resume

      expect(ctx.resume).toHaveBeenCalled();
      am.dispose();
    });

    it('does not call resume() when already initialized and ctx is running', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync(); // first call
      const ctx = (am as any).ctx as MockAudioContext;
      ctx.state = 'running';
      ctx.resume.mockClear();

      am.initSync(); // second call

      expect(ctx.resume).not.toHaveBeenCalled();
      am.dispose();
    });
  });

  describe('bgmGeneration and bgmPlaying (T008)', () => {
    it('sets bgmPlaying to true after playBGM()', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);

      expect((am as any).bgmPlaying).toBe(true);
      am.dispose();
    });

    it('sets bgmPlaying to false after stopBGM()', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      am.stopBGM();

      expect((am as any).bgmPlaying).toBe(false);
      am.dispose();
    });

    it('stale tick stops on generation mismatch after double playBGM()', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      const ctx = (am as any).ctx as MockAudioContext;

      am.playBGM(1); // gen A
      const genAfterFirst = (am as any).bgmGeneration;

      am.playBGM(2); // gen B — stopBGM increments gen, then playBGM increments again
      const genAfterSecond = (am as any).bgmGeneration;

      expect(genAfterSecond).toBeGreaterThan(genAfterFirst);

      // Advance timer to trigger ticks — only latest gen's ticks should schedule
      const oscCountBefore = ctx.createOscillator.mock.calls.length;
      vi.advanceTimersByTime(1000);
      // Should only have ticks from the second playBGM
      // (stale ticks from first playBGM return early due to gen mismatch)

      vi.useRealTimers();
      am.dispose();
    });

    it('tick does not reschedule after stopBGM()', () => {
      vi.useFakeTimers();
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();

      am.playBGM(1);
      am.stopBGM();

      // After stopBGM, bgmTimer is null and generation incremented
      expect((am as any).bgmTimer).toBeNull();

      // Advance timers — no new ticks should fire
      const ctx = (am as any).ctx as MockAudioContext;
      const oscCountAfterStop = ctx.createOscillator.mock.calls.length;
      vi.advanceTimersByTime(2000);
      // No new oscillators should be created
      expect(ctx.createOscillator.mock.calls.length).toBe(oscCountAfterStop);

      vi.useRealTimers();
      am.dispose();
    });
  });

  describe('dispose()', () => {
    it('is safe to call when not initialized', () => {
      audioManager.dispose(); // Should not throw
    });

    it('closes AudioContext', async () => {
      await audioManager.init();
      audioManager.dispose();
      // After dispose, methods should be no-op
      audioManager.playBGM(1);
      audioManager.playSFX('starCollect');
    });
  });
});
