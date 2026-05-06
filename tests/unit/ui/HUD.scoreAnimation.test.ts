// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD score animation', () => {
  let hud: HUD;

  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    hud = new HUD();
    hud.show('test');
    hud.update(0, 0);
  });

  afterEach(() => {
    hud.hide();
    document.body.innerHTML = '';
    document.getElementById('boost-animations')?.remove();
    vi.useRealTimers();
  });

  function getScoreEl(): HTMLSpanElement {
    const scoreEl = document.querySelector('[data-hud-score-value]') as HTMLSpanElement | null;
    expect(scoreEl).not.toBeNull();
    return scoreEl as HTMLSpanElement;
  }

  function getScoreGainEl(): HTMLDivElement {
    const scoreGainEl = document.querySelector('[data-hud-score-gain]') as HTMLDivElement | null;
    expect(scoreGainEl).not.toBeNull();
    return scoreGainEl as HTMLDivElement;
  }

  function dispatchAnimEnd(el: HTMLElement, name = 'hudScoreGainFloatA'): void {
    const ev = new Event('animationend') as AnimationEvent;
    Object.defineProperty(ev, 'animationName', { value: name });
    el.dispatchEvent(ev);
  }

  it('counts the score up in steps before settling on the gained total', () => {
    const scoreEl = getScoreEl();

    hud.animateScoreGain(500, 500);
    expect(scoreEl.textContent).toBe('0');

    vi.advanceTimersByTime(40);
    expect(Number(scoreEl.textContent)).toBeGreaterThan(0);
    expect(Number(scoreEl.textContent)).toBeLessThan(500);

    vi.advanceTimersByTime(400);
    expect(scoreEl.textContent).toBe('500');
  });

  it('shows a popup badge for the score gain and clears it after the animation', () => {
    const scoreGainEl = getScoreGainEl();

    hud.animateScoreGain(500, 500);

    expect(scoreGainEl.textContent).toBe('+500');
    expect(scoreGainEl.getAttribute('data-hud-score-gain-kind')).toBe('bonus');
    expect(scoreGainEl.hasAttribute('data-hud-score-gain-active')).toBe(true);

    dispatchAnimEnd(scoreGainEl);

    expect(scoreGainEl.hasAttribute('data-hud-score-gain-active')).toBe(false);
    expect(scoreGainEl.style.visibility).toBe('hidden');
  });

  it('retargets the count-up from the current displayed score when gains chain quickly', () => {
    const scoreEl = getScoreEl();

    hud.animateScoreGain(100, 100);
    vi.advanceTimersByTime(80);
    const midScore = Number(scoreEl.textContent);
    expect(midScore).toBeGreaterThan(0);
    expect(midScore).toBeLessThan(100);

    hud.animateScoreGain(500, 600);
    vi.advanceTimersByTime(400);

    expect(Number(scoreEl.textContent)).toBe(600);
  });
});
