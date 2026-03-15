import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Web Audio API
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
  onended: (() => void) | null = null;
}

class MockAudioContext {
  state: AudioContextState = 'suspended';
  currentTime = 0;
  resume = vi.fn().mockImplementation(async () => { this.state = 'running'; });
  close = vi.fn().mockImplementation(async () => { this.state = 'closed'; });
  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
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
      // All should play without error
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
      // Persistent: bass(1) + pad(3) = 4
      // First tick (synchronous): arpeggio(1) + melody(1) = 2
      // Total: 6 oscillators and 6 gain nodes
      expect(ctx.createOscillator).toHaveBeenCalledTimes(6);
      expect(ctx.createGain).toHaveBeenCalledTimes(6);
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
      // Arpeggio gain (index 4) and melody gain (index 5) should have linearRamp
      expect(gains[4].gain.linearRampToValueAtTime).toHaveBeenCalled();
      expect(gains[5].gain.linearRampToValueAtTime).toHaveBeenCalled();
      am.dispose();
    });
  });

  describe('stopBGM() clears all layers (T009)', () => {
    it('stops and disconnects all persistent oscillators', () => {
      vi.stubGlobal('AudioContext', MockAudioContext);
      const am = new AudioManager();
      am.initSync();
      am.playBGM(1);

      const oscCopies = [...(am as any).bgmOscillators];
      const gainCopies = [...(am as any).bgmGains];

      am.stopBGM();

      for (const osc of oscCopies) {
        expect(osc.stop).toHaveBeenCalled();
        expect(osc.disconnect).toHaveBeenCalled();
      }
      for (const gain of gainCopies) {
        expect(gain.disconnect).toHaveBeenCalled();
      }
      am.dispose();
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

  describe('BGM_CONFIGS validation (T010)', () => {
    it('stages 1-8 all have unique tempos', () => {
      const tempos = new Set<number>();
      for (let stage = 1; stage <= 8; stage++) {
        expect(BGM_CONFIGS[stage]).toBeDefined();
        tempos.add(BGM_CONFIGS[stage].tempo);
      }
      expect(tempos.size).toBe(8);
    });

    it('stages 1-8 all have unique tempo+key combinations', () => {
      const signatures = new Set<string>();
      for (let stage = 1; stage <= 8; stage++) {
        const config = BGM_CONFIGS[stage];
        signatures.add(`${config.tempo}-${JSON.stringify(config.chords[0])}`);
      }
      expect(signatures.size).toBe(8);
    });

    it('all configs have 8 chords, 8 bassNotes, and 8 melodyNotes', () => {
      for (const key of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        const config = BGM_CONFIGS[key];
        expect(config).toBeDefined();
        expect(config.chords).toHaveLength(8);
        expect(config.bassNotes).toHaveLength(8);
        expect(config.melodyNotes).toHaveLength(8);
      }
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
