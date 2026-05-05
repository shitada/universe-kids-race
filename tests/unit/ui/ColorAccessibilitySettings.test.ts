// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ColorAccessibilitySettings } from '../../../src/ui/ColorAccessibilitySettings';

describe('ColorAccessibilitySettings', () => {
  let settings: ColorAccessibilitySettings;

  beforeEach(() => {
    const overlay = document.createElement('div');
    overlay.id = 'ui-overlay';
    document.body.appendChild(overlay);
    settings = new ColorAccessibilitySettings();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders and toggles the child-friendly high-contrast button', () => {
    const onToggle = vi.fn();
    const onVibrationIntensityChange = vi.fn();
    settings.show({
      initialHighContrast: false,
      initialVibrationIntensity: 'medium',
      initialMotionSensitivity: 'strong',
      onToggle,
      onVibrationIntensityChange,
      onMotionSensitivityChange: vi.fn(),
    });

    const toggle = document.querySelector('[data-color-accessibility-toggle]') as HTMLButtonElement | null;
    expect(toggle?.textContent).toContain('OFF');

    toggle?.click();

    expect(toggle?.textContent).toContain('ON');
    expect(onToggle).toHaveBeenCalledWith(true);
    expect(onVibrationIntensityChange).not.toHaveBeenCalled();
  });

  it('lets children pick vibration intensity explicitly', () => {
    const onVibrationIntensityChange = vi.fn();
    settings.show({
      initialHighContrast: true,
      initialVibrationIntensity: 'weak',
      initialMotionSensitivity: 'strong',
      onToggle: vi.fn(),
      onVibrationIntensityChange,
      onMotionSensitivityChange: vi.fn(),
    });

    const weakButton = document.querySelector('[data-vibration-intensity-button="weak"]') as HTMLButtonElement | null;
    const strongButton = document.querySelector('[data-vibration-intensity-button="strong"]') as HTMLButtonElement | null;
    expect(weakButton?.getAttribute('aria-pressed')).toBe('true');

    strongButton?.click();

    expect(strongButton?.getAttribute('aria-pressed')).toBe('true');
    expect(onVibrationIntensityChange).toHaveBeenCalledWith('strong');
  });

  it('shows visual motion choices and starts a preview when selected', () => {
    const onMotionSensitivityChange = vi.fn();
    settings.show({
      initialHighContrast: false,
      initialVibrationIntensity: 'medium',
      initialMotionSensitivity: 'medium',
      onToggle: vi.fn(),
      onVibrationIntensityChange: vi.fn(),
      onMotionSensitivityChange,
    });

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

  it('hides the panel when requested', () => {
    settings.show({
      initialHighContrast: true,
      initialVibrationIntensity: 'medium',
      initialMotionSensitivity: 'strong',
      onToggle: vi.fn(),
      onVibrationIntensityChange: vi.fn(),
      onMotionSensitivityChange: vi.fn(),
    });
    expect(settings.isVisible()).toBe(true);

    settings.hide();

    expect(settings.isVisible()).toBe(false);
    expect(document.querySelector('[data-color-accessibility-settings]')).toBeNull();
  });
});
