// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlayTimeRestOverlay } from '../../../src/ui/PlayTimeRestOverlay';

describe('PlayTimeRestOverlay', () => {
  let overlay: PlayTimeRestOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new PlayTimeRestOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('やさしい休憩提案を表示し、つづけるでコールバックを呼ぶ', () => {
    const onContinue = vi.fn();
    const onRest = vi.fn();

    overlay.show({
      level: 1,
      totalPlayTimeMs: 20 * 60 * 1000,
      onContinue,
      onRest,
    });

    const root = document.querySelector<HTMLElement>('[data-play-time-rest-overlay]');
    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('ちょっと やすもう');
    expect(root?.textContent).toContain('20ぷん');
    expect(root?.getAttribute('role')).toBe('dialog');

    const continueButton = document.querySelector<HTMLElement>('[data-play-time-rest-continue]');
    continueButton?.click();

    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(onRest).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('強めの提案に更新し、オーバーレイを重ねずにやすむを選べる', () => {
    const firstContinue = vi.fn();
    const firstRest = vi.fn();
    const secondContinue = vi.fn();
    const secondRest = vi.fn();

    overlay.show({
      level: 1,
      totalPlayTimeMs: 20 * 60 * 1000,
      onContinue: firstContinue,
      onRest: firstRest,
    });
    overlay.show({
      level: 2,
      totalPlayTimeMs: 30 * 60 * 1000,
      onContinue: secondContinue,
      onRest: secondRest,
    });

    expect(document.querySelectorAll('[data-play-time-rest-overlay]')).toHaveLength(1);
    expect(document.body.textContent).toContain('ながめに やすもう');
    expect(document.body.textContent).toContain('30ぷん');

    const restButton = document.querySelector<HTMLElement>('[data-play-time-rest-break]');
    restButton?.click();

    expect(firstContinue).not.toHaveBeenCalled();
    expect(firstRest).not.toHaveBeenCalled();
    expect(secondContinue).not.toHaveBeenCalled();
    expect(secondRest).toHaveBeenCalledTimes(1);
  });
});
