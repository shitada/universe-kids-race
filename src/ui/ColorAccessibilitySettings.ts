import type { VibrationIntensity } from '../types';

export interface ColorAccessibilitySettingsOptions {
  initialHighContrast: boolean;
  initialVibrationIntensity: VibrationIntensity;
  onToggle: (enabled: boolean) => void;
  onVibrationIntensityChange: (intensity: VibrationIntensity) => void;
}

export class ColorAccessibilitySettings {
  private overlay: HTMLDivElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private descriptionEl: HTMLParagraphElement | null = null;
  private highContrast = false;
  private vibrationIntensity: VibrationIntensity = 'medium';
  private vibrationDescriptionEl: HTMLParagraphElement | null = null;
  private vibrationButtons = new Map<VibrationIntensity, HTMLButtonElement>();

  show(options: ColorAccessibilitySettingsOptions): void {
    const host = document.getElementById('ui-overlay');
    if (!host) return;

    this.highContrast = options.initialHighContrast;
    this.vibrationIntensity = options.initialVibrationIntensity;
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
      title.textContent = 'みやすさ・しんどう せってい';
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

      const vibrationTitle = document.createElement('h3');
      vibrationTitle.textContent = 'しんどうの つよさ';
      vibrationTitle.style.cssText = 'margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.vibrationDescriptionEl = document.createElement('p');
      this.vibrationDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const vibrationGroup = document.createElement('div');
      vibrationGroup.setAttribute('data-vibration-intensity-group', '');
      vibrationGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;

      const vibrationOptions: Array<{ value: VibrationIntensity; label: string }> = [
        { value: 'strong', label: 'つよい' },
        { value: 'medium', label: 'ふつう' },
        { value: 'weak', label: 'やさしい' },
        { value: 'off', label: 'オフ' },
      ];

      for (const option of vibrationOptions) {
        const button = document.createElement('button');
        button.setAttribute('data-vibration-intensity-button', option.value);
        button.textContent = option.label;
        button.style.cssText = `
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.95rem, 3.4vmin, 1.05rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `;
        button.addEventListener('click', () => {
          this.vibrationIntensity = option.value;
          this.render();
          options.onVibrationIntensityChange(option.value);
        });
        this.vibrationButtons.set(option.value, button);
        vibrationGroup.appendChild(button);
      }

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
      panel.appendChild(vibrationTitle);
      panel.appendChild(this.vibrationDescriptionEl);
      panel.appendChild(vibrationGroup);
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
    if (!this.toggleButton || !this.descriptionEl || !this.vibrationDescriptionEl) return;
    this.descriptionEl.textContent = this.highContrast
      ? 'いろだけじゃなく ふちや しまもようで わかりやすくしているよ。'
      : 'いろだけでなく かたちや うごきでも みわけられるようにするよ。';
    this.toggleButton.textContent = this.highContrast
      ? 'みやすくする: ON'
      : 'みやすくする: OFF';
    this.toggleButton.setAttribute('aria-pressed', this.highContrast ? 'true' : 'false');

    const vibrationDescriptions: Record<VibrationIntensity, string> = {
      strong: 'しっかり つたえる しんどうだよ。',
      medium: 'ちょうどよく わかる つよさだよ。',
      weak: 'やさしく ふるえて つたえるよ。',
      off: 'しんどうの かわりに がめんが すこし ゆれるよ。',
    };
    this.vibrationDescriptionEl.textContent = vibrationDescriptions[this.vibrationIntensity];

    for (const [value, button] of this.vibrationButtons.entries()) {
      const selected = value === this.vibrationIntensity;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }
  }
}
