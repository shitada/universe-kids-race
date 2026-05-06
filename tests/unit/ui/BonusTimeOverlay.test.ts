// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BonusTimeOverlay } from '../../../src/ui/BonusTimeOverlay';

describe('BonusTimeOverlay', () => {
  let overlay: BonusTimeOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new BonusTimeOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.body.innerHTML = '';
  });

  it('表示時に残り時間・回収数・メッセージを描画する', () => {
    overlay.show({
      remainingSeconds: 10,
      collectedStars: 0,
      message: 'ほしを あつめよう！',
    });

    const root = document.querySelector<HTMLElement>('[data-bonus-time-overlay]');
    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('ボーナスタイム');
    expect(root?.textContent).toContain('10びょう');
    expect(root?.textContent).toContain('0こ');
    expect(root?.textContent).toContain('ほしを あつめよう！');
  });

  it('updateでカウントダウンとメッセージを差し替え、showResultで結果表示に切り替える', () => {
    overlay.show({
      remainingSeconds: 10,
      collectedStars: 0,
      message: 'ほしを あつめよう！',
    });

    overlay.update({
      remainingSeconds: 6.2,
      collectedStars: 4,
      message: 'すごいね！',
    });

    expect(document.querySelector('[data-bonus-time-remaining]')?.textContent).toContain('7びょう');
    expect(document.querySelector('[data-bonus-time-count]')?.textContent).toContain('4こ');
    expect(document.querySelector('[data-bonus-time-message]')?.textContent).toContain('すごいね！');

    overlay.showResult({
      collectedStars: 4,
      message: '4こ あつめたね！',
    });

    expect(document.querySelector('[data-bonus-time-result]')?.textContent).toContain('4こ あつめたね！');
  });

  it('hideでオーバーレイを外す', () => {
    overlay.show({
      remainingSeconds: 10,
      collectedStars: 1,
      message: 'やったね！',
    });

    overlay.hide();

    expect(document.querySelector('[data-bonus-time-overlay]')).toBeNull();
  });
});
