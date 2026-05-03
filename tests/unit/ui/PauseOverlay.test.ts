// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PauseOverlay } from '../../../src/ui/PauseOverlay';

describe('PauseOverlay', () => {
  let overlay: PauseOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new PauseOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.body.innerHTML = '';
  });

  const pressAndRelease = (button: HTMLButtonElement): void => {
    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    button.dispatchEvent(new Event('pointerup', { bubbles: true }));
  };

  it('show() renders a single dialog into #ui-overlay', () => {
    overlay.show(() => {}, () => {});

    const element = document.querySelector<HTMLDivElement>('[data-pause-overlay]');
    expect(element).not.toBeNull();
    expect(element?.getAttribute('role')).toBe('dialog');
    expect(element?.parentElement?.id).toBe('ui-overlay');
    expect(element?.textContent).toContain('ひとやすみ');
  });

  it('show() is idempotent', () => {
    overlay.show(() => {}, () => {});
    overlay.show(() => {}, () => {});

    expect(document.querySelectorAll('[data-pause-overlay]')).toHaveLength(1);
  });

  it('つづける activates on release and hides the overlay', () => {
    const onResume = vi.fn();
    const onExitHome = vi.fn();
    overlay.show(onResume, onExitHome);

    pressAndRelease(document.querySelector('[data-pause-continue]') as HTMLButtonElement);

    expect(onResume).toHaveBeenCalledTimes(1);
    expect(onExitHome).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('おうちへ activates on release and hides the overlay', () => {
    const onResume = vi.fn();
    const onExitHome = vi.fn();
    overlay.show(onResume, onExitHome);

    pressAndRelease(document.querySelector('[data-pause-home]') as HTMLButtonElement);

    expect(onExitHome).toHaveBeenCalledTimes(1);
    expect(onResume).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('repeated taps do not double-fire callbacks', () => {
    const onResume = vi.fn();
    overlay.show(onResume, () => {});

    const button = document.querySelector('[data-pause-continue]') as HTMLButtonElement;
    pressAndRelease(button);
    button.dispatchEvent(new Event('click', { bubbles: true }));

    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('buttons meet minimum tap target and hriagana labels', () => {
    overlay.show(() => {}, () => {});

    const continueButton = document.querySelector('[data-pause-continue]') as HTMLButtonElement;
    const homeButton = document.querySelector('[data-pause-home]') as HTMLButtonElement;

    expect(continueButton.style.minHeight).toBe('88px');
    expect(homeButton.style.minHeight).toBe('88px');
    expect(continueButton.textContent).toContain('つづける');
    expect(homeButton.textContent).toContain('おうちへ');
  });
});
