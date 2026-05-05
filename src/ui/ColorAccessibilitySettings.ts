import type {
  AudioVolumeLevel,
  ColorVisionSupportMode,
  Language,
  MotionSensitivity,
  VisualFeedbackIntensity,
} from '../types';
import { getMotionSensitivityVisualProfile } from '../game/accessibility/motionSensitivity';
import { i18n } from '../game/i18n/i18nService';
import { DEFAULT_LANGUAGE } from '../game/i18n/types';

const AUDIO_VOLUME_OPTIONS = [
  { value: 0, labelKey: 'colorSettings.audio.volume.quiet' },
  { value: 25, labelKey: 'colorSettings.audio.volume.small' },
  { value: 50, labelKey: 'colorSettings.audio.volume.normal' },
  { value: 75, labelKey: 'colorSettings.audio.volume.loud' },
  { value: 100, labelKey: 'colorSettings.audio.volume.max' },
] as const satisfies ReadonlyArray<{ value: AudioVolumeLevel; labelKey: string }>;

const COLOR_VISION_OPTIONS: ReadonlyArray<{ value: ColorVisionSupportMode; labelKey: string; descriptionKey: string; icon: string }> = [
  {
    value: 'color-only',
    labelKey: 'colorSettings.colorVision.option.colorOnly',
    descriptionKey: 'colorSettings.colorVision.description.colorOnly',
    icon: '🎨',
  },
  {
    value: 'color-and-marks',
    labelKey: 'colorSettings.colorVision.option.colorAndMarks',
    descriptionKey: 'colorSettings.colorVision.description.colorAndMarks',
    icon: '★',
  },
  {
    value: 'protanopia-filter',
    labelKey: 'colorSettings.colorVision.option.protanopiaFilter',
    descriptionKey: 'colorSettings.colorVision.description.protanopiaFilter',
    icon: '🔴',
  },
  {
    value: 'deuteranopia-filter',
    labelKey: 'colorSettings.colorVision.option.deuteranopiaFilter',
    descriptionKey: 'colorSettings.colorVision.description.deuteranopiaFilter',
    icon: '🟢',
  },
  {
    value: 'tritanopia-filter',
    labelKey: 'colorSettings.colorVision.option.tritanopiaFilter',
    descriptionKey: 'colorSettings.colorVision.description.tritanopiaFilter',
    icon: '🔵',
  },
];

const VISUAL_FEEDBACK_OPTIONS: ReadonlyArray<{ value: VisualFeedbackIntensity; labelKey: string }> = [
  { value: 'strong', labelKey: 'colorSettings.visualFeedback.option.strong' },
  { value: 'medium', labelKey: 'colorSettings.visualFeedback.option.medium' },
  { value: 'weak', labelKey: 'colorSettings.visualFeedback.option.weak' },
  { value: 'off', labelKey: 'colorSettings.visualFeedback.option.off' },
];

const LANGUAGE_OPTIONS: ReadonlyArray<{ value: Language; labelKey: string; icon: string }> = [
  { value: 'ja', labelKey: 'colorSettings.language.option.ja', icon: '🇯🇵' },
  { value: 'en', labelKey: 'colorSettings.language.option.en', icon: '🇬🇧' },
];

const MOTION_TEXT_KEYS: Record<MotionSensitivity, { shortLabel: string; description: string }> = {
  strong: {
    shortLabel: 'colorSettings.motion.option.strong.shortLabel',
    description: 'colorSettings.motion.option.strong.description',
  },
  medium: {
    shortLabel: 'colorSettings.motion.option.medium.shortLabel',
    description: 'colorSettings.motion.option.medium.description',
  },
  gentle: {
    shortLabel: 'colorSettings.motion.option.gentle.shortLabel',
    description: 'colorSettings.motion.option.gentle.description',
  },
  minimal: {
    shortLabel: 'colorSettings.motion.option.minimal.shortLabel',
    description: 'colorSettings.motion.option.minimal.description',
  },
};

function getAudioVolumeLabel(volume: AudioVolumeLevel): string {
  const option = AUDIO_VOLUME_OPTIONS.find((entry) => entry.value === volume) ?? AUDIO_VOLUME_OPTIONS[2];
  return i18n.t(option.labelKey);
}

