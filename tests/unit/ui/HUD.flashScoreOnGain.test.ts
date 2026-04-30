// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD.flashScoreOnGain', () => {
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

  function getScoreEl(): HTMLSpanElement {
    const hudRoot = document.getElementById('hud')!;
    // Container with score/star is the div whose first text-bearing
    // child contains 'スコア'. Find by walking children.
    let scoreSpan: HTMLSpanElement | null = null;
    hudRoot.querySelectorAll('div').forEach((div) => {
      if (!scoreSpan && div.textContent?.startsWith('スコア')) {
        scoreSpan = div.querySelector('span');
      }
    });
    expect(scoreSpan).not.toBeNull();
    return scoreSpan as unknown as HTMLSpanElement;
  }

  function getStarCountEl(): HTMLSpanElement {
    const hudRoot = document.getElementById('hud')!;
    let starSpan: HTMLSpanElement | null = null;
    hudRoot.querySelectorAll('div').forEach((div) => {
      if (!starSpan && div.textContent?.startsWith('⭐')) {
        starSpan = div.querySelector('span');
      }
    });
    expect(starSpan).not.toBeNull();
    return starSpan as unknown as HTMLSpanElement;
  }

  function dispatchAnimEnd(el: HTMLElement, name = 'hudCountPop'): void {
    const ev = new Event('animationend') as AnimationEvent;
    Object.defineProperty(ev, 'animationName', { value: name });
    el.dispatchEvent(ev);
  }

  it('adds data-hud-count-pop on score increase from 0 to 10', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime past initial sentinel
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(10, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
  });

  it('adds data-hud-count-pop on star count increase from 0 to 1', () => {
    const starEl = getStarCountEl();
    hud.update(0, 0); // prime past initial sentinel
    expect(starEl.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(0, 1);
    expect(starEl.hasAttribute('data-hud-count-pop')).toBe(true);
  });

  it('does not add the attribute when called with the same values repeatedly', () => {
    const scoreEl = getScoreEl();
    const starEl = getStarCountEl();
    hud.update(0, 0); // prime
    hud.update(5, 2);
    dispatchAnimEnd(scoreEl);
    dispatchAnimEnd(starEl);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    expect(starEl.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(5, 2);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    expect(starEl.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('re-applies the attribute on consecutive increases after animationend clears it', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime
    hud.update(10, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
    dispatchAnimEnd(scoreEl);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(20, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
    dispatchAnimEnd(scoreEl);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    hud.update(30, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
  });

  it('does not flash on the very first update(0, 0) call', () => {
    const scoreEl = getScoreEl();
    const starEl = getStarCountEl();
    hud.update(0, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
    expect(starEl.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('does not flash on the very first update even when value is non-zero', () => {
    const scoreEl = getScoreEl();
    hud.update(50, 0); // first call: treated as initialization, no flash
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('does not re-trigger when score increases again while flash still in progress', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime
    hud.update(10, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
    hud.update(20, 0);
    expect(
      scoreEl.getAttributeNames().filter((n) => n === 'data-hud-count-pop').length,
    ).toBe(1);
  });

  it('ignores animationend events for unrelated animations', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime
    hud.update(10, 0);
    dispatchAnimEnd(scoreEl, 'boostBtnPulse');
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
  });

  it('falls back to setTimeout cleanup when animationend never fires', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime
    hud.update(10, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(true);
    vi.advanceTimersByTime(600);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
  });

  it('does not flash on score decrease', () => {
    const scoreEl = getScoreEl();
    hud.update(0, 0); // prime
    hud.update(10, 0);
    dispatchAnimEnd(scoreEl);
    hud.update(5, 0);
    expect(scoreEl.hasAttribute('data-hud-count-pop')).toBe(false);
  });
});
