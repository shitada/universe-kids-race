// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SeasonalEventNotice } from '../../../src/ui/SeasonalEventNotice';
import { SEASONAL_EVENT_CONFIGS } from '../../../src/game/config/SeasonalEventConfig';

describe('SeasonalEventNotice', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ui-overlay"></div>';
  });

  it('季節イベントのタイトルとメッセージを大きなカードで表示する', () => {
    const notice = new SeasonalEventNotice();

    notice.show(SEASONAL_EVENT_CONFIGS[0]);

    expect(document.querySelector('[data-seasonal-event-notice]')).not.toBeNull();
    expect(document.querySelector('[data-seasonal-event-notice-title]')?.textContent).toContain('たなばた');
    expect(document.querySelector('[data-seasonal-event-notice-message]')?.textContent)
      .toBe(SEASONAL_EVENT_CONFIGS[0].noticeMessage);
    expect(notice.isVisible()).toBe(true);
  });

  it('短い表示時間が過ぎると自動で閉じる', () => {
    const notice = new SeasonalEventNotice({ totalDuration: 1.5 });

    notice.show(SEASONAL_EVENT_CONFIGS[1]);
    notice.tick(1.4);
    expect(notice.isVisible()).toBe(true);

    notice.tick(0.1);
    expect(document.querySelector('[data-seasonal-event-notice]')).toBeNull();
    expect(notice.isVisible()).toBe(false);
  });
});
