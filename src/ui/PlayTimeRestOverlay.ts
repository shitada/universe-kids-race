export interface PlayTimeRestOverlayOptions {
  totalPlayTimeMs: number;
  level?: number;
  variant?: 'reminder' | 'rest-complete';
  onContinue?: () => void;
  onRest?: () => void;
  onAcknowledge?: () => void;
}

interface ConstellationPoint {
  x: number;
  y: number;
  delay: number;
}

const REMINDER_COPY = {
  1: {
    title: 'ちょっと やすもうか？ ⭐',
    detail: '15ぷん あそんだよ。ほしを みながら、てを のばして ひとやすみ しよう。',
  },
  2: {
    title: 'そろそろ ひとやすみ 🪐',
    detail: '30ぷん がんばったね。せいざが きらりんって ひかったら、おみずを のんで やすもう。',
  },
  3: {
    title: 'ながめに やすもう 🌙',
    detail: '45ぷん たびを したよ。からだと めを ぽかぽか やすませる じかんに しよう。',
  },
} as const;

const ACTION_COPY = {
  continueLabel: 'もうちょっと あそぶ',
  restLabel: 'ちょっと やすむ',
} as const;

const COMPLETE_COPY = {
  title: 'やすみの じゅんび できたよ 🌙',
  detail: 'きろくを しまったよ。おとなと いっしょに いちど おしまいにして、ゆっくり やすもう。',
  acknowledgeLabel: 'タイトルへ もどる',
} as const;

const CONSTELLATIONS: Record<number, readonly ConstellationPoint[]> = {
  1: [
    { x: 48, y: 96, delay: 0 },
    { x: 104, y: 56, delay: 0.2 },
    { x: 162, y: 86, delay: 0.4 },
    { x: 214, y: 46, delay: 0.6 },
    { x: 270, y: 84, delay: 0.8 },
  ],
  2: [
    { x: 58, y: 112, delay: 0 },
    { x: 104, y: 62, delay: 0.15 },
    { x: 148, y: 102, delay: 0.3 },
    { x: 194, y: 54, delay: 0.45 },
    { x: 242, y: 100, delay: 0.6 },
    { x: 286, y: 62, delay: 0.75 },
  ],
  3: [
    { x: 42, y: 104, delay: 0 },
    { x: 92, y: 62, delay: 0.15 },
    { x: 142, y: 118, delay: 0.3 },
    { x: 188, y: 52, delay: 0.45 },
    { x: 232, y: 108, delay: 0.6 },
    { x: 276, y: 64, delay: 0.75 },
    { x: 314, y: 102, delay: 0.9 },
  ],
};

