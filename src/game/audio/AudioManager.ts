import type { SFXType } from '../../types';

interface BGMWaveforms {
  melody: OscillatorType;
  pad: OscillatorType;
  arpeggio: OscillatorType;
  bass: OscillatorType;
}

interface BGMVolumes {
  melody: number;
  pad: number;
  arpeggio: number;
  bass: number;
}

interface BGMConfig {
  tempo: number;
  beatsPerChord: number;
  chords: number[][];
  bassNotes: number[];
  melodyNotes: number[][];
  waveforms: BGMWaveforms;
  volumes: BGMVolumes;
}

export const BGM_CONFIGS: Record<number, BGMConfig> = {
  // Title BGM (stageNumber=0): Am, 100 BPM — 冒険の予感
  0: {
    tempo: 100,
    beatsPerChord: 4,
    chords: [
      [220, 262, 330], [175, 220, 262], [262, 330, 392], [196, 247, 294],
      [220, 262, 330], [175, 220, 262], [196, 247, 294], [262, 330, 392],
    ],
    bassNotes: [110, 87, 131, 98, 110, 87, 98, 131],
    melodyNotes: [
      [440, 523, 494, 440], [349, 440, 523, 440], [523, 587, 659, 587], [392, 494, 440, 392],
      [440, 523, 494, 440], [349, 440, 523, 440], [392, 494, 440, 392], [523, 587, 659, 587],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.08, pad: 0.04, arpeggio: 0.06, bass: 0.05 },
  },
  // Stage 1: Moon — C, 110 BPM — 穏やか、出発
  1: {
    tempo: 110,
    beatsPerChord: 4,
    chords: [
      [262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294],
      [262, 330, 392], [330, 392, 494], [175, 220, 262], [196, 247, 294],
    ],
    bassNotes: [131, 110, 87, 98, 131, 165, 87, 98],
    melodyNotes: [
      [523, 587, 659, 587], [440, 523, 494, 440], [349, 440, 523, 440], [392, 494, 440, 392],
      [523, 587, 659, 587], [330, 392, 440, 392], [349, 440, 523, 440], [392, 494, 440, 392],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'sine', bass: 'sine' },
    volumes: { melody: 0.08, pad: 0.04, arpeggio: 0.06, bass: 0.05 },
  },
  // Stage 2: Mars — D, 118 BPM — やや活発
  2: {
    tempo: 118,
    beatsPerChord: 4,
    chords: [
      [294, 370, 440], [247, 294, 370], [196, 247, 294], [220, 277, 330],
      [294, 370, 440], [185, 220, 277], [196, 247, 294], [220, 277, 330],
    ],
    bassNotes: [147, 123, 98, 110, 147, 93, 98, 110],
    melodyNotes: [
      [587, 659, 740, 659], [494, 587, 659, 587], [392, 494, 587, 494], [440, 523, 587, 523],
      [587, 659, 740, 659], [370, 440, 523, 440], [392, 494, 587, 494], [440, 523, 587, 523],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'sine', bass: 'sine' },
    volumes: { melody: 0.09, pad: 0.04, arpeggio: 0.06, bass: 0.06 },
  },
  // Stage 3: Jupiter — Eb, 120 BPM — 壮大、神秘的
  3: {
    tempo: 120,
    beatsPerChord: 4,
    chords: [
      [311, 370, 466], [247, 311, 370], [185, 233, 277], [277, 349, 415],
      [311, 370, 466], [247, 311, 370], [277, 349, 415], [185, 233, 277],
    ],
    bassNotes: [156, 123, 93, 139, 156, 123, 139, 93],
    melodyNotes: [
      [466, 523, 587, 523], [494, 587, 659, 587], [370, 440, 466, 440], [554, 587, 659, 587],
      [466, 523, 587, 523], [494, 587, 659, 587], [554, 587, 659, 587], [370, 440, 466, 440],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'sine', bass: 'sine' },
    volumes: { melody: 0.09, pad: 0.04, arpeggio: 0.06, bass: 0.06 },
  },
  // Stage 4: Saturn — Em, 115 BPM — ミステリアス
  4: {
    tempo: 115,
    beatsPerChord: 4,
    chords: [
      [330, 392, 494], [262, 330, 392], [196, 247, 294], [294, 370, 440],
      [330, 392, 494], [220, 262, 330], [247, 311, 370], [330, 392, 494],
    ],
    bassNotes: [165, 131, 98, 147, 165, 110, 123, 165],
    melodyNotes: [
      [659, 784, 880, 784], [523, 587, 659, 587], [392, 494, 587, 494], [587, 659, 740, 659],
      [659, 784, 880, 784], [440, 523, 587, 523], [494, 587, 659, 587], [659, 784, 880, 784],
    ],
    waveforms: { melody: 'triangle', pad: 'sine', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.10, pad: 0.04, arpeggio: 0.06, bass: 0.06 },
  },
  // Stage 5: Uranus — Fm, 125 BPM — 遠い宇宙感
  5: {
    tempo: 125,
    beatsPerChord: 4,
    chords: [
      [349, 415, 523], [277, 349, 415], [208, 262, 311], [311, 392, 466],
      [349, 415, 523], [277, 349, 415], [311, 392, 466], [208, 262, 311],
    ],
    bassNotes: [175, 139, 104, 156, 175, 139, 156, 104],
    melodyNotes: [
      [698, 784, 880, 784], [554, 587, 698, 587], [415, 523, 587, 523], [622, 698, 784, 698],
      [698, 784, 880, 784], [554, 587, 698, 587], [622, 698, 784, 698], [415, 523, 587, 523],
    ],
    waveforms: { melody: 'triangle', pad: 'sine', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.10, pad: 0.04, arpeggio: 0.07, bass: 0.07 },
  },
  // Stage 6: Neptune — G, 130 BPM — 力強い前進
  6: {
    tempo: 130,
    beatsPerChord: 4,
    chords: [
      [196, 247, 294], [330, 392, 494], [262, 330, 392], [294, 370, 440],
      [196, 247, 294], [247, 294, 370], [262, 330, 392], [294, 370, 440],
    ],
    bassNotes: [98, 165, 131, 147, 98, 123, 131, 147],
    melodyNotes: [
      [392, 494, 587, 494], [659, 784, 880, 784], [523, 587, 659, 587], [587, 659, 740, 659],
      [392, 494, 587, 494], [494, 587, 659, 587], [523, 587, 659, 587], [587, 659, 740, 659],
    ],
    waveforms: { melody: 'square', pad: 'triangle', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.10, pad: 0.04, arpeggio: 0.07, bass: 0.07 },
  },
  // Stage 7: Pluto — Am, 135 BPM — 緊張感のあるマイナー
  7: {
    tempo: 135,
    beatsPerChord: 4,
    chords: [
      [220, 262, 330], [175, 220, 262], [294, 349, 440], [330, 415, 494],
      [220, 262, 330], [196, 247, 294], [175, 220, 262], [330, 415, 494],
    ],
    bassNotes: [110, 87, 147, 165, 110, 98, 87, 165],
    melodyNotes: [
      [440, 523, 659, 523], [349, 440, 523, 440], [587, 698, 784, 698], [659, 784, 880, 784],
      [440, 523, 659, 523], [392, 494, 587, 494], [349, 440, 523, 440], [659, 784, 880, 784],
    ],
    waveforms: { melody: 'square', pad: 'triangle', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.11, pad: 0.04, arpeggio: 0.07, bass: 0.07 },
  },
  // Stage 8: Sun — C, 140 BPM — 勝利のクライマックス
  8: {
    tempo: 140,
    beatsPerChord: 4,
    chords: [
      [262, 330, 392], [196, 247, 294], [220, 262, 330], [175, 220, 262],
      [262, 330, 392], [196, 247, 294], [175, 220, 262], [262, 330, 392],
    ],
    bassNotes: [131, 98, 110, 87, 131, 98, 87, 131],
    melodyNotes: [
      [523, 659, 784, 659], [392, 494, 587, 494], [440, 523, 659, 523], [349, 440, 523, 440],
      [523, 659, 784, 659], [392, 494, 587, 494], [349, 440, 523, 440], [523, 659, 784, 659],
    ],
    waveforms: { melody: 'square', pad: 'triangle', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.12, pad: 0.05, arpeggio: 0.08, bass: 0.08 },
  },
  // Ending BGM (stageNumber=-1): C, 108 BPM — 大団円、余韻
  [-1]: {
    tempo: 108,
    beatsPerChord: 4,
    chords: [
      [262, 330, 392], [175, 220, 262], [196, 247, 294], [220, 262, 330],
      [175, 220, 262], [196, 247, 294], [262, 330, 392], [262, 330, 392],
    ],
    bassNotes: [131, 87, 98, 110, 87, 98, 131, 131],
    melodyNotes: [
      [523, 587, 659, 587], [349, 440, 523, 440], [392, 494, 587, 494], [440, 523, 587, 523],
      [349, 440, 523, 440], [392, 494, 587, 494], [523, 587, 659, 587], [523, 659, 784, 659],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'triangle', bass: 'sine' },
    volumes: { melody: 0.10, pad: 0.04, arpeggio: 0.06, bass: 0.06 },
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
      const AudioCtx = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
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
      const AudioCtx = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
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
    const beatInterval = 60 / config.tempo;

    // Bass layer - persistent oscillator
    try {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = config.waveforms.bass;
      bassOsc.frequency.value = config.bassNotes[0];
      bassGain.gain.value = config.volumes.bass;
      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start();
      this.bgmOscillators.push(bassOsc);
      this.bgmGains.push(bassGain);
    } catch {
      // Ignore bass errors
    }

    // Pad layer - persistent oscillators (one per chord tone)
    const padOscs: OscillatorNode[] = [];
    const firstChord = config.chords[0];
    for (let i = 0; i < firstChord.length; i++) {
      try {
        const padOsc = this.ctx.createOscillator();
        const padGain = this.ctx.createGain();
        padOsc.type = config.waveforms.pad;
        padOsc.frequency.value = firstChord[i];
        padGain.gain.value = config.volumes.pad;
        padOsc.connect(padGain);
        padGain.connect(this.ctx.destination);
        padOsc.start();
        padOscs.push(padOsc);
        this.bgmOscillators.push(padOsc);
        this.bgmGains.push(padGain);
      } catch {
        // Ignore pad errors
      }
    }

    // Sequencer - track beats and chords
    let beat = 0;
    const totalBeats = config.chords.length * config.beatsPerChord;

    const tick = () => {
      if (!this.initialized || !this.ctx) return;

      const chordIndex = Math.floor(beat / config.beatsPerChord) % config.chords.length;
      const beatInChord = beat % config.beatsPerChord;

      // Update bass and pad frequencies on chord change
      if (beatInChord === 0) {
        try {
          if (this.bgmOscillators[0]) {
            this.bgmOscillators[0].frequency.value = config.bassNotes[chordIndex];
          }
        } catch { /* ignore */ }

        const chord = config.chords[chordIndex];
        for (let i = 0; i < padOscs.length && i < chord.length; i++) {
          try { padOscs[i].frequency.value = chord[i]; } catch { /* ignore */ }
        }
      }

      // Arpeggio - play one note from current chord
      try {
        const chord = config.chords[chordIndex];
        const arpFreq = chord[beatInChord % chord.length];
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = config.waveforms.arpeggio;
        osc.frequency.value = arpFreq;
        const now = this.ctx!.currentTime;
        gain.gain.setValueAtTime(config.volumes.arpeggio, now);
        gain.gain.linearRampToValueAtTime(0.001, now + beatInterval * 0.9);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + beatInterval * 0.95);
      } catch {
        // Ignore arpeggio errors
      }

      // Melody - play note from melody sequence
      try {
        const melodySeq = config.melodyNotes[chordIndex];
        const melodyFreq = melodySeq[beatInChord % melodySeq.length];
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = config.waveforms.melody;
        osc.frequency.value = melodyFreq;
        const now = this.ctx!.currentTime;
        gain.gain.setValueAtTime(config.volumes.melody, now);
        gain.gain.linearRampToValueAtTime(0.001, now + beatInterval * 0.9);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + beatInterval * 0.95);
      } catch {
        // Ignore melody errors
      }

      beat = (beat + 1) % totalBeats;
      this.bgmTimer = setTimeout(tick, beatInterval * 1000);
    };

    tick();
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
