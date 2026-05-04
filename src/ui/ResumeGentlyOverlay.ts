export interface ResumeGentlyOverlayOptions {
  onResume: () => void;
  title?: string;
  detail?: string;
  actionLabel?: string;
}

const DEFAULT_TITLE = 'おかえり！';
const DEFAULT_DETAIL = 'だいじょうぶ。つづきから あそべるよ ✨';
const DEFAULT_ACTION_LABEL = 'タップして やさしく さいかい';

export class ResumeGentlyOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private onResume: (() => void) | null = null;
  private tapListener: ((event: Event) => void) | null = null;

  show(options: ResumeGentlyOverlayOptions): void {
    this.onResume = options.onResume;

    if (this.overlayEl) {
      this.updateContent(options);
      return;
    }

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;
    const overlay = document.createElement('div');
    overlay.setAttribute('data-resume-gently-overlay', '');
    overlay.setAttribute('data-resume-overlay', '');
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('aria-label', DEFAULT_ACTION_LABEL);
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(8, 14, 40, 0.74);
      pointer-events: auto;
      z-index: 30;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      padding: 24px;
      box-sizing: border-box;
    `;

    overlay.innerHTML = `
      <div data-resume-gently-card style="
        width: min(100%, 520px);
        font-family: 'Zen Maru Gothic', sans-serif;
        color: #fff;
        background: rgba(20, 30, 70, 0.94);
        border-radius: 32px;
        padding: clamp(24px, 5vw, 40px);
        text-align: center;
        box-shadow:
          0 0 32px rgba(120, 180, 255, 0.42),
          0 8px 24px rgba(0, 0, 0, 0.45);
        transform: scale(0.92);
        animation: resume-gently-overlay-pop 320ms ease-out forwards;
      ">
        <div style="font-size: clamp(42px, 8vw, 88px); line-height: 1.1;">🪐</div>
        <div data-resume-gently-title style="font-size: clamp(28px, 5.5vw, 54px); font-weight: 900; margin-top: 8px;"></div>
        <div data-resume-gently-detail style="font-size: clamp(18px, 3.2vw, 28px); font-weight: 700; line-height: 1.5; margin-top: 14px; opacity: 0.9;"></div>
        <div data-resume-gently-action style="font-size: clamp(18px, 3vw, 26px); font-weight: 900; margin-top: 18px; color: #ffe88a;"></div>
      </div>
    `;

    this.ensureKeyframes();
    this.overlayEl = overlay;
    this.updateContent(options);

    const handleTap = (event: Event): void => {
      event.preventDefault();
      this.handleResume();
    };
    overlay.addEventListener('pointerdown', handleTap);
    overlay.addEventListener('click', handleTap);
    this.tapListener = handleTap;

    uiOverlay.appendChild(overlay);
  }

  hide(): void {
    if (this.overlayEl && this.tapListener) {
      this.overlayEl.removeEventListener('pointerdown', this.tapListener);
      this.overlayEl.removeEventListener('click', this.tapListener);
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.tapListener = null;
    this.onResume = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }

  private updateContent(options: ResumeGentlyOverlayOptions): void {
    if (!this.overlayEl) {
      return;
    }

    const title = options.title ?? DEFAULT_TITLE;
    const detail = options.detail ?? DEFAULT_DETAIL;
    const actionLabel = options.actionLabel ?? DEFAULT_ACTION_LABEL;
    this.overlayEl.setAttribute('aria-label', actionLabel);
    const titleEl = this.overlayEl.querySelector('[data-resume-gently-title]');
    const detailEl = this.overlayEl.querySelector('[data-resume-gently-detail]');
    const actionEl = this.overlayEl.querySelector('[data-resume-gently-action]');
    if (titleEl) titleEl.textContent = title;
    if (detailEl) detailEl.textContent = detail;
    if (actionEl) actionEl.textContent = `${actionLabel} ▶`;
  }

  private handleResume(): void {
    const callback = this.onResume;
    this.hide();
    try {
      callback?.();
    } catch {
      /* ignore */
    }
  }

  private ensureKeyframes(): void {
    const id = 'resume-gently-overlay-keyframes';
    if (document.getElementById(id)) {
      return;
    }

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes resume-gently-overlay-pop {
        0%   { transform: scale(0.72); opacity: 0; }
        60%  { transform: scale(1.04); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}