export class PlayTimeRestOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private onContinue: (() => void) | null = null;
  private onRest: (() => void) | null = null;
  private onAcknowledge: (() => void) | null = null;

  show(options: PlayTimeRestOverlayOptions): void {
    const variant = options.variant ?? 'reminder';
    const level = Math.max(1, Math.min(3, Math.floor(options.level ?? 1)));
    this.onContinue = options.onContinue ?? null;
    this.onRest = options.onRest ?? null;
    this.onAcknowledge = options.onAcknowledge ?? null;

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
        min-height: min(56vh, 440px);
        max-height: min(720px, calc(100vh - 48px));
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 18px;
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
        <style>
          [data-play-time-rest-overlay] [data-play-time-rest-star] {
            transform-origin: center;
            animation: play-time-rest-star-pulse 2.8s ease-in-out infinite;
          }
          [data-play-time-rest-overlay] [data-play-time-rest-line] {
            animation: play-time-rest-line-glow 3.2s ease-in-out infinite;
          }
          @keyframes play-time-rest-star-pulse {
            0%, 100% { transform: scale(0.9); opacity: 0.72; }
            50% { transform: scale(1.16); opacity: 1; }
          }
          @keyframes play-time-rest-line-glow {
            0%, 100% { opacity: 0.32; }
            50% { opacity: 0.82; }
          }
        </style>
        <div>
          <div style="font-size: clamp(42px, 7vw, 64px); line-height: 1;">💤✨</div>
          <div data-play-time-rest-title style="margin-top: 10px; font-size: clamp(28px, 5vw, 48px); font-weight: 900;"></div>
          <div data-play-time-rest-minutes style="margin-top: 10px; font-size: clamp(16px, 2.8vw, 24px); font-weight: 800; color: #ffe58b;"></div>
          <div data-play-time-rest-detail style="margin-top: 12px; font-size: clamp(18px, 3vw, 28px); line-height: 1.55; font-weight: 700; opacity: 0.96;"></div>
          <div data-play-time-rest-constellation style="margin-top: 18px;"></div>
        </div>
        <div
          data-play-time-rest-actions
          style="
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            align-items: stretch;
          "
        >
          <button
            type="button"
            data-play-time-rest-continue
            style="
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
          <button
            type="button"
            data-play-time-rest-acknowledge
            style="
              display: none;
              min-height: 84px;
              border: none;
              border-radius: 28px;
              padding: 16px 20px;
              background: linear-gradient(135deg, #8fe3ff, #ffe58b);
              color: #1a2456;
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
      overlay.querySelector<HTMLElement>('[data-play-time-rest-acknowledge]')?.addEventListener('click', () => {
        const callback = this.onAcknowledge;
        this.hide();
        callback?.();
      });
    }

    const minutes = Math.max(1, Math.round(options.totalPlayTimeMs / 60_000));
    const titleEl = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-title]')!;
    const minutesEl = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-minutes]')!;
    const detailEl = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-detail]')!;
    const constellationEl = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-constellation]')!;
    const actionsEl = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-actions]')!;
    const continueButton = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-continue]')!;
    const restButton = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-break]')!;
    const acknowledgeButton = this.overlayEl.querySelector<HTMLElement>('[data-play-time-rest-acknowledge]')!;

    if (variant === 'rest-complete') {
      titleEl.textContent = COMPLETE_COPY.title;
      minutesEl.textContent = `${minutes}ぷんの きろくを しまったよ`;
      detailEl.textContent = COMPLETE_COPY.detail;
      continueButton.style.display = 'none';
      restButton.style.display = 'none';
      acknowledgeButton.style.display = 'block';
      acknowledgeButton.textContent = COMPLETE_COPY.acknowledgeLabel;
      actionsEl.style.gridTemplateColumns = '1fr';
      constellationEl.innerHTML = this.renderConstellation(3, true);
      return;
    }

    const copy = REMINDER_COPY[level as 1 | 2 | 3];
    titleEl.textContent = copy.title;
    minutesEl.textContent = `${minutes}ぷん あそんだよ`;
    detailEl.textContent = copy.detail;
    continueButton.textContent = ACTION_COPY.continueLabel;
    restButton.textContent = ACTION_COPY.restLabel;
    continueButton.style.display = 'block';
    restButton.style.display = 'block';
    acknowledgeButton.style.display = 'none';
    actionsEl.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    constellationEl.innerHTML = this.renderConstellation(level, false);
  }

  hide(): void {
    this.overlayEl?.remove();
    this.overlayEl = null;
    this.onContinue = null;
    this.onRest = null;
    this.onAcknowledge = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }

  private renderConstellation(level: number, calmPalette: boolean): string {
    const points = CONSTELLATIONS[level] ?? CONSTELLATIONS[1];
    const lines = points.slice(0, -1).map((point, index) => {
      const next = points[index + 1];
      return `
        <line
          data-play-time-rest-line
          x1="${point.x}"
          y1="${point.y}"
          x2="${next.x}"
          y2="${next.y}"
          stroke="${calmPalette ? 'rgba(173, 225, 255, 0.72)' : 'rgba(255, 229, 139, 0.72)'}"
          stroke-width="4"
          stroke-linecap="round"
          style="animation-delay: ${point.delay}s;"
        />
      `;
    }).join('');

    const stars = points.map((point) => `
      <circle
        data-play-time-rest-star
        cx="${point.x}"
        cy="${point.y}"
        r="${calmPalette ? 7 : 6}"
        fill="${calmPalette ? '#d9f4ff' : '#fff4be'}"
        style="animation-delay: ${point.delay}s;"
      />
      <circle
        cx="${point.x}"
        cy="${point.y}"
        r="${calmPalette ? 14 : 12}"
        fill="${calmPalette ? 'rgba(143, 227, 255, 0.22)' : 'rgba(255, 229, 139, 0.2)'}"
      />
    `).join('');

    return `
      <svg
        viewBox="0 0 340 170"
        width="100%"
        height="140"
        aria-hidden="true"
        style="display: block;"
      >
        <defs>
          <radialGradient id="play-time-rest-glow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stop-color="${calmPalette ? 'rgba(143, 227, 255, 0.3)' : 'rgba(255, 229, 139, 0.24)'}" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="340" height="170" rx="28" fill="url(#play-time-rest-glow)" />
        ${lines}
        ${stars}
      </svg>
    `;
  }
}
