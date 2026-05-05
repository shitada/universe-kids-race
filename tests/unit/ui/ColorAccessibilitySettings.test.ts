// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorAccessibilitySettings } from '../../../src/ui/ColorAccessibilitySettings';
import { i18n } from '../../../src/game/i18n/i18nService';
import { DEFAULT_LANGUAGE } from '../../../src/game/i18n/types';

describe('ColorAccessibilitySettings', () => {
  let settings: ColorAccessibilitySettings;

  function createOptions(overrides: Partial<Parameters<ColorAccessibilitySettings['show']>[0]> = {}) {
    return {
      initialHighContrast: false,
      initialColorVisionSupportMode: 'color-only' as const,
      initialBGMVolume: 100 as const,
      initialSFXVolume: 100 as const,
      initialVibrationIntensity: 'medium' as const,
      initialMotionSensitivity: 'strong' as const,
      initialRestReminderEnabled: true,
      initialLanguage: 'ja' as const,
      onToggle: vi.fn(),
      onColorVisionSupportModeChange: vi.fn(),
      onBGMVolumeChange: vi.fn(),
      onSFXVolumeChange: vi.fn(),
      onVibrationIntensityChange: vi.fn(),
      onMotionSensitivityChange: vi.fn(),
      onRestReminderToggle: vi.fn(),
      onLanguageChange: vi.fn(),
      ...overrides,
    };
  }

  beforeEach(() => {
    const overlay = document.createElement('div');
    overlay.id = 'ui-overlay';
    document.body.appendChild(overlay);
    i18n.setLanguage(DEFAULT_LANGUAGE, { notify: false });
    settings = new ColorAccessibilitySettings();
  });

  afterEach(() => {
    i18n.setLanguage(DEFAULT_LANGUAGE, { notify: false });
    document.body.innerHTML = '';
  });

  it('renders and toggles the child-friendly high-contrast button', () => {
    const onToggle = vi.fn();
    const onVibrationIntensityChange = vi.fn();
    settings.show(createOptions({
      onToggle,
      onVibrationIntensityChange,
    }));

    const toggle = document.querySelector('[data-color-accessibility-toggle]') as HTMLButtonElement | null;
    expect(toggle?.textContent).toContain('OFF');

    toggle?.click();

    expect(toggle?.textContent).toContain('ON');
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onVibrationIntensityChange).not.toHaveBeenCalled();
  });

  it('lets children pick vibration intensity explicitly', () => {
    const onVibrationIntensityChange = vi.fn();
    settings.show(createOptions({
      initialHighContrast: true,
      initialVibrationIntensity: 'weak',
      onVibrationIntensityChange,
    }));

    const weakButton = document.querySelector('[data-vibration-intensity-button="weak"]') as HTMLButtonElement | null;
    const strongButton = document.querySelector('[data-vibration-intensity-button="strong"]') as HTMLButtonElement | null;
    expect(weakButton?.getAttribute('aria-pressed')).toBe('true');

    strongButton?.click();

    expect(strongButton?.getAttribute('aria-pressed')).toBe('true');
    expect(onVibrationIntensityChange).toHaveBeenCalledWith('strong');
  });

  it('shows visual motion choices and starts a preview when selected', () => {
    const onMotionSensitivityChange = vi.fn();
    settings.show(createOptions({
      initialMotionSensitivity: 'medium',
      onMotionSensitivityChange,
    }));

    const mediumButton = document.querySelector('[data-motion-sensitivity-button="medium"]') as HTMLButtonElement | null;
    const minimalButton = document.querySelector('[data-motion-sensitivity-button="minimal"]') as HTMLButtonElement | null;
    const preview = document.querySelector('[data-motion-preview]') as HTMLDivElement | null;
    const previewCaption = document.querySelector('[data-motion-preview-caption]') as HTMLParagraphElement | null;
    expect(mediumButton?.getAttribute('aria-pressed')).toBe('true');
    expect(mediumButton?.textContent).toContain('🏃');
    expect(minimalButton?.textContent).toContain('🐢');
    expect(minimalButton?.textContent).toContain('ゆっくり');
    expect(document.body.textContent).toContain('えらんで みると うごきの おためしが みえるよ');
    expect(previewCaption?.textContent).toContain('はやい');

    minimalButton?.click();

    expect(minimalButton?.getAttribute('aria-pressed')).toBe('true');
    expect(preview?.dataset.previewActive).toBe('true');
    expect(previewCaption?.textContent).toContain('ゆっくり');
    expect(onMotionSensitivityChange).toHaveBeenCalledWith('minimal');
  });

  it('switches language and rerenders labels right away', () => {
    const onLanguageChange = vi.fn();
    settings.show(createOptions({
      initialBGMVolume: 50,
      onLanguageChange,
    }));

    const englishButton = document.querySelector('[data-language-button="en"]') as HTMLButtonElement | null;
    const title = document.querySelector('[data-color-settings-title]');
    const bgmLabel = document.querySelector('[data-bgm-volume-label]');
    const closeButton = document.querySelector('[data-color-settings-close]') as HTMLButtonElement | null;

    englishButton?.click();

    expect(title?.textContent).toBe('Accessibility Settings');
    expect(bgmLabel?.textContent).toContain('Normal');
    expect(document.body.textContent).toContain('Language');
    expect(closeButton?.textContent).toBe('Close');
    expect(onLanguageChange).toHaveBeenCalledWith('en');
  });

  it('lets children switch between color-only and color-and-mark modes', () => {
    const onColorVisionSupportModeChange = vi.fn();
    settings.show(createOptions({
      onColorVisionSupportModeChange,
    }));

    const colorOnlyButton = document.querySelector('[data-color-vision-mode-button="color-only"]') as HTMLButtonElement | null;
    const colorAndMarksButton = document.querySelector('[data-color-vision-mode-button="color-and-marks"]') as HTMLButtonElement | null;
    expect(colorOnlyButton?.getAttribute('aria-pressed')).toBe('true');

    colorAndMarksButton?.click();

    expect(colorAndMarksButton?.getAttribute('aria-pressed')).toBe('true');
    expect(document.body.textContent).toContain('にじりゅうせいは ★');
    expect(onColorVisionSupportModeChange).toHaveBeenCalledWith('color-and-marks');
  });

  it('hides the panel when requested', () => {
    settings.show(createOptions({
      initialHighContrast: true,
    }));
    expect(settings.isVisible()).toBe(true);

    settings.hide();

    expect(settings.isVisible()).toBe(false);
    expect(document.querySelector('[data-color-accessibility-settings]')).toBeNull();
  });

  it('lets children turn rest reminders on and off', () => {
    const onRestReminderToggle = vi.fn();
    settings.show(createOptions({
      initialRestReminderEnabled: false,
      onRestReminderToggle,
    }));

    const toggle = document.querySelector('[data-rest-reminder-toggle]') as HTMLButtonElement | null;
    expect(toggle?.textContent).toContain('OFF');

    toggle?.click();

    expect(toggle?.textContent).toContain('ON');
    expect(document.body.textContent).toContain('15ぷんごと');
    expect(onRestReminderToggle).toHaveBeenCalledWith(true);
  });

  it('lets children adjust bgm and sfx volumes with 5-step sliders', () => {
    const onBGMVolumeChange = vi.fn();
    const onSFXVolumeChange = vi.fn();
    settings.show(createOptions({
      initialBGMVolume: 50,
      initialSFXVolume: 25,
      onBGMVolumeChange,
      onSFXVolumeChange,
    }));

    const bgmSlider = document.querySelector('[data-bgm-volume-slider]') as HTMLInputElement | null;
    const sfxSlider = document.querySelector('[data-sfx-volume-slider]') as HTMLInputElement | null;
    const bgmLabel = document.querySelector('[data-bgm-volume-label]') as HTMLParagraphElement | null;
    const sfxLabel = document.querySelector('[data-sfx-volume-label]') as HTMLParagraphElement | null;

    expect(bgmLabel?.textContent).toContain('ふつう');
    expect(sfxLabel?.textContent).toContain('ちいさい');
    expect(document.body.textContent).toContain('しずか');
    expect(document.body.textContent).toContain('さいだい');

    if (bgmSlider) {
      bgmSlider.value = '75';
      bgmSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (sfxSlider) {
      sfxSlider.value = '0';
      sfxSlider.dispatchEvent(new Event('input', { bubbles: true }));
    }

    expect(bgmLabel?.textContent).toContain('おおきい');
    expect(sfxLabel?.textContent).toContain('しずか');
    expect(onBGMVolumeChange).toHaveBeenCalledWith(75);
    expect(onSFXVolumeChange).toHaveBeenCalledWith(0);
  });
});
