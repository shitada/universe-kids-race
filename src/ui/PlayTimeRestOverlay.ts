export interface PlayTimeRestOverlayOptions {
  level: number;
  totalPlayTimeMs: number;
  onContinue: () => void;
  onRest: () => void;
}

const COPY = {
  gentle: {
    title: 'ちょっと やすもう ⭐',
    detail: 'うちゅうせんを すこし かるくしたよ。おちゃを のんで ひとやすみ しよう！',
    continueLabel: '▶ もうすこし あそぶ',
    restLabel: '🌙 いったん やすむ',
  },
  stronger: {
    title: 'ながめに やすもう 🪐',
    detail: '30ぷん あそんだよ。きらきらを もっと やさしくしたから、めと からだを ひとやすみ しよう！',
    continueLabel: '▶ ひとつだけ つづける',
    restLabel: '🏠 おうちで やすむ',
  },
} as const;

export class PlayTimeRestOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private onContinue: (() => void) | null = null;
  private onRest: (() => void) | null = null;

  show(options: PlayTimeRestOverlayOptions): void {
    this.onContinue = options.onContinue;
    this.onRest = options.onRest;

    if (!this.overlayEl) {
      const uiOverlay = document.getElementById('ui-overlay') ?? document.body;
      const overlay = document.createElement('div');
      overlay.setAttribute('data-play-time-rest-overlay', '');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'きゅうけいの おしらせ');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background: rgba(4, 10, 36, 0.9);
        z-index: 65;
        pointer-events: auto;
      `;

      const card = document.createElement('div');
      card.style.cssText = `
        width: min(92vw, 680px);
        min-height: min(56vh, 420px);
        max-height: min(720px, calc(100vh - 48px));
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 20px;
        padding: 28px 28px 24px;
        border-radius: 32px;
        background:
          radial-gradient(circle at top, rgba(109, 171, 255, 0.24), transparent 40%),
          rgba(16, 26, 72, 0.96);
        box-shadow:
          0 0 32px rgba(120, 180, 255, 0.28),
          0 14px 36px rgba(0, 0, 0, 0.42);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
      `;
      card.innerHTML = `
        <div>
          <div style="font-size: clamp(46px, 8vw, 72px); line-height: 1;">💤✨</div>
          <div data-play-time-rest-title style="margin-top: 10px; font-size: clamp(28px, 5vw, 48px); font-weight: 900;"></div>
          <div data-play-time-rest-minutes style="margin-top: 12px; font-size: clamp(16px, 2.8vw, 24px); font-weight: 800; color: #ffe58b;"></div>
          <div data-play-time-rest-detail style="margin-top: 14px; font-size: clamp(18px, 3vw, 28px); line-height: 1.55; font-weight: 700; opacity: 0.96;"></div>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 14px; justify-content: center;">
          <button
            type="button"
            data-play-time-rest-continue
            style="
              flex: 1 1 250px;
              min-height: 84px;
              border: none;
              border-radius: 28px;
              padding: 16px 20px;
              background: linear-gradient(135deg, #ffcf6b, #ff8c7a);
              color: #1a2456;
              font-family: 'Zen Maru Gothic', sans-serif;
              font-size: clamp(20px, 3.1vw, 28px);
              font-weight: 900;
              cursor: pointer;
            "
          ></button>
          <button
            type="button"
            data-play-time-rest-break
            style="
              flex: 1 1 250px;
              min-height: 84px;
              border: 2px solid rgba(255, 255, 255, 0.18);
              border-radius: 28px;
              padding: 16px 20px;
              background: rgba(255, 255, 255, 0.1);
              color: #fff;
              font-family: 'Zen Maru Gothic', sans-serif;
              font-size: clamp(20px, 3.1vw, 28px);
              font-weight: 900;
              cursor: pointer;
            "
          ></button>
        </div>
      `;

      overlay.appendChild(card);
      uiOverlay.appendChild(overlay);
      this.overlayEl = overlay;

      overlay.querySelector<HTMLElement>('[data-play-time-rest-continue]')?.addEventListener('click', () => {
        const callback = this.onContinue;
        this.hide();
        callback?.();
      });
      overlay.querySelector<HTMLElement>('[data-play-time-rest-break]')?.addEventListener('click', () => {
        const callback = this.onRest;
        this.hide();
        callback?.();
      });
    }

    const minutes = Math.max(1, Math.round(options.totalPlayTimeMs / 60_000));
    const copy = options.level >= 2 ? COPY.stronger : COPY.gentle;
    this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-title]')!.textContent = copy.title;
    this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-minutes]')!.textContent = `${minutes}ぷん あそんだよ`;
    this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-detail]')!.textContent = copy.detail;
    this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-continue]')!.textContent = copy.continueLabel;
    this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-break]')!.textContent = copy.restLabel;
  }

  hide(): void {
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.onContinue = null;
    this.onRest = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
