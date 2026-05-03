import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';

export class PauseOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private activePressCleanups = new Set<() => void>();

  show(onResume: () => void, onExitHome: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay') ?? document.body;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-pause-overlay', '');
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-label', 'やすみちゅう');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
      background: rgba(0, 0, 32, 0.92);
    `;

    const card = document.createElement('div');
    card.setAttribute('data-pause-card', '');
    card.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: min(90vw, 420px);
      padding: 1.6rem 1.4rem;
      border-radius: 1.8rem;
      background: rgba(0, 0, 64, 0.85);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
      text-align: center;
      font-family: 'Zen Maru Gothic', sans-serif;
    `;
    card.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    this.overlayEl.appendChild(card);

    const title = document.createElement('div');
    title.textContent = 'ひとやすみ ちゅう';
    title.style.cssText = `
      font-size: clamp(1.8rem, 5vmin, 2.4rem);
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
    `;
    card.appendChild(title);

    const message = document.createElement('div');
    message.textContent = 'また じゅんびが できたら つづけよう';
    message.style.cssText = `
      font-size: clamp(1rem, 3.5vmin, 1.2rem);
      font-weight: 700;
      color: #ffffff;
      opacity: 0.92;
    `;
    card.appendChild(message);

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;
      align-items: stretch;
      width: 100%;
    `;
    card.appendChild(buttonRow);

    const createButton = (
      text: string,
      testId: string,
      ariaLabel: string,
      background: string,
      color: string,
      onActivate: () => void,
    ): HTMLButtonElement => {
      const button = document.createElement('button');
      button.setAttribute(testId, '');
      button.setAttribute('aria-label', ariaLabel);
      button.textContent = text;
      button.style.cssText = `
        flex: 1 1 140px;
        padding: 1rem 1.2rem;
        border: none;
        border-radius: 1.6rem;
        background: ${background};
        color: ${color};
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
        box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
        transform: scale(1);
        transition: transform 0.08s ease-out;
        white-space: nowrap;
      `;
      button.style.minWidth = '140px';
      button.style.minHeight = '88px';
      const cleanup = attachReleaseConfirmButton(button, {
        onActivate: () => {
          this.hide();
          onActivate();
        },
        onPressChange: (pressed) => {
          button.style.transform = pressed ? 'scale(0.94)' : 'scale(1)';
        },
      });
      this.activePressCleanups.add(cleanup);
      return button;
    };

    buttonRow.appendChild(
      createButton('▶ つづける', 'data-pause-continue', 'つづける', 'linear-gradient(135deg, #FF6B6B, #FFE66D)', '#1b1f52', onResume),
    );
    buttonRow.appendChild(
      createButton('🏠 おうちへ', 'data-pause-home', 'おうちへ', 'rgba(255, 255, 255, 0.18)', '#ffffff', onExitHome),
    );

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    const cleanups = Array.from(this.activePressCleanups);
    this.activePressCleanups.clear();
    for (const cleanup of cleanups) {
      cleanup();
    }
    this.overlayEl?.remove();
    this.overlayEl = null;
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
