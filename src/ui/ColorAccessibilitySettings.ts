import type {
  AudioVolumeLevel,
  ColorVisionSupportMode,
  MotionSensitivity,
  VibrationIntensity,
} from '../types';
import { getMotionSensitivityVisualProfile } from '../game/accessibility/motionSensitivity';

const AUDIO_VOLUME_OPTIONS = [
  { value: 0, label: 'しずか' },
  { value: 25, label: 'ちいさい' },
  { value: 50, label: 'ふつう' },
  { value: 75, label: 'おおきい' },
  { value: 100, label: 'さいだい' },
] as const satisfies ReadonlyArray<{ value: AudioVolumeLevel; label: string }>;

function getAudioVolumeLabel(volume: AudioVolumeLevel): string {
  return AUDIO_VOLUME_OPTIONS.find((option) => option.value === volume)?.label ?? 'ふつう';
}

export interface ColorAccessibilitySettingsOptions {
  initialHighContrast: boolean;
  initialColorVisionSupportMode: ColorVisionSupportMode;
  initialBGMVolume: AudioVolumeLevel;
  initialSFXVolume: AudioVolumeLevel;
  initialVibrationIntensity: VibrationIntensity;
  initialMotionSensitivity: MotionSensitivity;
  initialRestReminderEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  onColorVisionSupportModeChange: (mode: ColorVisionSupportMode) => void;
  onBGMVolumeChange: (volume: AudioVolumeLevel) => void;
  onSFXVolumeChange: (volume: AudioVolumeLevel) => void;
  onVibrationIntensityChange: (intensity: VibrationIntensity) => void;
  onMotionSensitivityChange: (sensitivity: MotionSensitivity) => void;
  onRestReminderToggle: (enabled: boolean) => void;
}

export class ColorAccessibilitySettings {
  private overlay: HTMLDivElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private descriptionEl: HTMLParagraphElement | null = null;
  private highContrast = false;
  private colorVisionSupportMode: ColorVisionSupportMode = 'color-only';
  private bgmVolume: AudioVolumeLevel = 100;
  private sfxVolume: AudioVolumeLevel = 100;
  private vibrationIntensity: VibrationIntensity = 'medium';
  private motionSensitivity: MotionSensitivity = 'strong';
  private restReminderEnabled = true;
  private bgmVolumeDescriptionEl: HTMLParagraphElement | null = null;
  private sfxVolumeDescriptionEl: HTMLParagraphElement | null = null;
  private bgmVolumeSlider: HTMLInputElement | null = null;
  private sfxVolumeSlider: HTMLInputElement | null = null;
  private colorVisionDescriptionEl: HTMLParagraphElement | null = null;
  private colorVisionButtons = new Map<ColorVisionSupportMode, HTMLButtonElement>();
  private vibrationDescriptionEl: HTMLParagraphElement | null = null;
  private vibrationButtons = new Map<VibrationIntensity, HTMLButtonElement>();
  private motionDescriptionEl: HTMLParagraphElement | null = null;
  private motionButtons = new Map<MotionSensitivity, HTMLButtonElement>();
  private restReminderDescriptionEl: HTMLParagraphElement | null = null;
  private restReminderToggleButton: HTMLButtonElement | null = null;
  private motionPreviewEl: HTMLDivElement | null = null;
  private motionPreviewTokenEl: HTMLDivElement | null = null;
  private motionPreviewCaptionEl: HTMLParagraphElement | null = null;
  private motionPreviewTimeoutId: number | null = null;
  private motionPreviewFrameId: number | null = null;
  private onToggle: ((enabled: boolean) => void) | null = null;
  private onColorVisionSupportModeChange: ((mode: ColorVisionSupportMode) => void) | null = null;
  private onBGMVolumeChange: ((volume: AudioVolumeLevel) => void) | null = null;
  private onSFXVolumeChange: ((volume: AudioVolumeLevel) => void) | null = null;
  private onVibrationIntensityChange: ((intensity: VibrationIntensity) => void) | null = null;
  private onMotionSensitivityChange: ((sensitivity: MotionSensitivity) => void) | null = null;
  private onRestReminderToggle: ((enabled: boolean) => void) | null = null;

