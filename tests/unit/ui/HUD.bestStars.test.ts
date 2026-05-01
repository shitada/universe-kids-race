// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD.bestStarCount sub-label', () => {
  let hud: HUD;

  beforeEach(() => {
    vi.useFakeTimers();
    const hudRoot = document.createElement('div');
    hudRoot.id = 'hud';
    document.body.appendChild(hudRoot);
    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    hud = new HUD();
    hud.show('test');
  });

  afterEach(() => {
    hud.hide();
    document.getElementById('hud')?.remove();
    document.getElementById('ui-overlay')?.remove();
    document.getElementById('boost-animations')?.remove();
    vi.useRealTimers();
  });

  function getBestContainer(): HTMLSpanElement {
    const el = document.querySelector('[data-hud-best-star]') as HTMLSpanElement | null;
    expect(el).not.toBeNull();
    return el as HTMLSpanElement;
  }

  function getBestCountEl(): HTMLSpanElement {
    const container = getBestContainer();
    const span = container.querySelector('span') as HTMLSpanElement | null;
    expect(span).not.toBeNull();
    return span as HTMLSpanElement;
  }

  function dispatchAnimEnd(el: HTMLElement, name = 'hudCountPop'): void {
    const ev = new Event('animationend') as AnimationEvent;
    Object.defineProperty(ev, 'animationName', { value: name });
    el.dispatchEvent(ev);
  }

  it('hides the sub-label by default (before setBestStarCount is called)', () => {
    const el = getBestContainer();
    expect(el.style.display).toBe('none');
  });

  it('displays ベスト ⭐N when setBestStarCount(>0) is called', () => {
    hud.setBestStarCount(3);
    const container = getBestContainer();
    const count = getBestCountEl();
    expect(container.style.display).not.toBe('none');
    expect(container.textContent).toContain('ベスト');
    expect(container.textContent).toContain('⭐');
    expect(count.textContent).toBe('3');
  });

  it('hides the sub-label when setBestStarCount(0) is called', () => {
    hud.setBestStarCount(3);
    expect(getBestContainer().style.display).not.toBe('none');
    hud.setBestStarCount(0);
    expect(getBestContainer().style.display).toBe('none');
  });

  it('hides the sub-label for negative or non-integer best values', () => {
    hud.setBestStarCount(-1);
    expect(getBestContainer().style.display).toBe('none');
    hud.setBestStarCount(2.5);
    expect(getBestContainer().style.display).toBe('none');
  });

  it('updates the textContent on subsequent setBestStarCount calls (re-entry)', () => {
    hud.setBestStarCount(2);
    expect(getBestCountEl().textContent).toBe('2');
    hud.setBestStarCount(5);
    expect(getBestCountEl().textContent).toBe('5');
  });

  it('pulses the sub-label exactly once when starCount first surpasses best', () => {
    hud.setBestStarCount(2);
    const container = getBestContainer();
    hud.update(0, 0); // prime
    hud.update(0, 1);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(0, 2);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
    // Crossing: 2 → 3 (> best 2)
    hud.update(0, 3);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(true);
    dispatchAnimEnd(container);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
    // Subsequent stars should NOT pulse again within the same entry.
    hud.update(0, 4);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('does not pulse when best is 0 (sub-label hidden)', () => {
    const container = getBestContainer();
    hud.update(0, 0);
    hud.update(0, 5);
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('re-arms the pulse on next setBestStarCount call (stage re-entry)', () => {
    hud.setBestStarCount(1);
    const container = getBestContainer();
    hud.update(0, 0);
    hud.update(0, 2); // crosses best=1 → pulse
    expect(container.hasAttribute('data-hud-count-pop')).toBe(true);
    dispatchAnimEnd(container);
    // Re-enter the same stage: best is now 2 (the new record).
    hud.setBestStarCount(2);
    hud.update(0, 0); // counts reset
    hud.update(0, 2); // equal to best → no pulse
    expect(container.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(0, 3); // surpass new best → pulse again
    expect(container.hasAttribute('data-hud-count-pop')).toBe(true);
  });

  it('does not write textContent when best value is unchanged (differential write)', () => {
    hud.setBestStarCount(4);
    const count = getBestCountEl();
    const spy = vi.spyOn(count, 'textContent', 'set');
    hud.setBestStarCount(4);
    expect(spy).not.toHaveBeenCalled();
  });

  it('clears bestStar DOM references after hide()', () => {
    hud.setBestStarCount(3);
    hud.hide();
    expect(document.querySelector('[data-hud-best-star]')).toBeNull();
  });
});
