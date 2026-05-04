// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FrameRateHintOverlay } from '../../../src/ui/FrameRateHintOverlay';

describe('FrameRateHintOverlay', () => {
  let overlay: FrameRateHintOverlay;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new FrameRateHintOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('shows a child-friendly performance hint and auto-hides it', () => {
    overlay.show({ level: 1 });

    const root = document.querySelector<HTMLElement>('[data-frame-rate-hint-overlay]');
    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('うちゅうせんを かるくしたよ');
    expect(root?.textContent).toContain('ほしと きらきら');

    vi.advanceTimersByTime(2600);

    expect(document.querySelector('[data-frame-rate-hint-overlay]')).toBeNull();
    expect(overlay.isVisible()).toBe(false);
  });

  it('updates the copy when a stronger adaptation level arrives', () => {
    overlay.show({ level: 1 });
    overlay.show({ level: 2 });

    const root = document.querySelector<HTMLElement>('[data-frame-rate-hint-overlay]');
    expect(document.querySelectorAll('[data-frame-rate-hint-overlay]')).toHaveLength(1);
    expect(root?.textContent).toContain('もっと かるくしたよ');
  });
});
