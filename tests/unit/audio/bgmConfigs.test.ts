import { describe, it, expect } from 'vitest';
import { BGM_CONFIGS } from '../../../src/game/audio/bgmConfigs';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';

const VALID_OSC: ReadonlySet<string> = new Set([
  'sine', 'square', 'triangle', 'sawtooth', 'custom',
]);

describe('bgmConfigs data integrity', () => {
  it('defines title (0), all stages (1..TOTAL_STAGES), and ending (-1)', () => {
    expect(BGM_CONFIGS[0]).toBeDefined();
    expect(BGM_CONFIGS[-1]).toBeDefined();
    for (let s = 1; s <= TOTAL_STAGES; s++) {
      expect(BGM_CONFIGS[s], `stage ${s} should have a BGMConfig`).toBeDefined();
    }
  });

  const keys: number[] = [0, -1];
  for (let s = 1; s <= 11; s++) keys.push(s);

  for (const key of keys) {
    describe(`BGM_CONFIGS[${key}]`, () => {
      const cfg = BGM_CONFIGS[key];

      it('has positive tempo and beatsPerChord', () => {
        expect(cfg.tempo).toBeGreaterThan(0);
        expect(cfg.beatsPerChord).toBeGreaterThan(0);
        expect(Number.isInteger(cfg.beatsPerChord)).toBe(true);
      });

      it('has matching chord/bass/melody lengths (> 0)', () => {
        expect(cfg.chords.length).toBeGreaterThan(0);
        expect(cfg.chords.length).toBe(cfg.bassNotes.length);
        expect(cfg.chords.length).toBe(cfg.melodyNotes.length);
      });

      it('every melody phrase has length === beatsPerChord', () => {
        for (let i = 0; i < cfg.melodyNotes.length; i++) {
          expect(cfg.melodyNotes[i].length, `melodyNotes[${i}]`).toBe(cfg.beatsPerChord);
        }
      });

      it('every chord has at least one note, all positive frequencies', () => {
        for (let i = 0; i < cfg.chords.length; i++) {
          expect(cfg.chords[i].length, `chords[${i}]`).toBeGreaterThan(0);
          for (const f of cfg.chords[i]) expect(f).toBeGreaterThan(0);
        }
        for (const b of cfg.bassNotes) expect(b).toBeGreaterThan(0);
        for (const phrase of cfg.melodyNotes) {
          for (const n of phrase) expect(n).toBeGreaterThan(0);
        }
      });

      it('volumes are in [0, 1)', () => {
        const v = cfg.volumes;
        for (const [name, val] of Object.entries(v)) {
          expect(val, `volumes.${name}`).toBeGreaterThanOrEqual(0);
          expect(val, `volumes.${name}`).toBeLessThan(1);
        }
      });

      it('waveforms are valid OscillatorType values', () => {
        const w = cfg.waveforms;
        for (const [name, val] of Object.entries(w)) {
          expect(VALID_OSC.has(val as string), `waveforms.${name}=${val}`).toBe(true);
        }
      });
    });
  }
});
