import type { SFXType } from '../../types';

interface BGMConfig {
  melody: number[];
  tempo: number;
  waveform: OscillatorType;
  volume: number;
  bassFrequency: number;
  bassVolume: number;
}

const BGM_CONFIGS: Record<number, BGMConfig> = {
  // Title BGM (stageNumber=0): gentle sine arpeggio
  0: {
    melody: [262, 330, 392, 523, 392, 330],
    tempo: 120,
    waveform: 'sine',
    volume: 0.08,
    bassFrequency: 131,
    bassVolume: 0.05,
  },
  // Stage 1: Moon — calm
  1: {
    melody: [330, 392, 440, 523, 440, 392],
    tempo: 120,
    waveform: 'sine',
    volume: 0.08,
    bassFrequency: 165,
    bassVolume: 0.05,
  },
  // Stage 2: Mars — slightly energetic
  2: {
    melody: [349, 440, 523, 587, 523, 440],
    tempo: 125,
    waveform: 'triangle',
    volume: 0.09,
    bassFrequency: 175,
    bassVolume: 0.06,
  },
  // Stage 3: Jupiter — majestic
  3: {
    melody: [392, 494, 587, 659, 587, 494],
    tempo: 125,
    waveform: 'triangle',
    volume: 0.09,
    bassFrequency: 196,
    bassVolume: 0.06,
  },
  // Stage 4: Saturn — mysterious
  4: {
    melody: [440, 523, 587, 659, 698, 659],
    tempo: 128,
    waveform: 'triangle',
    volume: 0.10,
    bassFrequency: 220,
    bassVolume: 0.06,
  },
  // Stage 5: Uranus — ethereal
  5: {
    melody: [494, 587, 659, 784, 659, 587],
    tempo: 130,
    waveform: 'sine',
    volume: 0.10,
    bassFrequency: 247,
    bassVolume: 0.07,
  },
  // Stage 6: Neptune — deep
  6: {
    melody: [523, 659, 784, 880, 784, 659],
    tempo: 132,
    waveform: 'square',
    volume: 0.10,
    bassFrequency: 262,
    bassVolume: 0.07,
  },
  // Stage 7: Pluto — intense
  7: {
    melody: [587, 698, 784, 880, 988, 880],
    tempo: 135,
    waveform: 'square',
    volume: 0.11,
    bassFrequency: 294,
    bassVolume: 0.07,
  },
  // Stage 8: Sun — climax
  8: {
    melody: [659, 784, 880, 988, 1047, 988],
    tempo: 140,
    waveform: 'square',
    volume: 0.12,
    bassFrequency: 330,
    bassVolume: 0.08,
  },
  // Ending BGM (stageNumber=-1): triumphant
  [-1]: {
    melody: [523, 659, 784, 1047, 784, 659],
    tempo: 118,
    waveform: 'sine',
    volume: 0.10,
    bassFrequency: 262,
    bassVolume: 0.06,
  },
};

export class AudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGains: GainNode[] = [];
  private bgmTimer: ReturnType<typeof setTimeout> | null = null;

  async init(): Promise<void> {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  initSync(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.ctx.resume(); // Call in sync callstack; don't await the Promise
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  playBGM(stageNumber: number): void {
    if (!this.initialized || !this.ctx) return;
    this.stopBGM();

    const config = BGM_CONFIGS[stageNumber] ?? BGM_CONFIGS[0];
    const noteInterval = 60 / config.tempo;

    // Bass layer
    try {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.value = config.bassFrequency;
      bassGain.gain.value = config.bassVolume;
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start();
      this.bgmOscillators.push(bassOsc);
      this.bgmGains.push(bassGain);
    } catch {
      // Ignore bass errors
    }

    // Melody sequencer
    let noteIndex = 0;
    const playNote = () => {
      if (!this.initialized || !this.ctx) return;
      try {
        const freq = config.melody[noteIndex % config.melody.length];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = config.waveform;
        osc.frequency.value = freq;
        gain.gain.value = config.volume;
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;
        osc.start(now);
        gain.gain.setValueAtTime(config.volume, now);
        gain.gain.linearRampToValueAtTime(0.001, now + noteInterval * 0.9);
        osc.stop(now + noteInterval * 0.95);

        noteIndex++;
        this.bgmTimer = setTimeout(playNote, noteInterval * 1000);
      } catch {
        // Ignore note errors
      }
    };

    playNote();
  }

  stopBGM(): void {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    for (const osc of this.bgmOscillators) {
      try { osc.stop(); } catch { /* already stopped */ }
      try { osc.disconnect(); } catch { /* ignore */ }
    }
    for (const gain of this.bgmGains) {
      try { gain.disconnect(); } catch { /* ignore */ }
    }
    this.bgmOscillators = [];
    this.bgmGains = [];
  }

  playSFX(type: SFXType): void {
    if (!this.initialized || !this.ctx) return;
    try {
      switch (type) {
        case 'starCollect':
          this.playSweep('sine', 880, 1320, 0.15, 0.2);
          break;
        case 'rainbowCollect':
          this.playArpeggio([440, 880, 1760], 'sine', 0.1, 0.22);
          break;
        case 'meteoriteHit':
          this.playSweep('sawtooth', 200, 80, 0.3, 0.18);
          break;
        case 'boost':
          this.playSweep('square', 440, 880, 0.2, 0.15);
          break;
        case 'stageClear':
          this.playArpeggio([523, 659, 784, 1047], 'sine', 0.2, 0.2);
          break;
      }
    } catch {
      // Ignore SFX errors
    }
  }

  dispose(): void {
    this.stopBGM();
    if (this.ctx) {
      try { this.ctx.close(); } catch { /* ignore */ }
      this.ctx = null;
    }
    this.initialized = false;
  }

  private playSweep(waveform: OscillatorType, startFreq: number, endFreq: number, duration: number, volume: number): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = waveform;
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  private playArpeggio(freqs: number[], waveform: OscillatorType, noteLength: number, volume: number): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < freqs.length; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = waveform;
      osc.frequency.value = freqs[i];
      const startTime = now + i * noteLength;
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteLength * 0.9);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteLength);
    }
  }
}
