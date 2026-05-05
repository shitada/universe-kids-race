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
      totalPlayTimeMs: 15 * 60 * 1000,
      onContinue,
      onRest,
    });

    const root = document.querySelector<HTMLElement>('[data-play-time-rest-overlay]');
    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('ちょっと やすもうか');
    expect(root?.textContent).toContain('15ぷん');
    expect(root?.querySelector('[data-play-time-rest-star]')).not.toBeNull();
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
      totalPlayTimeMs: 15 * 60 * 1000,
      onContinue: firstContinue,
      onRest: firstRest,
    });
    overlay.show({
      level: 3,
      totalPlayTimeMs: 45 * 60 * 1000,
      onContinue: secondContinue,
      onRest: secondRest,
    });

    expect(document.querySelectorAll('[data-play-time-rest-overlay]')).toHaveLength(1);
    expect(document.body.textContent).toContain('ながめに やすもう');
    expect(document.body.textContent).toContain('45ぷん');

    const restButton = document.querySelector<HTMLElement>('[data-play-time-rest-break]');
    restButton?.click();

    expect(firstContinue).not.toHaveBeenCalled();
    expect(firstRest).not.toHaveBeenCalled();
    expect(secondContinue).not.toHaveBeenCalled();
    expect(secondRest).toHaveBeenCalledTimes(1);
  });

  it('やすむ後の完了メッセージを1つのボタンで表示できる', () => {
    const onAcknowledge = vi.fn();

    overlay.show({
      variant: 'rest-complete',
      totalPlayTimeMs: 30 * 60 * 1000,
      onAcknowledge,
    });

    const acknowledgeButton = document.querySelector<HTMLElement>('[data-play-time-rest-acknowledge]');
    expect(document.body.textContent).toContain('きろくを しまったよ');
    expect(acknowledgeButton).not.toBeNull();
    expect(document.querySelector<HTMLElement>('[data-play-time-rest-continue]')?.style.display).toBe('none');

    acknowledgeButton?.click();

    expect(onAcknowledge).toHaveBeenCalledTimes(1);
    expect(overlay.isVisible()).toBe(false);
  });
});