export interface ColorAccessibilitySettingsOptions {
  initialHighContrast: boolean;
  initialColorVisionSupportMode: ColorVisionSupportMode;
  initialBGMVolume: AudioVolumeLevel;
  initialSFXVolume: AudioVolumeLevel;
  initialVisualEffectIntensity: VisualFeedbackIntensity;
  initialMotionSensitivity: MotionSensitivity;
  initialRestReminderEnabled: boolean;
  initialLanguage: Language;
  onToggle: (enabled: boolean) => void;
  onColorVisionSupportModeChange: (mode: ColorVisionSupportMode) => void;
  onBGMVolumeChange: (volume: AudioVolumeLevel) => void;
  onSFXVolumeChange: (volume: AudioVolumeLevel) => void;
  onVisualEffectIntensityChange: (intensity: VisualFeedbackIntensity) => void;
  onMotionSensitivityChange: (sensitivity: MotionSensitivity) => void;
  onRestReminderToggle: (enabled: boolean) => void;
  onLanguageChange: (language: Language) => void;
}

export class ColorAccessibilitySettings {
  private overlay: HTMLDivElement | null = null;
  private toggleButton: HTMLButtonElement | null = null;
  private descriptionEl: HTMLParagraphElement | null = null;
  private highContrast = false;
  private colorVisionSupportMode: ColorVisionSupportMode = 'color-only';
  private bgmVolume: AudioVolumeLevel = 100;
  private sfxVolume: AudioVolumeLevel = 100;
  private visualFeedbackIntensity: VisualFeedbackIntensity = 'medium';
  private motionSensitivity: MotionSensitivity = 'strong';
  private restReminderEnabled = true;
  private language: Language = DEFAULT_LANGUAGE;
  private bgmVolumeDescriptionEl: HTMLParagraphElement | null = null;
  private sfxVolumeDescriptionEl: HTMLParagraphElement | null = null;
  private bgmVolumeSlider: HTMLInputElement | null = null;
  private sfxVolumeSlider: HTMLInputElement | null = null;
  private colorVisionDescriptionEl: HTMLParagraphElement | null = null;
  private colorVisionButtons = new Map<ColorVisionSupportMode, HTMLButtonElement>();
  private visualFeedbackDescriptionEl: HTMLParagraphElement | null = null;
  private visualFeedbackButtons = new Map<VisualFeedbackIntensity, HTMLButtonElement>();
  private motionDescriptionEl: HTMLParagraphElement | null = null;
  private motionButtons = new Map<MotionSensitivity, HTMLButtonElement>();
  private restReminderDescriptionEl: HTMLParagraphElement | null = null;
  private restReminderToggleButton: HTMLButtonElement | null = null;
  private motionPreviewEl: HTMLDivElement | null = null;
  private motionPreviewTokenEl: HTMLDivElement | null = null;
  private motionPreviewCaptionEl: HTMLParagraphElement | null = null;
  private languageDescriptionEl: HTMLParagraphElement | null = null;
  private languageButtons = new Map<Language, HTMLButtonElement>();
  private motionPreviewTimeoutId: number | null = null;
  private motionPreviewFrameId: number | null = null;
  private onToggle: ((enabled: boolean) => void) | null = null;
  private onColorVisionSupportModeChange: ((mode: ColorVisionSupportMode) => void) | null = null;
  private onBGMVolumeChange: ((volume: AudioVolumeLevel) => void) | null = null;
  private onSFXVolumeChange: ((volume: AudioVolumeLevel) => void) | null = null;
  private onVisualEffectIntensityChange: ((intensity: VisualFeedbackIntensity) => void) | null = null;
  private onMotionSensitivityChange: ((sensitivity: MotionSensitivity) => void) | null = null;
  private onRestReminderToggle: ((enabled: boolean) => void) | null = null;
  private onLanguageChange: ((language: Language) => void) | null = null;
  private languageUnsubscribe: (() => void) | null = null;

