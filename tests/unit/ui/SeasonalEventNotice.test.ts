// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SeasonalEventNotice } from '../../../src/ui/SeasonalEventNotice';
import { SEASONAL_EVENT_CONFIGS } from '../../../src/game/config/SeasonalEventConfig';

const sakuraEvent = SEASONAL_EVENT_CONFIGS.find((config) => config.id === 'sakura')!;
const tanabataEvent = SEASONAL_EVENT_CONFIGS.find((config) => config.id === 'tanabata')!;

describe('SeasonalEventNotice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ui-overlay"></div>';
  });

  it('季節イベントのタイトルとメッセージを大きなカードで表示する', () => {
    const notice = new SeasonalEventNotice();

    notice.show(sakuraEvent);

    expect(document.querySelector('[data-seasonal-event-notice]')).not.toBeNull();
    expect(document.querySelector('[data-seasonal-event-notice-title]')?.textContent).toContain('さくら');
    expect(document.querySelector('[data-seasonal-event-notice-message]')?.textContent)
      .toBe(sakuraEvent.noticeMessage);
    expect(document.querySelector('[data-seasonal-event-notice]')?.getAttribute('data-seasonal-event-accent'))
      .toBe(String(sakuraEvent.accentColor));
    expect(notice.isVisible()).toBe(true);
  });

  it('短い表示時間が過ぎると自動で閉じる', () => {
    const notice = new SeasonalEventNotice({ totalDuration: 1.5 });

    notice.show(tanabataEvent);
    notice.tick(1.4);
    expect(notice.isVisible()).toBe(true);

    notice.tick(0.1);
    expect(document.querySelector('[data-seasonal-event-notice]')).toBeNull();
    expect(notice.isVisible()).toBe(false);
  });
});
