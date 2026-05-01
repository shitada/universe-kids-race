export interface BGMWaveforms {
  melody: OscillatorType;
  pad: OscillatorType;
  arpeggio: OscillatorType;
  bass: OscillatorType;
}

export interface BGMVolumes {
  melody: number;
  pad: number;
  arpeggio: number;
  bass: number;
}

export interface BGMConfig {
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
  // Stage 2: Mercury — Dm, 112 BPM — 軽快、小さな惑星
  2: {
    tempo: 112,
    beatsPerChord: 4,
    chords: [
      [294, 349, 440], [262, 330, 392], [220, 262, 330], [247, 294, 370],
      [294, 349, 440], [220, 262, 330], [247, 294, 370], [262, 330, 392],
    ],
    bassNotes: [147, 131, 110, 123, 147, 110, 123, 131],
    melodyNotes: [
      [587, 659, 698, 659], [523, 587, 659, 587], [440, 523, 587, 523], [494, 587, 659, 587],
      [587, 659, 698, 659], [440, 523, 587, 523], [494, 587, 659, 587], [523, 587, 659, 587],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'sine', bass: 'sine' },
    volumes: { melody: 0.08, pad: 0.04, arpeggio: 0.06, bass: 0.05 },
  },
  // Stage 3: Venus — Eb, 115 BPM — 神秘的な厚い雲
  3: {
    tempo: 115,
    beatsPerChord: 4,
    chords: [
      [311, 370, 466], [262, 311, 392], [233, 294, 349], [277, 349, 415],
      [311, 370, 466], [262, 311, 392], [277, 349, 415], [233, 294, 349],
    ],
    bassNotes: [156, 131, 117, 139, 156, 131, 139, 117],
    melodyNotes: [
      [622, 698, 784, 698], [523, 622, 698, 622], [466, 523, 587, 523], [554, 622, 698, 622],
      [622, 698, 784, 698], [523, 622, 698, 622], [554, 622, 698, 622], [466, 523, 587, 523],
    ],
    waveforms: { melody: 'sine', pad: 'sine', arpeggio: 'sine', bass: 'sine' },
    volumes: { melody: 0.09, pad: 0.04, arpeggio: 0.06, bass: 0.05 },
  },
  // Stage 4: Mars — D, 118 BPM — やや活発
  4: {
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
  // Stage 5: Jupiter — Eb, 120 BPM — 壮大、神秘的
  5: {
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
  // Stage 6: Saturn — Em, 122 BPM — ミステリアス
  6: {
    tempo: 122,
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
  // Stage 7: Uranus — Fm, 125 BPM — 遠い宇宙感
  7: {
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
  // Stage 8: Neptune — G, 130 BPM — 力強い前進
  8: {
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
  // Stage 9: Pluto — Am, 135 BPM — 緊張感のあるマイナー
  9: {
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
  // Stage 10: Sun — C, 140 BPM — 勝利のクライマックス
  10: {
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
  // Stage 11: Earth — C, 145 BPM — 帰還の凱旋、squareメロディ
  11: {
    tempo: 145,
    beatsPerChord: 4,
    chords: [
      [262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294],
      [262, 330, 392], [330, 392, 494], [220, 262, 330], [262, 330, 392],
    ],
    bassNotes: [131, 110, 87, 98, 131, 165, 110, 131],
    melodyNotes: [
      [523, 659, 784, 880], [440, 523, 659, 784], [349, 440, 523, 659], [392, 494, 587, 659],
      [523, 659, 784, 880], [659, 784, 880, 1047], [440, 523, 659, 784], [523, 659, 784, 880],
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
