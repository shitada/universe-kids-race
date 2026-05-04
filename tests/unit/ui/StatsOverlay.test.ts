// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StatsOverlay } from '../../../src/ui/StatsOverlay';

function createPointerEvent(type: string): PointerEvent {
  return new PointerEvent(type, { bubbles: true });
}

describe('StatsOverlay', () => {
  let overlay: StatsOverlay;
  let uiOverlay: HTMLDivElement;

  beforeEach(() => {
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    overlay = new StatsOverlay();
  });

  afterEach(() => {
    overlay.hide();
    uiOverlay.remove();
  });

  it('shows saved gameplay stats in readable cards', () => {
    overlay.show({
      totalPlayTimeSeconds: 125,
      totalStarsCollected: 18,
      totalBoostUses: 4,
      stageClearCounts: { 1: 2, 3: 1 },
    }, () => {});

    expect(document.querySelector('[data-stats-total-play-time]')?.textContent).toContain('2ふん 5びょう');
    expect(document.querySelector('[data-stats-total-stars]')?.textContent).toContain('18こ');
    expect(document.querySelector('[data-stats-total-boosts]')?.textContent).toContain('4かい');
    expect(document.querySelector('[data-stats-stage-clear-row="1"]')?.textContent).toContain('2かい');
    expect(document.querySelector('[data-stats-stage-clear-row="3"]')?.textContent).toContain('1かい');
  });

  it('shows an empty-state message when there are no records yet', () => {
    overlay.show(undefined, () => {});

    expect(document.querySelector('[data-stats-overlay]')?.textContent).toContain('まだ きろくが ないよ');
  });

  it('closes on back button tap', () => {
    let closed = false;
    overlay.show(undefined, () => {
      closed = true;
    });

    const backButton = Array.from(document.querySelectorAll('button'))
      .find((button) => button.textContent === 'もどる');
    backButton?.dispatchEvent(createPointerEvent('pointerdown'));
    backButton?.dispatchEvent(createPointerEvent('pointerup'));

    expect(closed).toBe(true);
    expect(document.querySelector('[data-stats-overlay]')).toBeNull();
  });
});
