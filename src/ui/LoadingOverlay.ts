export class LoadingOverlay {
  private element: HTMLDivElement | null = null;
  private label: HTMLDivElement | null = null;

  show(message = 'よみこみ ちゅう...'): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    if (!this.element) {
      this.element = document.createElement('div');
      this.element.setAttribute('data-loading-overlay', '');
      this.element.style.cssText = `
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 32, 0.72);
        pointer-events: auto;
        z-index: 40;
      `;

      const card = document.createElement('div');
      card.style.cssText = `
        min-width: 220px;
        padding: 1rem 1.5rem;
        border-radius: 1.5rem;
        background: rgba(255, 255, 255, 0.16);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        text-align: center;
      `;

      this.label = document.createElement('div');
      this.label.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
      `;

      card.appendChild(this.label);
      this.element.appendChild(card);
      uiOverlay.appendChild(this.element);
    }

    if (this.label) {
      this.label.textContent = message;
    }

    if (!this.element.parentElement) {
      uiOverlay.appendChild(this.element);
    }
  }

  hide(): void {
    this.element?.remove();
  }
}
