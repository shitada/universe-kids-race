// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TouchFeedbackOverlay } from '../../../src/ui/TouchFeedbackOverlay';

describe('TouchFeedbackOverlay', () => {
  let overlay: TouchFeedbackOverlay;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
    overlay = new TouchFeedbackOverlay();
    overlay.attach();
  });

  afterEach(() => {
    overlay.dispose();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('shows a gameplay ripple at the touch point and clears it after release', () => {
    overlay.showGameplayTouch(1, 120, 180, 'left');

    const root = document.querySelector<HTMLElement>('[data-touch-feedback-root]');
    const entry = document.querySelector<HTMLElement>('[data-touch-feedback-entry]');
    expect(root).not.toBeNull();
    expect(entry?.style.left).toBe('120px');
    expect(entry?.style.top).toBe('180px');
    expect(entry?.getAttribute('data-touch-feedback-variant')).toBe('game-left');

    overlay.releaseGameplayTouch(1);
    vi.runAllTimers();

    expect(document.querySelector('[data-touch-feedback-entry]')).toBeNull();
  });

  it('shows a distinct ui feedback variant for bound button roots', () => {
    const uiRoot = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'あそぶ';
    uiRoot.appendChild(button);
    document.body.appendChild(uiRoot);
    overlay.bindUiRoots([uiRoot]);

    button.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      clientX: 240,
      clientY: 300,
      pointerId: 4,
    }));

    const entry = document.querySelector<HTMLElement>('[data-touch-feedback-entry]');
    expect(entry?.getAttribute('data-touch-feedback-variant')).toBe('ui');
    expect(entry?.style.left).toBe('240px');
    expect(entry?.style.top).toBe('300px');
  });

  it('reduces motion variables when minimal sensitivity is selected', () => {
    overlay.setMotionSensitivity('minimal');

    const root = document.querySelector<HTMLElement>('[data-touch-feedback-root]');
    expect(root?.style.getPropertyValue('--touch-feedback-ripple-scale')).toBe('1.45');
    expect(root?.style.getPropertyValue('--touch-feedback-marker-duration')).toBe('240ms');
  });
});
