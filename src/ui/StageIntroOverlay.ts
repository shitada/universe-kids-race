import type { PlanetEncyclopediaEntry } from '../types';
import { getViewportSize, updateViewportSizeCache } from '../game/utils/getViewportSize';

export interface StageIntroOverlayOptions {
  totalDuration?: number;
}

const DEFAULT_TOTAL_DURATION = 1.8;

type StageIntroPhase = 'idle' | 'showing' | 'done';

export class StageIntroOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private cardEl: HTMLDivElement | null = null;
  private phase: StageIntroPhase = 'idle';
  private elapsed = 0;
  private onComplete: (() => void) | null = null;
  private readonly totalDuration: number;

  constructor(
    private readonly entry: PlanetEncyclopediaEntry,
    options: StageIntroOverlayOptions = {},
  ) {
    this.totalDuration = options.totalDuration ?? DEFAULT_TOTAL_DURATION;
  }

  show(onComplete: () => void): void {
    if (this.phase !== 'idle' && this.phase !== 'done') return;

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;
    updateViewportSizeCache();
    const compact = getViewportSize().height <= 500;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-stage-intro-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${compact ? '0.75rem' : '1.2rem'};
      pointer-events: none;
      z-index: 24;
      opacity: 0;
      will-change: opacity;
    `;

    this.cardEl = document.createElement('div');
    this.cardEl.setAttribute('data-stage-intro-card', '');
    this.cardEl.setAttribute('data-stage-intro-compact', compact ? 'true' : 'false');
    this.cardEl.style.cssText = `
      width: min(${compact ? '88vw' : '82vw'}, ${compact ? '22rem' : '30rem'});
      max-width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${compact ? '0.25rem' : '0.5rem'};
      padding: ${compact ? '0.9rem 1rem' : '1.4rem 1.6rem'};
      border-radius: ${compact ? '24px' : '32px'};
      background:
        linear-gradient(180deg, rgba(8, 24, 72, 0.92), rgba(25, 65, 148, 0.9)),
        rgba(8, 24, 72, 0.92);
      border: 2px solid rgba(255, 255, 255, 0.22);
      box-shadow:
        0 18px 50px rgba(0, 0, 0, 0.34),
        0 0 28px rgba(120, 180, 255, 0.22);
      text-align: center;
      transform: translateY(24px) scale(0.92);
      opacity: 0;
      will-change: transform, opacity;
    `;

    const labelEl = document.createElement('div');
    labelEl.textContent = 'つぎは ここ！';
    labelEl.setAttribute('data-stage-intro-label', '');
    labelEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? '0.85rem' : '1rem'};
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #bcd9ff;
    `;

    const emojiEl = document.createElement('div');
    emojiEl.textContent = this.entry.emoji;
    emojiEl.setAttribute('data-stage-intro-emoji', '');
    emojiEl.style.cssText = `
      font-size: ${compact ? 'clamp(3rem, 15vw, 4.2rem)' : 'clamp(4.4rem, 18vw, 6rem)'};
      line-height: 1;
      filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
    `;

    const nameEl = document.createElement('div');
    nameEl.textContent = this.entry.reading;
    nameEl.setAttribute('data-stage-intro-name', '');
    nameEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? 'clamp(1.8rem, 8vw, 2.6rem)' : 'clamp(2.5rem, 10vw, 3.4rem)'};
      font-weight: 900;
      line-height: 1.05;
      color: #ffffff;
      text-shadow: 0 0 18px rgba(126, 199, 255, 0.2);
    `;

    const triviaEl = document.createElement('div');
    triviaEl.textContent = this.entry.trivia;
    triviaEl.setAttribute('data-stage-intro-trivia', '');
    triviaEl.style.cssText = `
      max-width: 100%;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? 'clamp(0.88rem, 3.4vmin, 1rem)' : 'clamp(1.02rem, 3.7vmin, 1.15rem)'};
      font-weight: 700;
      line-height: 1.35;
      color: #eef5ff;
      overflow-wrap: anywhere;
    `;

    this.cardEl.append(labelEl, emojiEl, nameEl, triviaEl);
    this.overlayEl.appendChild(this.cardEl);
    uiOverlay.appendChild(this.overlayEl);

    this.phase = 'showing';
    this.elapsed = 0;
    this.onComplete = onComplete;
    this.applyAnimation(0);
  }

  tick(deltaTime: number): void {
    if (this.phase !== 'showing') return;
    this.elapsed += Math.max(0, deltaTime);
    this.applyAnimation(this.elapsed / this.totalDuration);
    if (this.elapsed >= this.totalDuration) {
      this.complete();
    }
  }

  hide(): void {
    if (this.overlayEl) {
      this.overlayEl.remove();
      this.overlayEl = null;
    }
    this.cardEl = null;
    this.phase = 'done';
    this.onComplete = null;
  }

  dispose(): void {
    this.hide();
  }

  isActive(): boolean {
    return this.phase === 'showing';
  }

  private applyAnimation(progress: number): void {
    if (!this.overlayEl || !this.cardEl) return;

    const p = Math.max(0, Math.min(1, progress));
    let cardOpacity = 1;
    let overlayOpacity = 1;
    let translateY = 0;
    let scale = 1;

    if (p < 0.18) {
      const t = p / 0.18;
      overlayOpacity = t;
      cardOpacity = t;
      translateY = 24 - 24 * t;
      scale = 0.92 + 0.1 * t;
    } else if (p < 0.72) {
      const t = (p - 0.18) / 0.54;
      overlayOpacity = 1;
      cardOpacity = 1;
      translateY = 0;
      scale = 1.02 - 0.02 * t;
    } else {
      const t = (p - 0.72) / 0.28;
      overlayOpacity = 1 - t * 0.8;
      cardOpacity = 1 - t;
      translateY = -18 * t;
      scale = 1 - 0.04 * t;
    }

    this.overlayEl.style.opacity = overlayOpacity.toFixed(3);
    this.cardEl.style.opacity = cardOpacity.toFixed(3);
    this.cardEl.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
  }

  private complete(): void {
    const cb = this.onComplete;
    this.hide();
    if (!cb) return;
    try {
      cb();
    } catch {
      /* ignore */
    }
  }
}