  show(options: ColorAccessibilitySettingsOptions): void {
    const host = document.getElementById('ui-overlay');
    if (!host) return;

    this.highContrast = options.initialHighContrast;
    this.colorVisionSupportMode = options.initialColorVisionSupportMode;
    this.bgmVolume = options.initialBGMVolume;
    this.sfxVolume = options.initialSFXVolume;
    this.vibrationIntensity = options.initialVibrationIntensity;
    this.motionSensitivity = options.initialMotionSensitivity;
    this.restReminderEnabled = options.initialRestReminderEnabled;
    this.onToggle = options.onToggle;
    this.onColorVisionSupportModeChange = options.onColorVisionSupportModeChange;
    this.onBGMVolumeChange = options.onBGMVolumeChange;
    this.onSFXVolumeChange = options.onSFXVolumeChange;
    this.onVibrationIntensityChange = options.onVibrationIntensityChange;
    this.onMotionSensitivityChange = options.onMotionSensitivityChange;
    this.onRestReminderToggle = options.onRestReminderToggle;
    if (!this.overlay) {
      const compact = window.innerHeight <= 760;
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
        width: min(92vw, 30rem);
        padding: ${compact ? '1rem' : '1.25rem'};
        border-radius: 1.5rem;
        background: rgba(15, 23, 58, 0.96);
        border: 3px solid rgba(255, 255, 255, 0.95);
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
        color: #fff;
        font-family: 'Zen Maru Gothic', sans-serif;
        text-align: center;
        transform: ${compact ? 'scale(0.93)' : 'none'};
        transform-origin: center center;
      `;

      const title = document.createElement('h2');
      title.textContent = 'みやすさ・おと・しんどう せってい';
      title.style.cssText = 'margin: 0 0 0.55rem; font-size: clamp(1.2rem, 4.4vmin, 1.6rem);';

      this.descriptionEl = document.createElement('p');
      this.descriptionEl.style.cssText = 'margin: 0 0 1rem; font-size: clamp(0.95rem, 3.4vmin, 1.05rem); line-height: 1.55;';

      this.toggleButton = document.createElement('button');
      this.toggleButton.setAttribute('data-color-accessibility-toggle', '');
      this.toggleButton.style.cssText = `
        display: block;
        width: 100%;
        min-height: 2.75rem;
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
        this.onToggle?.(this.highContrast);
      });

      const audioTitle = document.createElement('h3');
      audioTitle.textContent = 'おとの おおきさ';
      audioTitle.style.cssText = 'margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      const audioHint = document.createElement('p');
      audioHint.textContent = 'すべらせて ききやすい おおきさに しよう';
      audioHint.style.cssText = 'margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;';

      const createAudioSlider = (
        kind: 'bgm' | 'sfx',
        titleText: string,
        onChange: (volume: AudioVolumeLevel) => void,
      ): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin-bottom: 0.85rem; text-align: left;';

        const heading = document.createElement('p');
        heading.textContent = titleText;
        heading.style.cssText = 'margin: 0 0 0.3rem; font-size: clamp(0.95rem, 3.2vmin, 1rem); font-weight: 900;';

        const description = document.createElement('p');
        description.setAttribute(`data-${kind}-volume-label`, '');
        description.style.cssText = 'margin: 0 0 0.45rem; font-size: clamp(0.88rem, 3vmin, 0.98rem); line-height: 1.4;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.step = '25';
        slider.value = '100';
        slider.setAttribute(`data-${kind}-volume-slider`, '');
        slider.style.cssText = 'width: 100%; margin: 0 0 0.3rem;';
        slider.addEventListener('input', () => {
          const value = Number(slider.value) as AudioVolumeLevel;
          if (kind === 'bgm') {
            this.bgmVolume = value;
          } else {
            this.sfxVolume = value;
          }
          this.render();
          onChange(value);
        });

