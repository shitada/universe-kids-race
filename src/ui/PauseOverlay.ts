export class PauseOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private activePressCleanups = new Set<() => void>();

  show(onContinue: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-pause-overlay', '');
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-label', 'やすみ ちゅう');
    this.overlayEl.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 55;
      background: rgba(0, 0, 32, 0.84);
      padding: 1.2rem;
      box-sizing: border-box;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
      width: min(90vw, 420px);
      padding: 1.5rem 1.3rem 1.7rem;
      border-radius: 1.8rem;
      background: linear-gradient(180deg, rgba(28, 42, 112, 0.95), rgba(10, 18, 56, 0.96));
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.36);
      text-align: center;
    `;
    card.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });

    const icon = document.createElement('div');
    icon.textContent = '⏸';
    icon.setAttribute('aria-hidden', 'true');
    icon.style.cssText = `
      font-size: clamp(3rem, 11vmin, 4.4rem);
      line-height: 1;
    `;

    const title = document.createElement('div');
    title.textContent = 'やすみ ちゅう';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.8rem, 6vmin, 2.4rem);
      font-weight: 900;
      color: #fff4a3;
      text-shadow: 0 0 16px rgba(255, 220, 120, 0.25);
    `;

    const message = document.createElement('div');
    message.textContent = 'じゅんびが できたら つづけよう';
    message.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.8vmin, 1.25rem);
      font-weight: 700;
      color: #e7f1ff;
      line-height: 1.45;
    `;

    const continueButton = document.createElement('button');
    continueButton.setAttribute('data-pause-continue', '');
    continueButton.setAttribute('aria-label', 'つづける');
    continueButton.textContent = '▶ つづける';
    continueButton.style.cssText = `
      min-width: min(72vw, 300px);
      min-height: 88px;
      padding: 1rem 1.8rem;
      border: none;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1.35rem, 4.6vmin, 1.8rem);
      font-weight: 900;
      color: #15204d;
      background: linear-gradient(135deg, #ffe66d, #7ef0ff);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.28);
      touch-action: manipulation;
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.attachPress(continueButton, () => {
      this.hide();
      onContinue();
    });

    card.append(icon, title, message, continueButton);
    this.overlayEl.appendChild(card);
    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (!this.overlayEl) return;
    const activePressCleanups = Array.from(this.activePressCleanups);
    this.activePressCleanups.clear();
    for (const cleanup of activePressCleanups) {
      cleanup();
    }
    this.overlayEl.remove();
    this.overlayEl = null;
  }

  dispose(): void {
    this.hide();
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }

  private attachPress(btn: HTMLButtonElement, onActivate: () => void): void {
    let pointerActive = false;
    let suppressNextClick = false;

    const release = (): void => {
      btn.style.transform = 'scale(1)';
    };
    const cleanupActivePress = (): void => {
      clearPointerState(true);
    };
    const clearPointerState = (suppressClick = false): void => {
      pointerActive = false;
      suppressNextClick = suppressClick;
      release();
      this.activePressCleanups.delete(cleanupActivePress);
      document.removeEventListener('pointerup', handleDocumentPointerUp, true);
      document.removeEventListener('pointercancel', handleDocumentPointerCancel, true);
    };
    const handleDocumentPointerUp = (event: Event): void => {
      const releasedOnButton =
        event.target === btn || (event.target instanceof Node && btn.contains(event.target));
      const shouldActivate = pointerActive && releasedOnButton;
      clearPointerState(!releasedOnButton);
      if (shouldActivate) {
        onActivate();
      }
    };
    const handleDocumentPointerCancel = (): void => {
      clearPointerState(true);
    };

    btn.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
      pointerActive = true;
      suppressNextClick = false;
      btn.style.transform = 'scale(0.96)';
      this.activePressCleanups.add(cleanupActivePress);
      document.addEventListener('pointerup', handleDocumentPointerUp, true);
      document.addEventListener('pointercancel', handleDocumentPointerCancel, true);
    });
    btn.addEventListener('pointerenter', () => {
      if (pointerActive) {
        btn.style.transform = 'scale(0.96)';
      }
    });
    btn.addEventListener('pointerleave', () => {
      if (pointerActive) {
        release();
      }
    });
    btn.addEventListener('pointercancel', () => clearPointerState(true));
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      if (!pointerActive) {
        onActivate();
      }
    });
  }
}
