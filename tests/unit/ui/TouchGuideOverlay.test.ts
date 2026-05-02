// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TouchGuideOverlay } from '../../../src/ui/TouchGuideOverlay';

describe('TouchGuideOverlay', () => {
  let overlay: TouchGuideOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new TouchGuideOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.body.innerHTML = '';
  });

  it('creates left/right touch guides with pointer-events disabled', () => {
    overlay.show();

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    const guides = document.querySelectorAll<HTMLElement>('[data-touch-guide]');
    const leftGuide = document.querySelector<HTMLElement>('[data-touch-guide="left"]');
    const rightGuide = document.querySelector<HTMLElement>('[data-touch-guide="right"]');

    expect(root).not.toBeNull();
    expect(root?.style.pointerEvents).toBe('none');
    expect(guides).toHaveLength(2);
    expect(leftGuide?.textContent).toBe('⬅️ ひだり');
    expect(rightGuide?.textContent).toBe('みぎ ➡️');
    expect(leftGuide?.style.left).toBe('0.8rem');
    expect(rightGuide?.style.right).toBe('0.8rem');
    expect(leftGuide?.style.cssText).not.toContain('env(');
    expect(rightGuide?.style.cssText).not.toContain('env(');
  });

  it('starts in intro mode by default', () => {
    overlay.show();

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('intro');
    expect(root?.getAttribute('aria-hidden')).toBe('false');
  });

  it('can switch to hidden and idle modes without recreating DOM', () => {
    overlay.show();
    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]')!;

    overlay.setMode('hidden');
    expect(root.getAttribute('data-touch-guide-state')).toBe('hidden');
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.style.visibility).toBe('hidden');

    overlay.setMode('idle');
    expect(root.getAttribute('data-touch-guide-state')).toBe('idle');
    expect(root.getAttribute('aria-hidden')).toBe('false');
    expect(root.style.visibility).toBe('visible');
    expect(document.querySelectorAll('[data-touch-guide-overlay]')).toHaveLength(1);
  });

  it('removes the overlay on hide()', () => {
    overlay.show();
    overlay.hide();

    expect(document.querySelector('[data-touch-guide-overlay]')).toBeNull();
  });
});
