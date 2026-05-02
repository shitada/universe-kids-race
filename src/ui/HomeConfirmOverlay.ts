/**
 * Child-friendly confirmation overlay shown when the player taps the
 * 🏠 button on the in-stage HUD. Prevents losing stage progress from
 * accidental taps (Constitution I: 子供ファースト).
 *
 * Style follows ContextLossOverlay / TutorialOverlay:
 * - Zen Maru Gothic font family
 * - 濃紺背景 (rgba(0, 0, 32, 0.92))
 * - 黄色見出し (#FFD700)
 * - Minimum tap target 88x88px (Constitution III)
 * - z-index: 60 (same layer as ContextLossOverlay)
 *
 * The overlay is purely DOM (HUD layer) and does not touch the
 * Three.js render path (Constitution IV: 60fps preserved).
 */
export class HomeConfirmOverlay {
  private overlayEl: HTMLDivElement | null = null;
  private activePressCleanups = new Set<() => void>();

  show(onConfirm: () => void, onCancel: () => void): void {
    if (this.overlayEl) return;

    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.overlayEl = document.createElement('div');
    this.overlayEl.setAttribute('data-home-confirm-overlay', '');
    this.overlayEl.setAttribute('role', 'dialog');
    this.overlayEl.setAttribute('aria-modal', 'true');
    this.overlayEl.setAttribute('aria-label', 'ホームへ もどりますか');
    this.overlayEl.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
      z-index: 60;
    `;
    // Set test-asserted critical style properties individually AFTER cssText
    // so they survive jsdom's strict CSS parser.
    this.overlayEl.style.background = 'rgba(0, 0, 32, 0.92)';

    let triggered = false;
    const fireCancel = (): void => {
      if (triggered) return;
      triggered = true;
      this.hide();
      onCancel();
    };
    const fireConfirm = (): void => {
      if (triggered) return;
      triggered = true;
      this.hide();
      onConfirm();
    };

    // Background tap (on overlay itself, not on inner card) cancels.
    this.overlayEl.addEventListener('pointerdown', (e) => {
      if (e.target === this.overlayEl) {
        fireCancel();
      }
    });

    const card = document.createElement('div');
    card.setAttribute('data-home-confirm-card', '');
    card.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 0, 64, 0.85);
      border-radius: 1.6rem;
      padding: 1.6rem 1.4rem;
      max-width: min(90vw, 420px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
    `;
    // Stop background-cancel from firing for taps inside the card.
    card.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
    this.overlayEl.appendChild(card);

    const title = document.createElement('div');
    title.textContent = 'タイトルへ もどる？';
    title.style.cssText = `
      font-size: 1.8rem;
      font-weight: 900;
      text-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
      margin-bottom: 1.2rem;
      text-align: center;
      padding: 0 0.6rem;
      white-space: nowrap;
    `;
    title.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    title.style.color = '#FFD700';
    card.appendChild(title);

    const btnRow = document.createElement('div');
    btnRow.style.cssText = `
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
    `;
    card.appendChild(btnRow);

    const baseBtnCss = `
      font-size: clamp(1.1rem, 3.6vmin, 1.4rem);
      font-weight: 900;
      padding: 1rem 1.4rem;
      border: none;
      border-radius: 1.6rem;
      cursor: pointer;
      pointer-events: auto;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
      white-space: nowrap;
    `;

    const attachPress = (btn: HTMLButtonElement, onActivate: () => void): void => {
      let pointerActive = false;
      let suppressNextClick = false;
      const cleanupActivePress = (): void => {
        clearPointerState(true);
      };

      const press = (): void => {
        btn.style.transform = 'scale(0.9)';
      };
      const release = (): void => {
        btn.style.transform = 'scale(1)';
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

      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        pointerActive = true;
        suppressNextClick = false;
        press();
        this.activePressCleanups.add(cleanupActivePress);
        document.addEventListener('pointerup', handleDocumentPointerUp, true);
        document.addEventListener('pointercancel', handleDocumentPointerCancel, true);
      });
      btn.addEventListener('pointerenter', () => {
        if (pointerActive) {
          press();
        }
      });
      btn.addEventListener('pointerleave', () => {
        if (pointerActive) {
          release();
        }
      });
      btn.addEventListener('pointercancel', () => clearPointerState(true));
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }
        if (!pointerActive) {
          onActivate();
        }
      });
    };

    // Back button (left, weaker color to discourage misclick).
    const backBtn = document.createElement('button');
    backBtn.setAttribute('data-home-confirm-back', '');
    backBtn.setAttribute('aria-label', 'タイトルへ もどる');
    backBtn.textContent = '🏠 タイトルへ もどる';
    backBtn.style.cssText = baseBtnCss;
    backBtn.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    backBtn.style.background = 'rgba(255, 255, 255, 0.18)';
    backBtn.style.color = '#ffffff';
    backBtn.style.minWidth = '88px';
    backBtn.style.minHeight = '88px';
    backBtn.style.touchAction = 'manipulation';
    backBtn.style.transform = 'scale(1)';
    backBtn.style.transition = 'transform 0.08s ease-out';
    backBtn.style.whiteSpace = 'nowrap';
    attachPress(backBtn, fireConfirm);
    btnRow.appendChild(backBtn);

    // Continue button (right, default action with bright color).
    const continueBtn = document.createElement('button');
    continueBtn.setAttribute('data-home-confirm-continue', '');
    continueBtn.setAttribute('aria-label', 'つづける');
    continueBtn.textContent = '✋ つづける';
    continueBtn.style.cssText = baseBtnCss;
    continueBtn.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    continueBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #FFE66D)';
    continueBtn.style.color = '#FFD700';
    continueBtn.style.textShadow = '0 1px 2px rgba(0, 0, 32, 0.6)';
    continueBtn.style.minWidth = '88px';
    continueBtn.style.minHeight = '88px';
    continueBtn.style.touchAction = 'manipulation';
    continueBtn.style.transform = 'scale(1)';
    continueBtn.style.transition = 'transform 0.08s ease-out';
    continueBtn.style.whiteSpace = 'nowrap';
    attachPress(continueBtn, fireCancel);
    btnRow.appendChild(continueBtn);

    uiOverlay.appendChild(this.overlayEl);
  }

  hide(): void {
    if (this.overlayEl) {
      const activePressCleanups = Array.from(this.activePressCleanups);
      this.activePressCleanups.clear();
      for (const cleanup of activePressCleanups) {
        cleanup();
      }
      this.overlayEl.remove();
      this.overlayEl = null;
    }
  }

  isVisible(): boolean {
    return this.overlayEl !== null;
  }
}
