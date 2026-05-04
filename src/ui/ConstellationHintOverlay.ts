export class ConstellationHintOverlay {
  private static readonly DEFAULT_DURATION = 4.2;
  private static readonly CELEBRATION_DURATION = 3.6;

  private element: HTMLDivElement | null = null;
  private timer = 0;
  private message: string | null = null;
  private highContrast = false;

  showHint(message: string): void {
    this.showMessage(message, ConstellationHintOverlay.DEFAULT_DURATION);
  }

  showCelebration(message: string): void {
    this.showMessage(message, ConstellationHintOverlay.CELEBRATION_DURATION);
  }

  tick(deltaTime: number): void {
    if (this.timer <= 0) {
      return;
    }
    this.timer = Math.max(0, this.timer - deltaTime);
    if (this.timer === 0) {
      this.hide();
    }
  }

  hide(): void {
    this.timer = 0;
    this.message = null;
    if (this.element) {
      this.element.style.display = 'none';
      this.element.textContent = '';
      this.element.removeAttribute('data-constellation-message');
    }
  }

  setHighContrastMode(enabled: boolean): void {
    this.highContrast = enabled;
    if (this.element) {
      this.applyElementStyle(this.element);
    }
  }

  getMessage(): string | null {
    return this.message;
  }

  private showMessage(message: string, duration: number): void {
    const element = this.ensureElement();
    this.timer = duration;
    this.message = message;
    element.textContent = message;
    element.setAttribute('data-constellation-message', message);
    element.style.display = 'flex';
  }

  private ensureElement(): HTMLDivElement {
    if (this.element) {
      return this.element;
    }

    const root = document.getElementById('ui-overlay');
    const element = document.createElement('div');
    element.setAttribute('data-constellation-hint', '');
    element.setAttribute('aria-live', 'polite');
    this.applyElementStyle(element);
    element.style.display = 'none';
    root?.appendChild(element);
    this.element = element;
    return element;
  }

  private applyElementStyle(element: HTMLDivElement): void {
    element.style.cssText = `
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: min(78vw, 22rem);
      max-width: min(88vw, 26rem);
      padding: 0.7rem 1rem;
      border-radius: 999px;
      background: ${this.highContrast ? 'rgba(255, 255, 255, 0.96)' : 'rgba(18, 34, 96, 0.88)'};
      border: 2px solid ${this.highContrast ? '#102040' : 'rgba(255, 255, 255, 0.28)'};
      color: ${this.highContrast ? '#102040' : '#fff8c8'};
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      justify-content: center;
      text-align: center;
      pointer-events: none;
      z-index: 35;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;
  }
}
