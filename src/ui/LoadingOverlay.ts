export class LoadingOverlay {
  private element: HTMLDivElement | null = null;
  private label: HTMLDivElement | null = null;

  show(message = 'よみこみ ちゅう...'): void {
    const uiOverlay = document.getElementById('ui-overlay');
    if (!uiOverlay) return;

    if (!this.element) {
      const overlay = document.createElement('div');
      overlay.setAttribute('data-loading-overlay', '');
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-live', 'polite');
      overlay.style.cssText = `
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 32, 0.72);
        pointer-events: auto;
        z-index: 40;
      `;

      const style = document.createElement('style');
      style.textContent = `
        @keyframes loading-overlay-pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.78; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes loading-overlay-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes loading-overlay-spin {
          from { transform: rotate(-10deg); }
          to { transform: rotate(10deg); }
        }
      `;

      const card = document.createElement('div');
      card.setAttribute('data-loading-card', '');
      card.style.cssText = `
        min-width: 220px;
        padding: 1rem 1.5rem 1.1rem;
        border-radius: 1.5rem;
        background: rgba(255, 255, 255, 0.16);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        text-align: center;
      `;

      const iconRow = document.createElement('div');
      iconRow.setAttribute('data-loading-icons', '');
      iconRow.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.9rem;
        margin-bottom: 0.8rem;
      `;

      const star = document.createElement('span');
      star.setAttribute('data-loading-icon', 'star');
      star.textContent = '⭐';
      star.setAttribute('aria-hidden', 'true');
      star.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.9rem;
        animation: loading-overlay-pulse 1.6s ease-in-out infinite;
      `;

      const planet = document.createElement('span');
      planet.setAttribute('data-loading-icon', 'planet');
      planet.textContent = '🪐';
      planet.setAttribute('aria-hidden', 'true');
      planet.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 2.2rem;
        animation:
          loading-overlay-float 2.1s ease-in-out infinite,
          loading-overlay-spin 2.8s ease-in-out infinite alternate;
        transform-origin: center;
      `;

      this.label = document.createElement('div');
      this.label.setAttribute('data-loading-message', '');
      this.label.style.cssText = `
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        line-height: 1.45;
      `;

      iconRow.append(star, planet);
      card.append(iconRow, this.label);
      overlay.append(style, card);

      this.element = overlay;
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
    this.element = null;
    this.label = null;
  }

  dispose(): void {
    this.hide();
  }
}
