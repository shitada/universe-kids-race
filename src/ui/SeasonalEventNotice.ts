import type { SeasonalEventConfig } from '../types';
import { getViewportSize, updateViewportSizeCache } from '../game/utils/getViewportSize';

export interface SeasonalEventNoticeOptions {
  totalDuration?: number;
}

const DEFAULT_TOTAL_DURATION = 4;

export class SeasonalEventNotice {
  private overlayEl: HTMLDivElement | null = null;
  private cardEl: HTMLDivElement | null = null;
  private titleEl: HTMLDivElement | null = null;
  private messageEl: HTMLDivElement | null = null;
  private elapsed = 0;
  private visible = false;
  private highContrastMode = false;
  private readonly totalDuration: number;

  constructor(options: SeasonalEventNoticeOptions = {}) {
    this.totalDuration = options.totalDuration ?? DEFAULT_TOTAL_DURATION;
  }

  show(event: SeasonalEventConfig): void {
    const host = document.getElementById('ui-overlay') ?? document.body;
    updateViewportSizeCache();
    const compact = getViewportSize().height <= 500;

    if (!this.overlayEl || !this.cardEl || !this.titleEl || !this.messageEl) {
      this.overlayEl = document.createElement('div');
      this.overlayEl.setAttribute('data-seasonal-event-notice', '');
      this.overlayEl.style.cssText = `
        position: absolute;
        top: clamp(4.6rem, 12vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 14;
        pointer-events: none;
      `;

      this.cardEl = document.createElement('div');
      this.cardEl.setAttribute('data-seasonal-event-notice-card', '');
      this.titleEl = document.createElement('div');
      this.titleEl.setAttribute('data-seasonal-event-notice-title', '');
      this.messageEl = document.createElement('div');
      this.messageEl.setAttribute('data-seasonal-event-notice-message', '');
      this.messageEl.setAttribute('role', 'status');
      this.messageEl.setAttribute('aria-live', 'polite');
      this.messageEl.setAttribute('aria-atomic', 'true');
      this.cardEl.append(this.titleEl, this.messageEl);
      this.overlayEl.appendChild(this.cardEl);
    }

    this.overlayEl.style.display = 'block';
    this.visible = true;
    this.elapsed = 0;
    this.titleEl.textContent = `${event.emoji} ${event.title}`;
    this.messageEl.textContent = event.noticeMessage;
    this.overlayEl.setAttribute('data-seasonal-event-id', event.id);
    this.overlayEl.setAttribute('aria-hidden', 'false');
    this.applyStyles(event.accentColor, compact);
    if (!this.overlayEl.isConnected) {
      host.appendChild(this.overlayEl);
    }
  }

  tick(deltaTime: number): void {
    if (!this.visible) {
      return;
    }
    this.elapsed += Math.max(0, deltaTime);
    if (this.elapsed >= this.totalDuration) {
      this.hide();
    }
  }

  hide(): void {
    if (!this.overlayEl) {
      return;
    }
    this.visible = false;
    this.elapsed = 0;
    this.overlayEl.remove();
    this.overlayEl = null;
    this.cardEl = null;
    this.titleEl = null;
    this.messageEl = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.visible;
  }

  setHighContrastMode(enabled: boolean): void {
    this.highContrastMode = enabled;
    const accentColor = this.overlayEl?.getAttribute('data-seasonal-event-id')
      ? this.overlayEl?.getAttribute('data-seasonal-event-accent')
      : null;
    if (!this.cardEl || !accentColor) {
      return;
    }
    this.applyStyles(Number(accentColor), getViewportSize().height <= 500);
  }

  private applyStyles(accentColor: number, compact: boolean): void {
    if (!this.overlayEl || !this.cardEl || !this.titleEl || !this.messageEl) {
      return;
    }

    const accent = `#${accentColor.toString(16).padStart(6, '0')}`;
    this.overlayEl.setAttribute('data-seasonal-event-accent', String(accentColor));
    this.cardEl.style.cssText = `
      min-width: min(${compact ? '86vw' : '70vw'}, ${compact ? '19rem' : '28rem'});
      max-width: min(90vw, 32rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: ${compact ? '0.25rem' : '0.45rem'};
      padding: ${compact ? '0.9rem 1rem' : '1rem 1.3rem'};
      border-radius: ${compact ? '22px' : '28px'};
      background: ${this.highContrastMode ? 'rgba(5, 10, 28, 0.96)' : 'rgba(12, 31, 78, 0.92)'};
      border: ${this.highContrastMode ? '3px solid #ffffff' : `2px solid ${accent}`};
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
      text-align: center;
    `;
    this.titleEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? 'clamp(1.1rem, 4.2vmin, 1.35rem)' : 'clamp(1.25rem, 4vmin, 1.55rem)'};
      font-weight: 900;
      color: #ffffff;
    `;
    this.messageEl.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: ${compact ? 'clamp(0.95rem, 3.5vmin, 1.08rem)' : 'clamp(1rem, 3.2vmin, 1.15rem)'};
      font-weight: 700;
      line-height: 1.35;
      color: ${this.highContrastMode ? '#ffffff' : '#eef6ff'};
    `;
  }
}
