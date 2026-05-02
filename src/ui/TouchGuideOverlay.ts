export type TouchGuideMode = 'intro' | 'idle' | 'hidden' | 'assist-left' | 'assist-right';

export class TouchGuideOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private leftGuideEl: HTMLDivElement | null = null;
  private rightGuideEl: HTMLDivElement | null = null;
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

    this.leftGuideEl = this.createGuide('left', '⬅️ ひだり');
    this.rightGuideEl = this.createGuide('right', 'みぎ ➡️');
    this.overlayEl.appendChild(this.leftGuideEl);
    this.overlayEl.appendChild(this.rightGuideEl);
    uiOverlay.appendChild(this.overlayEl);
    this.setMode(initialMode);
  }

  setMode(mode: TouchGuideMode): void {
    if (!this.overlayEl || this.currentMode === mode) return;
    this.currentMode = mode;
    this.overlayEl.setAttribute('data-touch-guide-state', mode);
    this.overlayEl.setAttribute('data-touch-guide-active-side', this.getActiveSide(mode));
    this.overlayEl.setAttribute('aria-hidden', mode === 'hidden' ? 'true' : 'false');
    this.overlayEl.style.visibility = mode === 'hidden' ? 'hidden' : 'visible';
    this.leftGuideEl?.setAttribute('data-touch-guide-emphasis', this.getGuideEmphasis('left', mode));
    this.rightGuideEl?.setAttribute('data-touch-guide-emphasis', this.getGuideEmphasis('right', mode));
  }

  hide(): void {
    if (!this.overlayEl) return;
    this.overlayEl.remove();
    this.overlayEl = null;
    this.leftGuideEl = null;
    this.rightGuideEl = null;
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

      @keyframes touchGuideAssistPulse {
        0%, 100% {
          transform: translateY(-50%) scale(1);
          box-shadow: 0 0 0 rgba(109, 214, 255, 0);
        }
        50% {
          transform: translateY(-50%) scale(1.08);
          box-shadow: 0 0 28px rgba(109, 214, 255, 0.48);
        }
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

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide] {
        animation: none;
      }

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide][data-touch-guide-emphasis="primary"] {
        opacity: 1;
        background: rgba(38, 94, 182, 0.72);
        border-color: rgba(255, 255, 255, 0.72);
        transform: translateY(-50%) scale(1.04);
        box-shadow: 0 0 26px rgba(109, 214, 255, 0.45);
        animation: touchGuideAssistPulse 0.92s ease-in-out infinite;
      }

      [data-touch-guide-overlay][data-touch-guide-state^="assist-"] [data-touch-guide][data-touch-guide-emphasis="secondary"] {
        opacity: 0.2;
        transform: translateY(-50%) scale(0.96);
      }
    `;
    document.head.appendChild(style);
  }

  private getActiveSide(mode: TouchGuideMode): 'left' | 'right' | 'both' | 'none' {
    if (mode === 'assist-left') return 'left';
    if (mode === 'assist-right') return 'right';
    if (mode === 'hidden') return 'none';
    return 'both';
  }

  private getGuideEmphasis(side: 'left' | 'right', mode: TouchGuideMode): 'primary' | 'secondary' | 'balanced' | 'hidden' {
    if (mode === 'assist-left') return side === 'left' ? 'primary' : 'secondary';
    if (mode === 'assist-right') return side === 'right' ? 'primary' : 'secondary';
    if (mode === 'hidden') return 'hidden';
    return 'balanced';
  }
}
