export class HUD {
  private container: HTMLDivElement | null = null;
  private scoreEl: HTMLSpanElement | null = null;
  private starCountEl: HTMLSpanElement | null = null;
  private boostButton: HTMLButtonElement | null = null;
  private onBoostCallback: (() => void) | null = null;

  show(): void {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return;

    this.container = document.createElement('div');
    this.container.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      color: #fff;
      font-size: 1.4rem;
      font-weight: 700;
      pointer-events: none;
    `;

    const scoreDiv = document.createElement('div');
    this.scoreEl = document.createElement('span');
    scoreDiv.textContent = 'スコア: ';
    this.scoreEl.textContent = '0';
    scoreDiv.appendChild(this.scoreEl);

    const starDiv = document.createElement('div');
    starDiv.textContent = '⭐ ';
    this.starCountEl = document.createElement('span');
    this.starCountEl.textContent = '0';
    starDiv.appendChild(this.starCountEl);

    this.container.appendChild(scoreDiv);
    this.container.appendChild(starDiv);
    hudRoot.appendChild(this.container);

    // Boost button on ui-overlay
    this.createBoostButton();
  }

  private createBoostButton(): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    this.boostButton = document.createElement('button');
    this.boostButton.textContent = 'ブースト!';
    this.boostButton.style.cssText = `
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      padding: 0.8rem 1.5rem;
      border: 3px solid #00ddff;
      border-radius: 1.5rem;
      background: rgba(0, 221, 255, 0.2);
      color: #00ddff;
      cursor: pointer;
      touch-action: manipulation;
      pointer-events: auto;
    `;

    this.boostButton.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.onBoostCallback?.();
    });

    uiOverlay.appendChild(this.boostButton);
  }

  setBoostCallback(callback: () => void): void {
    this.onBoostCallback = callback;
  }

  update(score: number, starCount: number): void {
    if (this.scoreEl) this.scoreEl.textContent = String(score);
    if (this.starCountEl) this.starCountEl.textContent = String(starCount);
  }

  hide(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
    if (this.boostButton) {
      this.boostButton.remove();
      this.boostButton = null;
    }
    this.scoreEl = null;
    this.starCountEl = null;
  }
}
