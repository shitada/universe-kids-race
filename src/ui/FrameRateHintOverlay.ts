export interface FrameRateHintOverlayOptions {
  level: number;
}

const DISPLAY_DURATION_MS = 2600;

const HINT_COPY = {
  gentle: {
    title: 'じどうで かるくしたよ ⭐',
    detail: 'ほしと きらきらを すこし やさしくして なめらかに したよ',
  },
  stronger: {
    title: 'もっと じどうで かるくしたよ 🚀',
    detail: 'なめらかに あそべるように えんしゅつを ぎゅっと したよ',
  },
} as const;

export class FrameRateHintOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private hideTimer: number | null = null;

  show(options: FrameRateHintOverlayOptions): void {
    if (!this.overlayEl) {
      const uiOverlay = document.getElementById('ui-overlay') ?? document.body;
      const overlay = document.createElement('div');
      overlay.setAttribute('data-frame-rate-hint-overlay', '');
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.style.cssText = `
        position: absolute;
        top: max(18px, env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        width: min(86vw, 560px);
        pointer-events: none;
        z-index: 55;
        font-family: 'Zen Maru Gothic', sans-serif;
      `;
      overlay.innerHTML = `
        <div style="
          border-radius: 28px;
          padding: 16px 20px;
          background: rgba(16, 28, 72, 0.92);
          box-shadow:
            0 0 24px rgba(120, 180, 255, 0.28),
            0 8px 22px rgba(0, 0, 0, 0.3);
          color: #fff;
          text-align: center;
        ">
          <div data-frame-rate-hint-title style="font-size: clamp(18px, 3vw, 28px); font-weight: 900;"></div>
          <div data-frame-rate-hint-detail style="margin-top: 6px; font-size: clamp(14px, 2.2vw, 20px); font-weight: 700; line-height: 1.5; opacity: 0.92;"></div>
        </div>
      `;
      this.overlayEl = overlay;
      uiOverlay.appendChild(overlay);
    }

    const copy = options.level >= 2 ? HINT_COPY.stronger : HINT_COPY.gentle;
    const titleEl = this.overlayEl.querySelector<HTMLElement>('[data-frame-rate-hint-title]');
    const detailEl = this.overlayEl.querySelector<HTMLElement>('[data-frame-rate-hint-detail]');
    if (titleEl) {
      titleEl.textContent = copy.title;
    }
    if (detailEl) {
      detailEl.textContent = copy.detail;
    }

    if (this.hideTimer !== null) {
      window.clearTimeout(this.hideTimer);
    }
    this.hideTimer = window.setTimeout(() => {
      this.hide();
    }, DISPLAY_DURATION_MS);
  }

  hide(): void {
    if (this.hideTimer !== null) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
