import type { SFXType } from '../../types';
import { BGM_CONFIGS } from './bgmConfigs';

export { BGM_CONFIGS } from './bgmConfigs';
export type { BGMConfig, BGMVolumes, BGMWaveforms } from './bgmConfigs';

export class AudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private masterGain: GainNode | null = null;
  private muted = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGains: GainNode[] = [];
  private bgmShortVoices: { osc: OscillatorNode; gain: GainNode }[] = [];
  private bgmTimer: ReturnType<typeof setTimeout> | null = null;
  private boostNoiseSource: AudioBufferSourceNode | null = null;
  private boostNoiseGain: GainNode | null = null;
  private boostNoiseFilter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private bgmPlaying = false;
  private bgmGeneration = 0;
  // Per-SFX-type timestamp (ctx.currentTime, seconds) of the last successful playback.
  // Used to coalesce duplicate SFX triggers within the same frame to prevent
  // pop noise on iPad Safari WebAudio (Constitution I) and reduce node churn (Constitution IV).
  private readonly lastSfxTime = new Map<SFXType, number>();
  // Coalescing window for playSFX: same SFX type fired within this window is
  // dropped. ~30ms ≈ 2 frames at 60fps — short enough to keep the response
  // snappy for kids while suppressing in-frame stacking pops.
  private static readonly SFX_COALESCE_WINDOW_SEC = 0.03;

  async init(): Promise<void> {
    try {
      const AudioCtx = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      this.setupMasterGain();
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  ensureResumed(): void {
    // iOS Safari uses 'interrupted' state (WebKit-specific) when audio is
    // disrupted by phone calls, other apps, etc. Treat any non-'running'
    // state (except terminal 'closed') as needing resume.
    if (this.ctx && this.ctx.state !== 'running' && this.ctx.state !== 'closed') {
      try {
        const result = this.ctx.resume();
        if (result && typeof (result as Promise<void>).catch === 'function') {
          (result as Promise<void>).catch(() => { /* ignore */ });
        }
      } catch {
        /* ignore */
      }
    }
  }

  suspend(): void {
    if (!this.ctx) return;
    if (this.ctx.state !== 'running') return;
    try {
      const result = this.ctx.suspend();
      if (result && typeof (result as Promise<void>).catch === 'function') {
        (result as Promise<void>).catch(() => { /* ignore */ });
      }
    } catch {
      /* ignore */
    }
  }

  /**
   * AudioContext が初期化済みかを返す純粋な getter（副作用なし）。
   * TitleScene が「再訪問時は enter() で即時 playBGM(0)、初回起動時は
   * pointerdown を待つ」を判定するために使用する。
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  initSync(): void {
    if (this.initialized) {
      this.ensureResumed();
      return;
    }
    try {
      const AudioCtx = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.ctx.resume(); // Call in sync callstack; don't await the Promise
      this.setupMasterGain();
      this.initialized = true;
    } catch {
      this.initialized = false;
    }
  }

  private setupMasterGain(): void {
    if (!this.ctx) return;
    try {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);
    } catch {
      this.masterGain = null;
    }
  }

  /**
   * Returns the current sink for any audio source. Falls back to ctx.destination
   * if the master gain failed to initialize, so audio still plays in degraded mode.
   */
  private sink(): AudioNode | null {
    if (this.masterGain) return this.masterGain;
    return this.ctx ? this.ctx.destination : null;
  }

  /**
   * Mute or unmute all audio routed through the master gain.
   * Uses setTargetAtTime with a ~10ms time-constant to avoid pop noise.
   * Safe to call before initialization; the state is remembered and applied
   * once the AudioContext is created.
   */
  setMuted(muted: boolean): void {
    this.muted = muted;
    if (!this.ctx || !this.masterGain) return;
    const target = muted ? 0 : 1;
    try {
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.01);
    } catch {
      try {
        this.masterGain.gain.value = target;
      } catch { /* ignore */ }
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Toggle mute state and return the new value. */
  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  playBGM(stageNumber: number): void {
    this.ensureResumed();
    if (!this.initialized || !this.ctx) return;
    this.stopBGM();
    this.bgmGeneration++;
    this.bgmPlaying = true;
    const currentGen = this.bgmGeneration;

    const config = BGM_CONFIGS[stageNumber] ?? BGM_CONFIGS[0];
    const beatInterval = 60 / config.tempo;
    const startTime = this.ctx.currentTime;
    const fadeInDuration = 0.03;

    // Bass layer - persistent oscillator
    try {
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = config.waveforms.bass;
      bassOsc.frequency.value = config.bassNotes[0];
      bassGain.gain.setValueAtTime(0, startTime);
      bassGain.gain.linearRampToValueAtTime(config.volumes.bass, startTime + fadeInDuration);
      bassOsc.connect(bassGain);
      bassGain.connect(this.sink()!);
      bassOsc.start(startTime);
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
        padGain.gain.setValueAtTime(0, startTime);
        padGain.gain.linearRampToValueAtTime(config.volumes.pad, startTime + fadeInDuration);
        padOsc.connect(padGain);
        padGain.connect(this.sink()!);
        padOsc.start(startTime);
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
      if (currentGen !== this.bgmGeneration) return;

      // While the AudioContext is not running (e.g. iOS Safari backgrounded
      // and suspend() was invoked), skip scheduling new oscillators to avoid
      // accumulating short voices whose start times are pinned to the
      // suspended currentTime. Spin-reschedule cheaply until we resume.
      if (this.ctx.state !== 'running') {
        this.bgmTimer = setTimeout(tick, 200);
        return;
      }

      // While muted, skip creating short-lived voices (arpeggio/melody).
      // Persistent layers (bass/pad) are already silenced via masterGain=0,
      // and we keep the tick cadence so unmute resumes within one beat.
      // Same approach as playSFX muted skip optimization.
      if (this.muted) {
        beat = (beat + 1) % totalBeats;
        this.bgmTimer = setTimeout(tick, beatInterval * 1000);
        return;
      }

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
        gain.connect(this.sink()!);
        osc.start(now);
        osc.stop(now + beatInterval * 0.95);
        this.trackShortVoice(osc, gain);
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
        gain.connect(this.sink()!);
        osc.start(now);
        osc.stop(now + beatInterval * 0.95);
        this.trackShortVoice(osc, gain);
      } catch {
        // Ignore melody errors
      }

      beat = (beat + 1) % totalBeats;
      this.bgmTimer = setTimeout(tick, beatInterval * 1000);
    };

    tick();
  }

  private trackShortVoice(osc: OscillatorNode, gain: GainNode): void {
    const entry = { osc, gain };
    this.bgmShortVoices.push(entry);
    osc.onended = () => {
      const idx = this.bgmShortVoices.indexOf(entry);
      if (idx !== -1) {
        this.bgmShortVoices.splice(idx, 1);
      }
      try { osc.disconnect(); } catch { /* ignore */ }
      try { gain.disconnect(); } catch { /* ignore */ }
    };
  }

  stopBGM(): void {
    this.bgmGeneration++;
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
    const now = this.ctx ? this.ctx.currentTime : 0;
    // Snapshot then synchronously clear arrays to prevent re-entrancy with
    // any subsequent playBGM() call while disconnects are deferred.
    const shortVoiceSnapshot = this.bgmShortVoices;
    const persistentOscSnapshot = this.bgmOscillators;
    const persistentGainSnapshot = this.bgmGains;
    this.bgmShortVoices = [];
    this.bgmOscillators = [];
    this.bgmGains = [];

    // Short-lived voices: schedule a 20ms fade-out, then stop, then defer
    // disconnect so the fade is actually audible (do not break the audio
    // graph synchronously).
    for (const { osc, gain } of shortVoiceSnapshot) {
      try { gain.gain.cancelScheduledValues(now); } catch { /* ignore */ }
      try { gain.gain.setValueAtTime(gain.gain.value, now); } catch { /* ignore */ }
      try { gain.gain.linearRampToValueAtTime(0, now + 0.02); } catch { /* ignore */ }
      try { osc.stop(now + 0.03); } catch { /* already stopped */ }
    }
    setTimeout(() => {
      for (const { osc, gain } of shortVoiceSnapshot) {
        try { osc.disconnect(); } catch { /* ignore */ }
        try { gain.disconnect(); } catch { /* ignore */ }
      }
    }, 40);

    // Persistent layers (bass/pad): apply a short ~30ms fade so iPad Safari
    // does not emit a click when the graph is torn down.
    for (let i = 0; i < persistentOscSnapshot.length; i++) {
      const osc = persistentOscSnapshot[i];
      const gain = persistentGainSnapshot[i];
      if (gain) {
        try { gain.gain.cancelScheduledValues(now); } catch { /* ignore */ }
        try { gain.gain.setValueAtTime(gain.gain.value, now); } catch { /* ignore */ }
        try { gain.gain.linearRampToValueAtTime(0, now + 0.03); } catch { /* ignore */ }
      }
      try { osc.stop(now + 0.04); } catch { /* already stopped */ }
    }
    setTimeout(() => {
      for (const osc of persistentOscSnapshot) {
        try { osc.disconnect(); } catch { /* ignore */ }
      }
      for (const gain of persistentGainSnapshot) {
        try { gain.disconnect(); } catch { /* ignore */ }
      }
    }, 50);
  }

  startBoostSFX(): void {
    this.ensureResumed();
    if (!this.initialized || !this.ctx) return;
    if (this.boostNoiseSource) return;
    try {
      const buffer = this.getOrCreateNoiseBuffer();
      if (!buffer) return;
      this.boostNoiseSource = this.ctx.createBufferSource();
      this.boostNoiseSource.buffer = buffer;
      this.boostNoiseSource.loop = true;
      this.boostNoiseFilter = this.ctx.createBiquadFilter();
      this.boostNoiseFilter.type = 'lowpass';
      this.boostNoiseFilter.frequency.value = 800;
      this.boostNoiseGain = this.ctx.createGain();
      this.boostNoiseGain.gain.value = 0.15;
      this.boostNoiseSource.connect(this.boostNoiseFilter);
      this.boostNoiseFilter.connect(this.boostNoiseGain);
      this.boostNoiseGain.connect(this.sink()!);
      this.boostNoiseSource.start();
    } catch {
      this.boostNoiseSource = null;
      this.boostNoiseGain = null;
      this.boostNoiseFilter = null;
    }
  }

  private getOrCreateNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === sampleRate) {
      return this.noiseBuffer;
    }
    const buffer = this.ctx.createBuffer(1, sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  stopBoostSFX(): void {
    if (!this.boostNoiseSource || !this.boostNoiseGain || !this.ctx) return;
    try {
      this.boostNoiseGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
      const source = this.boostNoiseSource;
      const filter = this.boostNoiseFilter;
      const gain = this.boostNoiseGain;
      this.boostNoiseSource = null;
      this.boostNoiseGain = null;
      this.boostNoiseFilter = null;
      setTimeout(() => {
        try {
          source.stop();
          source.disconnect();
          filter?.disconnect();
          gain?.disconnect();
        } catch { /* ignore */ }
      }, 300);
    } catch {
      this.boostNoiseSource = null;
      this.boostNoiseGain = null;
      this.boostNoiseFilter = null;
    }
  }

  playSFX(type: SFXType): void {
    // Mute 中は WebAudio ノード生成を完全にスキップして iPad Safari の負荷を抑える。
    // lastSfxTime は更新しないため、unmute 直後の最初の SFX が coalesce で誤抑止されない。
    // ensureResumed() もミュート中は呼ばない（不要なリジューム試行を避ける）。
    if (this.muted) return;
    this.ensureResumed();
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const last = this.lastSfxTime.get(type);
    if (last !== undefined && now - last < AudioManager.SFX_COALESCE_WINDOW_SEC) {
      return;
    }
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
        case 'boostReady':
          this.playSweep('sine', 880, 1760, 0.2, 0.15);
          break;
        case 'boostDenied':
          this.playSweep('triangle', 320, 260, 0.08, 0.12);
          break;
        case 'countdownTick':
          // 短い 800Hz サイン波ビープ。子どもが気持ちよく数えられる軽快な音。
          this.playSweep('sine', 800, 800, 0.08, 0.18);
          break;
        case 'countdownGo':
          // 明るい長三和音 (C/E/G) ジングル。「スタート！」の高揚感を与える。
          this.playArpeggio([523, 659, 784], 'sine', 0.07, 0.22);
          break;
      }
      this.lastSfxTime.set(type, now);
    } catch {
      // Ignore SFX errors
    }
  }

  dispose(): void {
    this.stopBGM();
    this.stopBoostSFX();
    if (this.masterGain) {
      try { this.masterGain.disconnect(); } catch { /* ignore */ }
      this.masterGain = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch { /* ignore */ }
      this.ctx = null;
    }
    this.noiseBuffer = null;
    this.lastSfxTime.clear();
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
    gain.connect(this.sink()!);
    this.attachOneShotCleanup(osc, gain);
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
      gain.connect(this.sink()!);
      this.attachOneShotCleanup(osc, gain);
      osc.start(startTime);
      osc.stop(startTime + noteLength);
    }
  }

  private attachOneShotCleanup(osc: OscillatorNode, gain: GainNode): void {
    osc.onended = () => {
      try { osc.disconnect(); } catch { /* ignore */ }
      try { gain.disconnect(); } catch { /* ignore */ }
    };
  }
}
