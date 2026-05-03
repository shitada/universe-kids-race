export type TouchGuideMode = 'intro' | 'idle' | 'hidden';

export class TouchGuideOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private currentMode: TouchGuideMode | null = null;

  show(initialMode: TouchGuideMode = 'intro'): void {
    if (this.overlayEl) {
      this.setMode(initialMode);
      return;
    }

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.injectStyles();

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-touch-guide-overlay', '');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 12;
    `;

    this.overlayEl.appendChild(this.createGuide('left', '⬅️ ひだり'));
    this.overlayEl.appendChild(this.createGuide('right', 'みぎ ➡️'));
    uiOverlay.appendChild(this.overlayEl);
    this.setMode(initialMode);
  }

  setMode(mode: TouchGuideMode): void {
    if (!this.overlayEl || this.currentMode === mode) return;
    this.currentMode = mode;
    this.overlayEl.setAttribute('data-touch-guide-state', mode);
    this.overlayEl.setAttribute('aria-hidden', mode === 'hidden' ? 'true' : 'false');
    this.overlayEl.style.visibility = mode === 'hidden' ? 'hidden' : 'visible';
  }

  hide(): void {
    if (!this.overlayEl) return;
    this.overlayEl.remove();
    this.overlayEl = null;
    this.currentMode = null;
  }

  private createGuide(side: 'left' | 'right', label: string): HTMLDivElement {
    const guide = document.createElement('div');
    guide.setAttribute('data-touch-guide', side);
    guide.textContent = label;
    guide.style.position = 'absolute';
    guide.style.top = '50%';
    guide.style.transform = 'translateY(-50%)';
    guide.style.maxWidth = 'min(24vw, 11rem)';
    guide.style.padding = '0.7rem 1rem';
    guide.style.borderRadius = '999px';
    guide.style.background = 'rgba(6, 19, 58, 0.38)';
    guide.style.border = '2px solid rgba(255, 255, 255, 0.24)';
    guide.style.color = '#ffffff';
    guide.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    guide.style.fontSize = 'clamp(1rem, 2.8vmin, 1.3rem)';
    guide.style.fontWeight = '700';
    guide.style.textShadow = '0 2px 10px rgba(0, 0, 0, 0.45)';
    guide.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.16)';
    guide.style.transition = 'opacity 0.24s ease-out, transform 0.24s ease-out';
    guide.style.whiteSpace = 'nowrap';
    guide.style.opacity = '0';

    if (side === 'left') {
      guide.style.left = '0.8rem';
      guide.style.textAlign = 'left';
    } else {
      guide.style.right = '0.8rem';
      guide.style.textAlign = 'right';
    }

    return guide;
  }

  private injectStyles(): void {
    if (document.getElementById('touch-guide-overlay-styles')) return;

    const style = document.createElement('style');
    style.id = 'touch-guide-overlay-styles';
    style.textContent = `
      @keyframes touchGuideBlink {
        0%, 100% { opacity: 0.52; }
        50% { opacity: 0.95; }
      }

      [data-touch-guide-overlay][data-touch-guide-state="intro"] [data-touch-guide] {
        opacity: 0.82;
        animation: touchGuideBlink 1.8s ease-in-out infinite;
      }

      [data-touch-guide-overlay][data-touch-guide-state="idle"] [data-touch-guide] {
        opacity: 0.42;
        animation: none;
        transform: translateY(-50%);
      }

      [data-touch-guide-overlay][data-touch-guide-state="hidden"] [data-touch-guide] {
        opacity: 0;
        animation: none;
        transform: translateY(calc(-50% + 8px));
      }
    `;
    document.head.appendChild(style);
  }
}
