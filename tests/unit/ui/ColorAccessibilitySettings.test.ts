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
      onToggle,
      onVibrationIntensityChange,
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
      onToggle: vi.fn(),
      onVibrationIntensityChange,
    });

    const weakButton = document.querySelector('[data-vibration-intensity-button="weak"]') as HTMLButtonElement | null;
    const strongButton = document.querySelector('[data-vibration-intensity-button="strong"]') as HTMLButtonElement | null;
    expect(weakButton?.getAttribute('aria-pressed')).toBe('true');

    strongButton?.click();

    expect(strongButton?.getAttribute('aria-pressed')).toBe('true');
    expect(onVibrationIntensityChange).toHaveBeenCalledWith('strong');
  });

  it('hides the panel when requested', () => {
    settings.show({
      initialHighContrast: true,
      initialVibrationIntensity: 'medium',
      onToggle: vi.fn(),
      onVibrationIntensityChange: vi.fn(),
    });
    expect(settings.isVisible()).toBe(true);

    settings.hide();

    expect(settings.isVisible()).toBe(false);
    expect(document.querySelector('[data-color-accessibility-settings]')).toBeNull();
  });
});
