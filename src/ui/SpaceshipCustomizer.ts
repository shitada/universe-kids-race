import {
  DEFAULT_SPACESHIP_CUSTOMIZATION,
  type SpaceshipColorKey,
  type SpaceshipCustomization,
} from '../types';
import {
  SpaceshipMaterialManager,
  type SpaceshipColorOption,
} from '../game/entities/SpaceshipMaterialManager';
import { attachReleaseConfirmButton } from './attachReleaseConfirmButton';

export interface SpaceshipCustomizerOptions {
  initialCustomization: SpaceshipCustomization;
  onComplete: (customization: SpaceshipCustomization) => void;
}

export class SpaceshipCustomizer {
  private overlay: HTMLDivElement | null = null;
  private previewBody: HTMLDivElement | null = null;
  private previewNose: HTMLDivElement | null = null;
  private previewWings: HTMLDivElement | null = null;
  private readonly buttonCleanups = new Set<() => void>();
  private readonly optionButtons = new Map<string, HTMLButtonElement>();
  private draft: SpaceshipCustomization = { ...DEFAULT_SPACESHIP_CUSTOMIZATION };
  private readonly colorOptions = SpaceshipMaterialManager.getColorOptions();

  show(options: SpaceshipCustomizerOptions): void {
    this.hide();

    const host = document.getElementById('ui-overlay');
    if (!host) return;

    this.draft = SpaceshipMaterialManager.normalizeCustomization(options.initialCustomization);

    this.overlay = document.createElement('div');
    this.overlay.setAttribute('data-spaceship-customizer', '');
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-label', 'うちゅうせんを かざろう');
    this.overlay.style.cssText = `
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.65rem;
      background: rgba(2, 8, 28, 0.82);
      backdrop-filter: blur(8px);
      z-index: 56;
      pointer-events: auto;
      box-sizing: border-box;
      overflow: hidden;
    `;

    const panel = document.createElement('div');
    panel.setAttribute('data-spaceship-customizer-panel', '');
    panel.style.cssText = `
      width: min(96vw, 58rem);
      height: 100%;
      max-height: 720px;
      overflow-x: hidden;
      overflow-y: hidden;
      padding: 0.75rem;
      border-radius: 1.5rem;
      background: linear-gradient(180deg, rgba(12, 25, 76, 0.98), rgba(7, 15, 48, 0.98));
      border: 3px solid rgba(255, 255, 255, 0.94);
      box-shadow: 0 24px 54px rgba(0, 0, 0, 0.4);
      color: #fff;
      font-family: 'Zen Maru Gothic', sans-serif;
      text-align: center;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;
    panel.style.overflowY = 'hidden';
    panel.style.height = '100%';
    panel.style.maxHeight = '720px';
    panel.addEventListener('pointerdown', (event) => event.stopPropagation());
    this.overlay.appendChild(panel);

    const title = document.createElement('h2');
    title.textContent = 'うちゅうせんを かざろう';
    title.style.cssText = 'margin: 0 0 0.3rem; font-size: clamp(1.25rem, 4.3vmin, 1.85rem); color: #ffe66d;';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'おおきな ボタンで えらぶと、すぐに みためが かわるよ。';
    subtitle.style.cssText = 'margin: 0 0 0.45rem; font-size: clamp(0.85rem, 2.8vmin, 1rem); line-height: 1.35;';

    panel.appendChild(title);
    panel.appendChild(subtitle);
    const content = document.createElement('div');
    content.setAttribute('data-spaceship-customizer-content', '');
    content.style.cssText = 'display: grid; grid-template-columns: minmax(12rem, 15rem) minmax(0, 1fr); gap: 0.65rem; align-items: stretch; margin: 0.45rem 0 0.65rem;';
    content.appendChild(this.createPreviewCard());

    const sections = document.createElement('div');
    sections.setAttribute('data-spaceship-customizer-sections', '');
    sections.style.cssText = 'display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.5rem; align-items: stretch;';
    sections.appendChild(this.createPartSection('bodyColor', 'ほんたい'));
    sections.appendChild(this.createPartSection('noseColor', 'ノーズ'));
    sections.appendChild(this.createPartSection('wingColor', 'つばさ'));
    content.appendChild(sections);
    panel.appendChild(content);

    const doneButton = document.createElement('button');
    doneButton.textContent = 'かんりょう';
    doneButton.setAttribute('data-spaceship-customizer-done', '');
    doneButton.style.cssText = `
      width: min(100%, 14rem);
      min-height: 54px;
      padding: 0.65rem 1rem;
      border: none;
      border-radius: 999px;
      background: linear-gradient(135deg, #ffcf6b, #ffe66d);
      color: #2b2140;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: clamp(1rem, 3.4vmin, 1.18rem);
      font-weight: 900;
      cursor: pointer;
      touch-action: manipulation;
      box-shadow: 0 8px 24px rgba(255, 207, 107, 0.35);
      transform: scale(1);
      transition: transform 0.08s ease-out;
    `;
    this.buttonCleanups.add(attachReleaseConfirmButton(doneButton, {
      onActivate: () => {
        const next = { ...this.draft };
        this.hide();
        options.onComplete(next);
      },
      onPressChange: (pressed) => {
        doneButton.style.transform = pressed ? 'scale(0.96)' : 'scale(1)';
      },
    }));
    panel.appendChild(doneButton);

    host.appendChild(this.overlay);
    this.render();
  }

  hide(): void {
    const cleanups = Array.from(this.buttonCleanups);
    this.buttonCleanups.clear();
    for (const cleanup of cleanups) {
      cleanup();
    }
    this.optionButtons.clear();
    this.overlay?.remove();
    this.overlay = null;
    this.previewBody = null;
    this.previewNose = null;
    this.previewWings = null;
  }

  isVisible(): boolean {
    return this.overlay?.isConnected === true;
  }

  private createPreviewCard(): HTMLDivElement {
    const card = document.createElement('div');
    card.setAttribute('data-spaceship-customizer-preview-card', '');
    card.style.cssText = `
      width: 100%;
      margin: 0;
      height: 100%;
      padding: 0.6rem;
      border-radius: 1.4rem;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
    `;

    const label = document.createElement('div');
    label.textContent = 'プレビュー';
    label.style.cssText = 'margin-bottom: 0.35rem; font-size: 0.85rem; font-weight: 700; color: #dff4ff;';
    card.appendChild(label);

    const preview = document.createElement('div');
    preview.setAttribute('data-spaceship-customizer-preview', '');
    preview.style.cssText = `
      position: relative;
      width: min(100%, 14rem);
      height: 7.5rem;
      margin: 0 auto;
      border-radius: 1.4rem;
      background: radial-gradient(circle at top, rgba(123, 206, 255, 0.36), rgba(18, 28, 74, 0.95));
      overflow: hidden;
    `;

    const starDust = document.createElement('div');
    starDust.style.cssText = `
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(circle, rgba(255,255,255,0.9) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.75) 0 1px, transparent 1.5px),
        radial-gradient(circle, rgba(255,255,255,0.65) 0 1px, transparent 1.5px);
      background-size: 48px 48px, 70px 70px, 88px 88px;
      background-position: 0 0, 14px 18px, 26px 8px;
      opacity: 0.85;
    `;
    preview.appendChild(starDust);

    this.previewWings = document.createElement('div');
    this.previewWings.style.cssText = `
      position: absolute;
      left: 50%;
      top: 58%;
      width: 76%;
      height: 18%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
    `;

    this.previewBody = document.createElement('div');
    this.previewBody.style.cssText = `
      position: absolute;
      left: 50%;
      top: 57%;
      width: 24%;
      height: 58%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.22);
    `;

    this.previewNose = document.createElement('div');
    this.previewNose.style.cssText = `
      position: absolute;
      left: 50%;
      top: 8%;
      width: 0;
      height: 0;
      border-left: 24px solid transparent;
      border-right: 24px solid transparent;
      border-bottom: 54px solid #fff;
      transform: translateX(-50%);
      filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.18));
    `;

    const cockpit = document.createElement('div');
    cockpit.style.cssText = `
      position: absolute;
      left: 50%;
      top: 52%;
      width: 12%;
      height: 18%;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.82);
      border: 3px solid rgba(8, 16, 40, 0.18);
    `;

    preview.appendChild(this.previewWings);
    preview.appendChild(this.previewBody);
    preview.appendChild(this.previewNose);
    preview.appendChild(cockpit);
    card.appendChild(preview);
    return card;
  }

  private createPartSection(part: keyof SpaceshipCustomization, label: string): HTMLDivElement {
    const section = document.createElement('div');
    section.style.cssText = `
      padding: 0.5rem 0.45rem;
      border-radius: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      text-align: left;
      box-sizing: border-box;
    `;

    const heading = document.createElement('div');
    heading.textContent = label;
    heading.style.cssText = 'margin-bottom: 0.25rem; font-size: 0.88rem; font-weight: 900; color: #ffe66d; text-align: center;';
    section.appendChild(heading);

    const buttonRow = document.createElement('div');
    buttonRow.style.cssText = 'display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.32rem;';

    for (const option of this.colorOptions) {
      buttonRow.appendChild(this.createColorButton(part, option));
    }

    section.appendChild(buttonRow);
    return section;
  }

  private createColorButton(part: keyof SpaceshipCustomization, option: SpaceshipColorOption): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('data-spaceship-color-option', `${part}:${option.key}`);
    button.style.cssText = `
      width: 100%;
      min-height: 46px;
      padding: 0.42rem 0.5rem;
      border-radius: 1rem;
      border: 3px solid transparent;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      touch-action: manipulation;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 0.45rem;
      transform: scale(1);
      transition: transform 0.08s ease-out, border-color 0.08s ease-out;
    `;

    const swatch = document.createElement('span');
    swatch.setAttribute('data-spaceship-color-swatch', option.key);
    swatch.setAttribute('data-color-hex', `#${option.hex.toString(16).padStart(6, '0')}`);
    swatch.style.cssText = `
      display: block;
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 999px;
      background: #${option.hex.toString(16).padStart(6, '0')};
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.24);
    `;

    const label = document.createElement('span');
    label.textContent = option.label;
    label.style.cssText = 'font-family: Zen Maru Gothic, sans-serif; font-size: 0.82rem; font-weight: 700;';

    button.appendChild(swatch);
    button.appendChild(label);

    this.buttonCleanups.add(attachReleaseConfirmButton(button, {
      onActivate: () => this.selectColor(part, option.key),
      onPressChange: (pressed) => {
        button.style.transform = pressed ? 'scale(0.95)' : 'scale(1)';
      },
    }));

    this.optionButtons.set(`${part}:${option.key}`, button);
    return button;
  }

  private selectColor(part: keyof SpaceshipCustomization, colorKey: SpaceshipColorKey): void {
    this.draft = {
      ...this.draft,
      [part]: colorKey,
    } as SpaceshipCustomization;
    this.render();
  }

  private render(): void {
    const normalized = SpaceshipMaterialManager.normalizeCustomization(this.draft);
    this.draft = normalized;

    this.previewBody?.style.setProperty(
      'background',
      `#${SpaceshipMaterialManager.getColorHex(normalized.bodyColor).toString(16).padStart(6, '0')}`,
    );
    this.previewWings?.style.setProperty(
      'background',
      `#${SpaceshipMaterialManager.getColorHex(normalized.wingColor).toString(16).padStart(6, '0')}`,
    );
    if (this.previewNose) {
      this.previewNose.style.borderBottomColor = `#${SpaceshipMaterialManager.getColorHex(normalized.noseColor)
        .toString(16)
        .padStart(6, '0')}`;
    }

    for (const option of this.colorOptions) {
      this.renderOptionState('bodyColor', option.key, normalized.bodyColor === option.key);
      this.renderOptionState('noseColor', option.key, normalized.noseColor === option.key);
      this.renderOptionState('wingColor', option.key, normalized.wingColor === option.key);
    }
  }

  private renderOptionState(part: keyof SpaceshipCustomization, colorKey: SpaceshipColorKey, selected: boolean): void {
    const button = this.optionButtons.get(`${part}:${colorKey}`);
    if (!button) return;
    button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    button.style.borderColor = selected ? '#ffe66d' : 'transparent';
    button.style.background = selected ? 'rgba(255, 230, 109, 0.18)' : 'rgba(255, 255, 255, 0.12)';
  }
}
