// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResumeGentlyOverlay } from '../../../src/ui/ResumeGentlyOverlay';

describe('ResumeGentlyOverlay', () => {
  let overlay: ResumeGentlyOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new ResumeGentlyOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('shows child-friendly copy and calls onResume once', () => {
    const onResume = vi.fn();

    overlay.show({
      title: 'おかえり！',
      detail: 'つづきから あそべるよ ✨',
      actionLabel: 'タップして さいかい',
      onResume,
    });

    const el = document.querySelector('[data-resume-gently-overlay]') as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.textContent).toContain('おかえり');
    el.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));

    expect(onResume).toHaveBeenCalledTimes(1);
    expect(overlay.isVisible()).toBe(false);
  });

  it('updates content without stacking duplicate overlays', () => {
    overlay.show({
      title: 'おかえり！',
      detail: 'つづきから あそべるよ ✨',
      onResume: () => {},
    });
    overlay.show({
      title: 'ゆっくり もどろう！',
      detail: 'あわてなくて だいじょうぶ',
      onResume: () => {},
    });

    expect(document.querySelectorAll('[data-resume-gently-overlay]').length).toBe(1);
    expect(document.body.textContent).toContain('ゆっくり もどろう');
  });
});