        const steps = document.createElement('div');
        steps.style.cssText = `
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0.2rem;
          font-size: clamp(0.68rem, 2.25vmin, 0.8rem);
          color: rgba(255, 255, 255, 0.86);
          text-align: center;
        `;
        for (const option of AUDIO_VOLUME_OPTIONS) {
          const chip = document.createElement('span');
          chip.textContent = option.label;
          steps.appendChild(chip);
        }

        if (kind === 'bgm') {
          this.bgmVolumeDescriptionEl = description;
          this.bgmVolumeSlider = slider;
        } else {
          this.sfxVolumeDescriptionEl = description;
          this.sfxVolumeSlider = slider;
        }

        wrapper.append(heading, description, slider, steps);
        return wrapper;
      };

      const bgmVolumeControl = createAudioSlider('bgm', '🎵 おんがく', (volume) => {
        this.onBGMVolumeChange?.(volume);
      });
      const sfxVolumeControl = createAudioSlider('sfx', '✨ こうかおん', (volume) => {
        this.onSFXVolumeChange?.(volume);
      });

      const restReminderTitle = document.createElement('h3');
      restReminderTitle.textContent = 'やすみじかんの おしらせ';
      restReminderTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.restReminderDescriptionEl = document.createElement('p');
      this.restReminderDescriptionEl.style.cssText = 'margin: 0 0 0.6rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      this.restReminderToggleButton = document.createElement('button');
      this.restReminderToggleButton.setAttribute('data-rest-reminder-toggle', '');
      this.restReminderToggleButton.style.cssText = `
        display: block;
        width: 100%;
        min-height: 2.75rem;
        margin-bottom: 0.85rem;
        padding: 0.9rem 1rem;
        border-radius: 999px;
        border: 3px solid #fff;
        background: linear-gradient(135deg, #ffe58b, #9fd6ff);
        color: #102040;
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: clamp(1rem, 3.6vmin, 1.15rem);
        font-weight: 900;
        cursor: pointer;
        touch-action: manipulation;
      `;
      this.restReminderToggleButton.addEventListener('click', () => {
        this.restReminderEnabled = !this.restReminderEnabled;
        this.render();
        this.onRestReminderToggle?.(this.restReminderEnabled);
      });

      const colorVisionTitle = document.createElement('h3');
      colorVisionTitle.textContent = 'いろの みわけかた';
      colorVisionTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.colorVisionDescriptionEl = document.createElement('p');
      this.colorVisionDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const colorVisionGroup = document.createElement('div');
      colorVisionGroup.setAttribute('data-color-vision-mode-group', '');
      colorVisionGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;

      const colorVisionOptions: Array<{ value: ColorVisionSupportMode; label: string; icon: string }> = [
        { value: 'color-only', label: 'いろだけ', icon: '🎨' },
        { value: 'color-and-marks', label: 'いろとマーク', icon: '★' },
      ];

      for (const option of colorVisionOptions) {
        const button = document.createElement('button');
        button.setAttribute('data-color-vision-mode-button', option.value);
        button.textContent = `${option.icon} ${option.label}`;
        button.style.cssText = `
          min-height: 3.25rem;
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.9rem, 3.3vmin, 1rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `;
        button.addEventListener('click', () => {
          this.colorVisionSupportMode = option.value;
          this.render();
          this.onColorVisionSupportModeChange?.(option.value);
        });
        this.colorVisionButtons.set(option.value, button);
        colorVisionGroup.appendChild(button);
      }

      const vibrationTitle = document.createElement('h3');
      vibrationTitle.textContent = 'しんどうの つよさ';
      vibrationTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

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
          min-height: 3.25rem;
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
          this.onVibrationIntensityChange?.(option.value);
        });
        this.vibrationButtons.set(option.value, button);
        vibrationGroup.appendChild(button);
      }

      const motionTitle = document.createElement('h3');
      motionTitle.textContent = 'うごきの つよさ';
      motionTitle.style.cssText = 'margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      const motionHint = document.createElement('p');
      motionHint.textContent = 'えらんで みると うごきの おためしが みえるよ';
      motionHint.style.cssText = 'margin: 0 0 0.5rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      this.motionDescriptionEl = document.createElement('p');
      this.motionDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const motionGroup = document.createElement('div');
      motionGroup.setAttribute('data-motion-sensitivity-group', '');
      motionGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;

      const motionOptions: MotionSensitivity[] = ['strong', 'medium', 'gentle', 'minimal'];

      for (const option of motionOptions) {
        const visual = getMotionSensitivityVisualProfile(option);
        const button = document.createElement('button');
        button.setAttribute('data-motion-sensitivity-button', option);
        button.style.cssText = `
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.15rem;
          min-height: 5rem;
          padding: 0.8rem 0.9rem;
          border-radius: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-family: 'Zen Maru Gothic', sans-serif;
          font-size: clamp(0.95rem, 3.2vmin, 1.02rem);
          font-weight: 800;
          cursor: pointer;
          touch-action: manipulation;
          transition: transform 0.08s ease-out, border-color 0.12s ease-out, background 0.12s ease-out;
        `;
        const emoji = document.createElement('span');
        emoji.textContent = visual.emoji;
        emoji.style.cssText = 'font-size: clamp(1.25rem, 4.8vmin, 1.7rem); line-height: 1;';
        const stars = document.createElement('span');
        stars.textContent = visual.stars;
        stars.style.cssText = 'font-size: clamp(0.82rem, 2.9vmin, 0.95rem); letter-spacing: 0.08em;';
        const label = document.createElement('span');
        label.textContent = visual.shortLabel;
        label.style.cssText = 'font-size: clamp(0.9rem, 3vmin, 1rem);';
        button.append(emoji, stars, label);
        button.addEventListener('click', () => {
          this.motionSensitivity = option;
          this.render();
          this.playMotionPreview();
          this.onMotionSensitivityChange?.(option);
        });
        this.motionButtons.set(option, button);
        motionGroup.appendChild(button);
      }

      this.motionPreviewEl = document.createElement('div');
      this.motionPreviewEl.setAttribute('data-motion-preview', '');
      this.motionPreviewEl.style.cssText = `
        position: relative;
        min-height: 5.8rem;
        margin: 0 0 1rem;
        padding: 0.8rem 0.9rem;
        border-radius: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.2);
        background: linear-gradient(180deg, rgba(14, 24, 60, 0.92), rgba(8, 14, 38, 0.96));
        overflow: hidden;
      `;
      const motionPreviewTrack = document.createElement('div');
      motionPreviewTrack.style.cssText = `
        position: relative;
        height: 2.7rem;
        margin-bottom: 0.7rem;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.12), rgba(118, 240, 255, 0.22));
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.12);
      `;
      const motionPreviewTrail = document.createElement('div');
      motionPreviewTrail.style.cssText = `
        position: absolute;
        left: 0.8rem;
        right: 0.8rem;
        top: 50%;
        height: 0.35rem;
        transform: translateY(-50%);
        border-radius: 999px;
        background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.34) 0.55rem, rgba(255, 255, 255, 0.06) 0.55rem, rgba(255, 255, 255, 0.06) 1rem);
      `;
      this.motionPreviewTokenEl = document.createElement('div');
      this.motionPreviewTokenEl.setAttribute('data-motion-preview-token', '');
      this.motionPreviewTokenEl.style.cssText = `
        position: absolute;
        left: 0.35rem;
        top: 50%;
        width: 2.1rem;
        height: 2.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: rgba(255, 242, 122, 0.92);
        color: #102040;
        font-size: 1.3rem;
        transform: translateY(-50%) scale(1);
      `;
      this.motionPreviewCaptionEl = document.createElement('p');
      this.motionPreviewCaptionEl.setAttribute('data-motion-preview-caption', '');
      this.motionPreviewCaptionEl.style.cssText = 'margin: 0; font-size: clamp(0.9rem, 3vmin, 1rem); line-height: 1.5;';
      motionPreviewTrack.append(motionPreviewTrail, this.motionPreviewTokenEl);
      this.motionPreviewEl.append(motionPreviewTrack, this.motionPreviewCaptionEl);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'とじる';
      closeButton.style.cssText = `
        width: 100%;
        min-height: 2.75rem;
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
      panel.appendChild(audioTitle);
      panel.appendChild(audioHint);
      panel.appendChild(bgmVolumeControl);
      panel.appendChild(sfxVolumeControl);
      panel.appendChild(restReminderTitle);
      panel.appendChild(this.restReminderDescriptionEl);
      panel.appendChild(this.restReminderToggleButton);
      panel.appendChild(colorVisionTitle);
      panel.appendChild(this.colorVisionDescriptionEl);
      panel.appendChild(colorVisionGroup);
      panel.appendChild(vibrationTitle);
      panel.appendChild(this.vibrationDescriptionEl);
      panel.appendChild(vibrationGroup);
      panel.appendChild(motionTitle);
      panel.appendChild(motionHint);
      panel.appendChild(this.motionDescriptionEl);
      panel.appendChild(motionGroup);
      panel.appendChild(this.motionPreviewEl);
      panel.appendChild(closeButton);
      this.overlay.appendChild(panel);
    }

    this.render();
    host.appendChild(this.overlay);
  }

  hide(): void {
    this.clearMotionPreviewTimers();
    this.overlay?.remove();
  }

  isVisible(): boolean {
    return this.overlay?.isConnected === true;
  }

  private render(): void {
    if (
      !this.toggleButton ||
      !this.descriptionEl ||
      !this.bgmVolumeDescriptionEl ||
      !this.sfxVolumeDescriptionEl ||
      !this.bgmVolumeSlider ||
      !this.sfxVolumeSlider ||
      !this.restReminderDescriptionEl ||
      !this.restReminderToggleButton ||
      !this.colorVisionDescriptionEl ||
      !this.vibrationDescriptionEl ||
      !this.motionDescriptionEl
    ) return;
    this.descriptionEl.textContent = this.highContrast
      ? 'ふちや しまもようを つよくして みやすく しているよ。'
      : 'ひかりかたを やさしくして いつもの みために しているよ。';
    this.toggleButton.textContent = this.highContrast
      ? 'みやすくする: ON'
      : 'みやすくする: OFF';
    this.toggleButton.setAttribute('aria-pressed', this.highContrast ? 'true' : 'false');

    const bgmLabel = getAudioVolumeLabel(this.bgmVolume);
    this.bgmVolumeDescriptionEl.textContent = `🎵 ${bgmLabel} (${this.bgmVolume}%)`;
    this.bgmVolumeSlider.value = String(this.bgmVolume);
    this.bgmVolumeSlider.setAttribute('aria-valuetext', `${bgmLabel} ${this.bgmVolume}%`);

    const sfxLabel = getAudioVolumeLabel(this.sfxVolume);
    this.sfxVolumeDescriptionEl.textContent = `✨ ${sfxLabel} (${this.sfxVolume}%)`;
    this.sfxVolumeSlider.value = String(this.sfxVolume);
    this.sfxVolumeSlider.setAttribute('aria-valuetext', `${sfxLabel} ${this.sfxVolume}%`);

    this.restReminderDescriptionEl.textContent = this.restReminderEnabled
      ? '15ぷんごとに そっと やすもうって つたえるよ。'
      : 'いまは おしらせを ださずに あそべるよ。';
    this.restReminderToggleButton.textContent = this.restReminderEnabled
      ? 'やすみじかんの おしらせ: ON'
      : 'やすみじかんの おしらせ: OFF';
    this.restReminderToggleButton.setAttribute('aria-pressed', this.restReminderEnabled ? 'true' : 'false');

    this.colorVisionDescriptionEl.textContent = this.colorVisionSupportMode === 'color-and-marks'
      ? 'にじりゅうせいは ★、わくせいは しるしつきで わかるよ。'
      : 'いまは いろを みながら あそぶ モードだよ。';

    for (const [value, button] of this.colorVisionButtons.entries()) {
      const selected = value === this.colorVisionSupportMode;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }

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

    const selectedMotionProfile = getMotionSensitivityVisualProfile(this.motionSensitivity);
    this.motionDescriptionEl.textContent = selectedMotionProfile.description;

    for (const [value, button] of this.motionButtons.entries()) {
      const selected = value === this.motionSensitivity;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }

    if (this.motionPreviewEl?.dataset.previewActive !== 'true') {
      this.resetMotionPreview();
    }
  }

  private playMotionPreview(): void {
    if (!this.motionPreviewEl || !this.motionPreviewTokenEl || !this.motionPreviewCaptionEl) return;

    this.clearMotionPreviewTimers();

    const motionProfile = getMotionSensitivityVisualProfile(this.motionSensitivity);
    this.motionPreviewEl.dataset.previewActive = 'true';
    this.motionPreviewTokenEl.textContent = motionProfile.emoji;
    this.motionPreviewTokenEl.style.background = 'rgba(255, 242, 122, 0.92)';
    this.motionPreviewTokenEl.style.boxShadow = motionProfile.previewGlow;
    this.motionPreviewTokenEl.style.transition = 'none';
    this.motionPreviewTokenEl.style.left = '0.35rem';
    this.motionPreviewTokenEl.style.transform = 'translateY(-50%) scale(1)';
    this.motionPreviewCaptionEl.textContent = `${motionProfile.emoji} ${motionProfile.shortLabel} で おためしちゅう`;

    this.motionPreviewFrameId = window.requestAnimationFrame(() => {
      if (!this.motionPreviewTokenEl) return;
      this.motionPreviewTokenEl.style.transition = `left ${motionProfile.previewDurationMs}ms ease-in-out, transform ${motionProfile.previewDurationMs}ms ease-in-out`;
      this.motionPreviewTokenEl.style.left = 'calc(100% - 2.45rem)';
      this.motionPreviewTokenEl.style.transform = `translateY(-50%) scale(${motionProfile.previewScale})`;
    });

    this.motionPreviewTimeoutId = window.setTimeout(() => {
      this.resetMotionPreview();
    }, motionProfile.previewDurationMs + 260);
  }

  private resetMotionPreview(): void {
    if (!this.motionPreviewEl || !this.motionPreviewTokenEl || !this.motionPreviewCaptionEl) return;

    const motionProfile = getMotionSensitivityVisualProfile(this.motionSensitivity);
    this.motionPreviewEl.dataset.previewActive = 'false';
    this.motionPreviewTokenEl.textContent = motionProfile.emoji;
    this.motionPreviewTokenEl.style.transition = 'none';
    this.motionPreviewTokenEl.style.left = '0.35rem';
    this.motionPreviewTokenEl.style.transform = 'translateY(-50%) scale(1)';
    this.motionPreviewTokenEl.style.background = 'rgba(255, 242, 122, 0.92)';
    this.motionPreviewTokenEl.style.boxShadow = motionProfile.previewGlow;
    this.motionPreviewCaptionEl.textContent = `${motionProfile.stars} ${motionProfile.shortLabel} を えらぶと おためしするよ`;
  }

  private clearMotionPreviewTimers(): void {
    if (this.motionPreviewTimeoutId !== null) {
      window.clearTimeout(this.motionPreviewTimeoutId);
      this.motionPreviewTimeoutId = null;
    }

    if (this.motionPreviewFrameId !== null) {
      window.cancelAnimationFrame(this.motionPreviewFrameId);
      this.motionPreviewFrameId = null;
    }
  }
}
