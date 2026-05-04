// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageIntroOverlay } from '../../../src/ui/StageIntroOverlay';
import { getPlanetEncyclopediaEntry } from '../../../src/game/config/PlanetEncyclopedia';

describe('StageIntroOverlay', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: undefined,
    });
  });

  it('shows the planet emoji, reading, and trivia in a big card', () => {
    const overlay = new StageIntroOverlay(getPlanetEncyclopediaEntry(4)!);

    overlay.show(() => {});

    expect(document.querySelector('[data-stage-intro-overlay]')).not.toBeNull();
    expect(document.querySelector('[data-stage-intro-emoji]')?.textContent).toBe('🔴');
    expect(document.querySelector('[data-stage-intro-name]')?.textContent).toBe('かせい');
    expect(document.querySelector('[data-stage-intro-trivia]')?.textContent).toContain('あかい');
    expect(overlay.isActive()).toBe(true);
  });

  it('auto-completes after the short intro duration and removes the card', () => {
    const onComplete = vi.fn();
    const overlay = new StageIntroOverlay(getPlanetEncyclopediaEntry(2)!, { totalDuration: 1.5 });

    overlay.show(onComplete);
    overlay.tick(1.4);
    expect(onComplete).not.toHaveBeenCalled();

    overlay.tick(0.1);

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-stage-intro-overlay]')).toBeNull();
    expect(overlay.isActive()).toBe(false);
  });

  it('uses a compact card layout on low viewport heights', () => {
    Object.defineProperty(window, 'visualViewport', {
      configurable: true,
      value: { width: 1024, height: 480 },
    });

    const overlay = new StageIntroOverlay(getPlanetEncyclopediaEntry(6)!);
    overlay.show(() => {});

    const card = document.querySelector<HTMLElement>('[data-stage-intro-card]');
    expect(card?.getAttribute('data-stage-intro-compact')).toBe('true');
    expect(document.querySelector('[data-stage-intro-name]')?.textContent).toBe('どせい');
  });
});
