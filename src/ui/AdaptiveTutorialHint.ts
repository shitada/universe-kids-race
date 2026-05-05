import type { AdaptiveTutorialHintType } from '../game/systems/AdaptiveTutorialSystem';

export class AdaptiveTutorialHint {
  private overlayEl: HTMLDivElement | null = null;
  private bubbleEl: HTMLDivElement | null = null;
  private highContrastMode = false;

  show(message: string, type: Exclude<AdaptiveTutorialHintType, 'boost'>): void {
    const host = document.getElementById('ui-overlay');
    if (!host) {
      return;
    }

    this.injectStyles();
    if (!this.overlayEl || !this.bubbleEl) {
      this.overlayEl = document.createElement('div');
      this.overlayEl.setAttribute('data-adaptive-tutorial-hint', '');
      this.overlayEl.setAttribute('aria-hidden', 'true');
      this.overlayEl.style.cssText = `
        position: absolute;
        top: clamp(4.6rem, 13vh, 6.8rem);
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 11;
      `;

      this.bubbleEl = document.createElement('div');
      this.bubbleEl.setAttribute('data-adaptive-tutorial-bubble', '');
      this.bubbleEl.setAttribute('role', 'status');
      this.bubbleEl.setAttribute('aria-live', 'polite');
      this.bubbleEl.setAttribute('aria-atomic', 'true');
      this.overlayEl.appendChild(this.bubbleEl);
    }

    this.overlayEl.setAttribute('aria-hidden', 'false');
    this.overlayEl.style.display = 'block';
    this.overlayEl.setAttribute('data-adaptive-tutorial-kind', type);
    this.overlayEl.setAttribute('data-adaptive-tutorial-contrast', this.highContrastMode ? 'high' : 'default');
    this.bubbleEl.textContent = message;
    this.applyStyles(type);
    if (!this.overlayEl.isConnected) {
      host.appendChild(this.overlayEl);
    }
  }

  hide(): void {
    if (!this.overlayEl || !this.bubbleEl) {
      return;
    }
    this.overlayEl.style.display = 'none';
    this.overlayEl.setAttribute('aria-hidden', 'true');
    this.overlayEl.removeAttribute('data-adaptive-tutorial-kind');
    this.bubbleEl.textContent = '';
  }

  setHighContrastMode(enabled: boolean): void {
    this.highContrastMode = enabled;
    this.overlayEl?.setAttribute('data-adaptive-tutorial-contrast', enabled ? 'high' : 'default');
    const type = this.overlayEl?.getAttribute('data-adaptive-tutorial-kind');
    if (!this.bubbleEl || !type) {
      return;
    }
    this.applyStyles(type as Exclude<AdaptiveTutorialHintType, 'boost'>);
  }

  private applyStyles(type: Exclude<AdaptiveTutorialHintType, 'boost'>): void {
    if (!this.bubbleEl) {
      return;
    }

    const palette = type === 'meteorite'
      ? {
          background: this.highContrastMode ? 'rgba(5, 10, 28, 0.96)' : 'rgba(29, 35, 84, 0.92)',
          border: this.highContrastMode ? '3px solid rgba(255, 255, 255, 0.95)' : '2px solid rgba(255, 187, 117, 0.95)',
          color: '#ffffff',
          shadow: this.highContrastMode
            ? '0 12px 28px rgba(0, 0, 0, 0.42)'
            : '0 12px 28px rgba(255, 143, 61, 0.22)',
        }
      : {
          background: this.highContrastMode ? 'rgba(5, 10, 28, 0.96)' : 'rgba(15, 23, 58, 0.92)',
          border: this.highContrastMode ? '3px solid rgba(255, 255, 255, 0.95)' : '2px solid rgba(255, 227, 120, 0.95)',
          color: '#ffffff',
          shadow: this.highContrastMode
            ? '0 12px 28px rgba(0, 0, 0, 0.42)'
            : '0 12px 28px rgba(255, 215, 0, 0.2)',
        };

    this.bubbleEl.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 2.9rem;
      max-width: min(78vw, 28rem);
      padding: 0.7rem 1.15rem;
      border-radius: 999px;
      background: ${palette.background};
      border: ${palette.border};
      color: ${palette.color};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.4vmin, 1.18rem);
      font-weight: 700;
      line-height: 1.35;
      text-align: center;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      box-shadow: ${palette.shadow};
      white-space: nowrap;
    `;
  }

  private injectStyles(): void {
    if (document.getElementById('adaptive-tutorial-hint-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'adaptive-tutorial-hint-styles';
    style.textContent = `
      @keyframes adaptiveTutorialHintFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-3px) scale(1.02); }
      }

      [data-adaptive-tutorial-bubble] {
        animation: adaptiveTutorialHintFloat 1.2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }
}
