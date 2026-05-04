// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SpaceshipCustomizer } from '../../../src/ui/SpaceshipCustomizer';

beforeEach(() => {
  document.body.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
});

function dispatchReleaseConfirm(target: HTMLElement): void {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
}

describe('SpaceshipCustomizer', () => {
  it('updates the live preview and completes with the selected colors', () => {
    const customizer = new SpaceshipCustomizer();
    const onComplete = vi.fn();

    customizer.show({
      initialCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      onComplete,
    });

    const bodyOption = document.querySelector('[data-spaceship-color-option="bodyColor:sunset"]') as HTMLButtonElement;
    const noseOption = document.querySelector('[data-spaceship-color-option="noseColor:aqua"]') as HTMLButtonElement;
    const wingOption = document.querySelector('[data-spaceship-color-option="wingColor:sky"]') as HTMLButtonElement;

    dispatchReleaseConfirm(bodyOption);
    dispatchReleaseConfirm(noseOption);
    dispatchReleaseConfirm(wingOption);

    const preview = document.querySelector('[data-spaceship-customizer-preview-card]') as HTMLDivElement;
    expect(preview.textContent).toContain('プレビュー');
    expect(bodyOption.getAttribute('aria-pressed')).toBe('true');
    expect(noseOption.getAttribute('aria-pressed')).toBe('true');
    expect(wingOption.getAttribute('aria-pressed')).toBe('true');

    const doneButton = document.querySelector('[data-spaceship-customizer-done]') as HTMLButtonElement;
    dispatchReleaseConfirm(doneButton);

    expect(onComplete).toHaveBeenCalledWith({ bodyColor: 'sunset', noseColor: 'aqua', wingColor: 'sky' });
    expect(document.querySelector('[data-spaceship-customizer]')).toBeNull();
  });
});
