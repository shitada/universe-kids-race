export interface ColorAccessibilitySettingsOptions {
  initialHighContrast: boolean;
  onToggle: (enabled: boolean) => void;
}

export class ColorAccessibilitySettings {
  private overlay: HTMLDivElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private descriptionEl: HTMLParagraphElement | null = null;
  private highContrast = false;

  show(options: ColorAccessibilitySettingsOptions): void {
    const host = document.getElementById('ui-overlay');
    if (!host) return;

    this.highContrast = options.initialHighContrast;
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.setAttribute('data-color-accessibility-settings', '');
      this.overlay.style.cssText = `
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: rgba(2, 8, 28, 0.76);
        backdrop-filter: blur(8px);
        z-index: 24;
      `;

      const panel = document.createElement('div');
      panel.style.cssText = `
        width: min(88vw, 28rem);
        padding: 1.25rem;
        border-radius: 1.5rem;
        background: rgba(15, 23, 58, 0.96);
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
      `;

      const title = document.createElement('h2');
      title.textContent = 'いろのせってい';
      title.style.cssText = 'margin: 0 0 0.65rem; font-size: clamp(1.25rem, 4.6vmin, 1.7rem);';

      this.descriptionEl = document.createElement('p');
      this.descriptionEl.style.cssText = 'margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;';

      this.toggleButton = document.createElement('button');
      this.toggleButton.setAttribute('data-color-accessibility-toggle', '');
      this.toggleButton.style.cssText = `
        display: block;
        width: 100%;
        margin-bottom: 0.75rem;
        padding: 0.9rem 1rem;
        border-radius: 999px;
        border: 3px solid #fff;
        background: linear-gradient(135deg, #fff27a, #76f0ff);
        color: #102040;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.8vmin, 1.2rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      `;
      this.toggleButton.addEventListener('click', () => {
        this.highContrast = !this.highContrast;
        this.render();
        options.onToggle(this.highContrast);
      });

      const closeButton = document.createElement('button');
      closeButton.textContent = 'とじる';
      closeButton.style.cssText = `
        width: 100%;
        padding: 0.8rem 1rem;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.12);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(0.95rem, 3.6vmin, 1.1rem);
        font-weight: 700;
        cursor: pointer;
        touch-action: manipulation;
      `;
      closeButton.addEventListener('click', () => this.hide());

      panel.appendChild(title);
      panel.appendChild(this.descriptionEl);
      panel.appendChild(this.toggleButton);
      panel.appendChild(closeButton);
      this.overlay.appendChild(panel);
    }

    this.render();
    host.appendChild(this.overlay);
  }

  hide(): void {
    this.overlay?.remove();
  }

  isVisible(): boolean {
    return this.overlay?.isConnected === true;
  }

  private render(): void {
    if (!this.toggleButton || !this.descriptionEl) return;
    this.descriptionEl.textContent = this.highContrast
      ? 'いろだけじゃなく ふちや しまもようで わかりやすくしているよ。'
      : 'いろだけでなく かたちや うごきでも みわけられるようにするよ。';
    this.toggleButton.textContent = this.highContrast
      ? 'みやすくする: ON'
      : 'みやすくする: OFF';
    this.toggleButton.setAttribute('aria-pressed', this.highContrast ? 'true' : 'false');
  }
}