  show(options: ColorAccessibilitySettingsOptions): void {
    const host = document.getElementById('ui-overlay');
    if (!host) return;

    this.highContrast = options.initialHighContrast;
    this.colorVisionSupportMode = options.initialColorVisionSupportMode;
    this.bgmVolume = options.initialBGMVolume;
    this.sfxVolume = options.initialSFXVolume;
    this.visualFeedbackIntensity = options.initialVisualEffectIntensity;
    this.motionSensitivity = options.initialMotionSensitivity;
    this.restReminderEnabled = options.initialRestReminderEnabled;
    this.language = options.initialLanguage;
    this.onToggle = options.onToggle;
    this.onColorVisionSupportModeChange = options.onColorVisionSupportModeChange;
    this.onBGMVolumeChange = options.onBGMVolumeChange;
    this.onSFXVolumeChange = options.onSFXVolumeChange;
    this.onVisualEffectIntensityChange = options.onVisualEffectIntensityChange;
    this.onMotionSensitivityChange = options.onMotionSensitivityChange;
    this.onRestReminderToggle = options.onRestReminderToggle;
    this.onLanguageChange = options.onLanguageChange;

    i18n.setLanguage(this.language, { notify: false });
    this.languageUnsubscribe?.();
    this.languageUnsubscribe = i18n.subscribe((language) => {
      this.language = language;
      this.render();
    });

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
      title.setAttribute('data-color-settings-title', '');
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
      audioTitle.setAttribute('data-audio-title', '');
      audioTitle.style.cssText = 'margin: 0.75rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      const audioHint = document.createElement('p');
      audioHint.setAttribute('data-audio-hint', '');
      audioHint.style.cssText = 'margin: 0 0 0.65rem; font-size: clamp(0.9rem, 3.1vmin, 1rem); line-height: 1.45;';

      const createAudioSlider = (
        kind: 'bgm' | 'sfx',
        headingKey: string,
        onChange: (volume: AudioVolumeLevel) => void,
      ): HTMLDivElement => {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'margin-bottom: 0.85rem; text-align: left;';

        const heading = document.createElement('p');
        heading.setAttribute(`data-${kind}-volume-heading`, '');
        heading.dataset.i18nKey = headingKey;
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
          chip.setAttribute('data-volume-option', String(option.value));
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

      const bgmVolumeControl = createAudioSlider('bgm', 'colorSettings.audio.bgm', (volume) => {
        this.onBGMVolumeChange?.(volume);
      });
      const sfxVolumeControl = createAudioSlider('sfx', 'colorSettings.audio.sfx', (volume) => {
        this.onSFXVolumeChange?.(volume);
      });

      const restReminderTitle = document.createElement('h3');
      restReminderTitle.setAttribute('data-rest-reminder-title', '');
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

      const languageTitle = document.createElement('h3');
      languageTitle.setAttribute('data-language-title', '');
      languageTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.languageDescriptionEl = document.createElement('p');
      this.languageDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const languageGroup = document.createElement('div');
      languageGroup.setAttribute('data-language-group', '');
      languageGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;

      for (const option of LANGUAGE_OPTIONS) {
        const button = document.createElement('button');
        button.setAttribute('data-language-button', option.value);
        button.style.cssText = `
          min-height: 2.95rem;
          padding: 0.7rem 0.65rem;
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
          i18n.setLanguage(option.value);
          this.onLanguageChange?.(option.value);
        });
        this.languageButtons.set(option.value, button);
        languageGroup.appendChild(button);
      }

      const colorVisionTitle = document.createElement('h3');
      colorVisionTitle.setAttribute('data-color-vision-title', '');
      colorVisionTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.colorVisionDescriptionEl = document.createElement('p');
      this.colorVisionDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const colorVisionGroup = document.createElement('div');
      colorVisionGroup.setAttribute('data-color-vision-mode-group', '');
      colorVisionGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.55rem;
        margin-bottom: 0.95rem;
      `;

      for (const option of COLOR_VISION_OPTIONS) {
        const button = document.createElement('button');
        button.setAttribute('data-color-vision-mode-button', option.value);
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

      const visualFeedbackTitle = document.createElement('h3');
      visualFeedbackTitle.setAttribute('data-visual-feedback-title', '');
      visualFeedbackTitle.style.cssText = 'margin: 0.9rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      this.visualFeedbackDescriptionEl = document.createElement('p');
      this.visualFeedbackDescriptionEl.style.cssText = 'margin: 0 0 0.8rem; font-size: clamp(0.9rem, 3.2vmin, 1rem); line-height: 1.5;';

      const visualFeedbackGroup = document.createElement('div');
      visualFeedbackGroup.setAttribute('data-visual-feedback-intensity-group', '');
      visualFeedbackGroup.style.cssText = `
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.65rem;
        margin-bottom: 0.95rem;
      `;

      for (const option of VISUAL_FEEDBACK_OPTIONS) {
        const button = document.createElement('button');
        button.setAttribute('data-visual-feedback-intensity-button', option.value);
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
          this.visualFeedbackIntensity = option.value;
          this.render();
          this.onVisualEffectIntensityChange?.(option.value);
        });
        this.visualFeedbackButtons.set(option.value, button);
        visualFeedbackGroup.appendChild(button);
      }

      const motionTitle = document.createElement('h3');
      motionTitle.setAttribute('data-motion-title', '');
      motionTitle.style.cssText = 'margin: 1.1rem 0 0.45rem; font-size: clamp(1rem, 3.8vmin, 1.2rem);';

      const motionHint = document.createElement('p');
      motionHint.setAttribute('data-motion-hint', '');
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
        label.setAttribute('data-motion-label', option);
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
      closeButton.setAttribute('data-color-settings-close', '');
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
      panel.appendChild(languageTitle);
      panel.appendChild(this.languageDescriptionEl);
      panel.appendChild(languageGroup);
      panel.appendChild(colorVisionTitle);
      panel.appendChild(this.colorVisionDescriptionEl);
      panel.appendChild(colorVisionGroup);
      panel.appendChild(visualFeedbackTitle);
      panel.appendChild(this.visualFeedbackDescriptionEl);
      panel.appendChild(visualFeedbackGroup);
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
    this.languageUnsubscribe?.();
    this.languageUnsubscribe = null;
    this.overlay?.remove();
  }

  isVisible(): boolean {
    return this.overlay?.isConnected === true;
  }

  private getMotionShortLabel(value: MotionSensitivity): string {
    return i18n.t(MOTION_TEXT_KEYS[value].shortLabel);
  }

  private getMotionDescription(value: MotionSensitivity): string {
    return i18n.t(MOTION_TEXT_KEYS[value].description);
  }

  private setStaticText(selector: string, key: string): void {
    const element = this.overlay?.querySelector(selector);
    if (element) {
      element.textContent = i18n.t(key);
    }
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
      !this.languageDescriptionEl ||
      !this.colorVisionDescriptionEl ||
      !this.visualFeedbackDescriptionEl ||
      !this.motionDescriptionEl
    ) return;

    this.setStaticText('[data-color-settings-title]', 'colorSettings.title');
    this.setStaticText('[data-audio-title]', 'colorSettings.audio.title');
    this.setStaticText('[data-audio-hint]', 'colorSettings.audio.hint');
    this.setStaticText('[data-bgm-volume-heading]', 'colorSettings.audio.bgm');
    this.setStaticText('[data-sfx-volume-heading]', 'colorSettings.audio.sfx');
    this.setStaticText('[data-rest-reminder-title]', 'colorSettings.restReminder.title');
    this.setStaticText('[data-language-title]', 'colorSettings.language.title');
    this.setStaticText('[data-color-vision-title]', 'colorSettings.colorVision.title');
    this.setStaticText('[data-visual-feedback-title]', 'colorSettings.visualFeedback.title');
    this.setStaticText('[data-motion-title]', 'colorSettings.motion.title');
    this.setStaticText('[data-motion-hint]', 'colorSettings.motion.hint');
    this.setStaticText('[data-color-settings-close]', 'colorSettings.close');

    this.descriptionEl.textContent = this.highContrast
      ? i18n.t('colorSettings.description.on')
      : i18n.t('colorSettings.description.off');
    this.toggleButton.textContent = this.highContrast
      ? i18n.t('colorSettings.toggle.on')
      : i18n.t('colorSettings.toggle.off');
    this.toggleButton.setAttribute('aria-pressed', this.highContrast ? 'true' : 'false');

    const bgmLabel = getAudioVolumeLabel(this.bgmVolume);
    this.bgmVolumeDescriptionEl.textContent = `🎵 ${bgmLabel} (${this.bgmVolume}%)`;
    this.bgmVolumeSlider.value = String(this.bgmVolume);
    this.bgmVolumeSlider.setAttribute('aria-valuetext', `${bgmLabel} ${this.bgmVolume}%`);

    const sfxLabel = getAudioVolumeLabel(this.sfxVolume);
    this.sfxVolumeDescriptionEl.textContent = `✨ ${sfxLabel} (${this.sfxVolume}%)`;
    this.sfxVolumeSlider.value = String(this.sfxVolume);
    this.sfxVolumeSlider.setAttribute('aria-valuetext', `${sfxLabel} ${this.sfxVolume}%`);

    for (const option of AUDIO_VOLUME_OPTIONS) {
      const chip = this.overlay?.querySelector(`[data-volume-option="${option.value}"]`);
      if (chip) {
        chip.textContent = i18n.t(option.labelKey);
      }
    }

    this.restReminderDescriptionEl.textContent = this.restReminderEnabled
      ? i18n.t('colorSettings.restReminder.description.on')
      : i18n.t('colorSettings.restReminder.description.off');
    this.restReminderToggleButton.textContent = this.restReminderEnabled
      ? i18n.t('colorSettings.restReminder.toggle.on')
      : i18n.t('colorSettings.restReminder.toggle.off');
    this.restReminderToggleButton.setAttribute('aria-pressed', this.restReminderEnabled ? 'true' : 'false');

    this.languageDescriptionEl.textContent = i18n.t('colorSettings.language.description');
    for (const option of LANGUAGE_OPTIONS) {
      const button = this.languageButtons.get(option.value);
      if (!button) continue;
      const selected = option.value === this.language;
      button.textContent = `${option.icon} ${i18n.t(option.labelKey)}`;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }

    const selectedColorVisionOption = COLOR_VISION_OPTIONS.find(
      (option) => option.value === this.colorVisionSupportMode,
    ) ?? COLOR_VISION_OPTIONS[0];
    this.colorVisionDescriptionEl.textContent = i18n.t(selectedColorVisionOption.descriptionKey);

    for (const option of COLOR_VISION_OPTIONS) {
      const button = this.colorVisionButtons.get(option.value);
      if (!button) continue;
      const selected = option.value === this.colorVisionSupportMode;
      button.textContent = `${option.icon} ${i18n.t(option.labelKey)}`;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }

    const vibrationDescriptions: Record<VisualFeedbackIntensity, string> = {
      strong: i18n.t('colorSettings.visualFeedback.description.strong'),
      medium: i18n.t('colorSettings.visualFeedback.description.medium'),
      weak: i18n.t('colorSettings.visualFeedback.description.weak'),
      off: i18n.t('colorSettings.visualFeedback.description.off'),
    };
    this.visualFeedbackDescriptionEl.textContent = vibrationDescriptions[this.visualFeedbackIntensity];

    for (const option of VISUAL_FEEDBACK_OPTIONS) {
      const button = this.visualFeedbackButtons.get(option.value);
      if (!button) continue;
      const selected = option.value === this.visualFeedbackIntensity;
      button.textContent = i18n.t(option.labelKey);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.style.borderColor = selected ? '#fff27a' : 'rgba(255, 255, 255, 0.4)';
      button.style.background = selected
        ? 'linear-gradient(135deg, rgba(255, 242, 122, 0.94), rgba(118, 240, 255, 0.92))'
        : 'rgba(255, 255, 255, 0.08)';
      button.style.color = selected ? '#102040' : '#fff';
      button.style.transform = selected ? 'scale(1.02)' : 'scale(1)';
    }

    this.motionDescriptionEl.textContent = this.getMotionDescription(this.motionSensitivity);

    for (const [value, button] of this.motionButtons.entries()) {
      const selected = value === this.motionSensitivity;
      const label = button.querySelector(`[data-motion-label="${value}"]`);
      if (label) {
        label.textContent = this.getMotionShortLabel(value);
      }
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
    const label = this.getMotionShortLabel(this.motionSensitivity);
    this.motionPreviewEl.dataset.previewActive = 'true';
    this.motionPreviewTokenEl.textContent = motionProfile.emoji;
    this.motionPreviewTokenEl.style.background = 'rgba(255, 242, 122, 0.92)';
    this.motionPreviewTokenEl.style.boxShadow = motionProfile.previewGlow;
    this.motionPreviewTokenEl.style.transition = 'none';
    this.motionPreviewTokenEl.style.left = '0.35rem';
    this.motionPreviewTokenEl.style.transform = 'translateY(-50%) scale(1)';
    this.motionPreviewCaptionEl.textContent = i18n.t('colorSettings.motion.preview.playing', {
      emoji: motionProfile.emoji,
      label,
    });

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
    const label = this.getMotionShortLabel(this.motionSensitivity);
    this.motionPreviewEl.dataset.previewActive = 'false';
    this.motionPreviewTokenEl.textContent = motionProfile.emoji;
    this.motionPreviewTokenEl.style.transition = 'none';
    this.motionPreviewTokenEl.style.left = '0.35rem';
    this.motionPreviewTokenEl.style.transform = 'translateY(-50%) scale(1)';
    this.motionPreviewTokenEl.style.background = 'rgba(255, 242, 122, 0.92)';
    this.motionPreviewTokenEl.style.boxShadow = motionProfile.previewGlow;
    this.motionPreviewCaptionEl.textContent = i18n.t('colorSettings.motion.preview.idle', {
      stars: motionProfile.stars,
      label,
    });
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
