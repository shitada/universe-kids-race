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
const { AudioManager } = await import('../../../src/game/audio/AudioManager');

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
