export class TitleResetConfirmOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private activePressCleanups = new Set<() => void>();

  show(onConfirm: () => void, onCancel: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-title-reset-confirm-overlay', '');
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-label', 'さいしょからに もどしますか');
    this.overlayEl.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 55;
      padding: 1.5rem;
      background: rgba(0, 0, 32, 0.92);
    `;

    let handled = false;
    const fireCancel = (): void => {
      if (handled) return;
      handled = true;
      this.hide();
      onCancel();
    };
    const fireConfirm = (): void => {
      if (handled) return;
      handled = true;
      this.hide();
      onConfirm();
    };

    this.overlayEl.addEventListener('pointerdown', (event) => {
      if (event.target === this.overlayEl) {
        fireCancel();
      }
    });

    const card = document.createElement('div');
    card.setAttribute('data-title-reset-confirm-card', '');
    card.style.cssText = `
      width: min(88vw, 26rem);
      padding: 1.6rem 1.4rem;
      border-radius: 1.7rem;
      background: rgba(0, 0, 64, 0.9);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.42);
      text-align: center;
      color: #fff;
    `;
    card.addEventListener('pointerdown', (event) => {
      event.stopPropagation();
    });
    this.overlayEl.appendChild(card);

    const title = document.createElement('div');
    title.textContent = 'さいしょからに する？';
    title.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.7rem;
      font-weight: 900;
      color: #FFD700;
      text-shadow: 0 0 16px rgba(255, 215, 0, 0.45);
      margin-bottom: 0.8rem;
    `;
    card.appendChild(title);

    const message = document.createElement('div');
    message.textContent = 'いまの すすみぐあいだけ きえて、ステージ 1 から あそべるよ';
    message.style.cssText = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      margin-bottom: 1.2rem;
    `;
    card.appendChild(message);

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = `
      display: flex;
      gap: 0.8rem;
      justify-content: center;
      flex-wrap: wrap;
    `;
    card.appendChild(buttonRow);

    const baseButtonCss = `
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.1rem;
      font-weight: 900;
      min-width: 88px;
      min-height: 88px;
      padding: 0.9rem 1.2rem;
      border: none;
      border-radius: 1.5rem;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `;

    const attachPress = (button: HTMLButtonElement, onActivate: () => void): void => {
      let pointerActive = false;
      let suppressNextClick = false;
      const cleanupActivePress = (): void => {
        clearPointerState(true);
      };

      const press = (): void => {
        button.style.transform = 'scale(0.92)';
      };
      const release = (): void => {
        button.style.transform = 'scale(1)';
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
          event.target === button || (event.target instanceof Node && button.contains(event.target));
        const shouldActivate = pointerActive && releasedOnButton;
        clearPointerState(!releasedOnButton);
        if (shouldActivate) {
          onActivate();
        }
      };
      const handleDocumentPointerCancel = (): void => {
        clearPointerState(true);
      };

      button.addEventListener('pointerdown', (event) => {
        event.stopPropagation();
        pointerActive = true;
        suppressNextClick = false;
        press();
        this.activePressCleanups.add(cleanupActivePress);
        document.addEventListener('pointerup', handleDocumentPointerUp, true);
        document.addEventListener('pointercancel', handleDocumentPointerCancel, true);
      });
      button.addEventListener('pointerenter', () => {
        if (pointerActive) {
          press();
        }
      });
      button.addEventListener('pointerleave', () => {
        if (pointerActive) {
          release();
        }
      });
      button.addEventListener('pointercancel', () => clearPointerState(true));
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }
        if (!pointerActive) {
          onActivate();
        }
      });
    };

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('data-title-reset-cancel', '');
    cancelButton.textContent = 'やめる';
    cancelButton.style.cssText = baseButtonCss;
    cancelButton.style.background = 'rgba(255, 255, 255, 0.18)';
    cancelButton.style.color = '#ffffff';
    attachPress(cancelButton, fireCancel);
    buttonRow.appendChild(cancelButton);

    const confirmButton = document.createElement('button');
    confirmButton.setAttribute('data-title-reset-confirm', '');
    confirmButton.textContent = 'うん！ さいしょから';
    confirmButton.style.cssText = baseButtonCss;
    confirmButton.style.background = 'linear-gradient(135deg, #FF9F68, #FFE66D)';
    confirmButton.style.color = '#3b1f00';
    attachPress(confirmButton, fireConfirm);
    buttonRow.appendChild(confirmButton);

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (!this.overlayEl) {
      return;
    }
    const activePressCleanups = Array.from(this.activePressCleanups);
    this.activePressCleanups.clear();
    for (const cleanup of activePressCleanups) {
      cleanup();
    }
    this.overlayEl.remove();
    this.overlayEl = null;
  }
}
