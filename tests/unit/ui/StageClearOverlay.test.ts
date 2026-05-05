// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StageClearOverlay, type StageClearOverlayShowOptions } from '../../../src/ui/StageClearOverlay';
import { getNextPlanetEncyclopediaEntry, getPlanetEncyclopediaEntry } from '../../../src/game/config/PlanetEncyclopedia';

describe('StageClearOverlay', () => {
  let overlay: StageClearOverlay;

  const createOptions = (
    overrides: Partial<StageClearOverlayShowOptions> = {},
  ): StageClearOverlayShowOptions => ({
    stageNumber: 2,
    starCount: 5,
    bestStarCount: 7,
    isBestUpdated: true,
    continueLabel: 'つぎへ',
    nextEntry: getNextPlanetEncyclopediaEntry(2),
    rewardEntry: getPlanetEncyclopediaEntry(2),
    onContinue: vi.fn(),
    onRetry: vi.fn(),
    onReward: vi.fn(),
    ...overrides,
  });

  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new StageClearOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('show builds the stage clear overlay without changing copy', () => {
    overlay.show(createOptions());

    const root = document.querySelector<HTMLElement>('[data-stage-clear-overlay]');
    const actionRow = document.querySelector<HTMLElement>('[data-stage-clear-actions]');
    const retryButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');

    expect(root).not.toBeNull();
    expect(root?.style.overflowY).toBe('hidden');
    expect(actionRow?.style.display).toBe('grid');
    expect(actionRow?.style.gridTemplateColumns).toContain('repeat(3');
    expect(root?.textContent).toContain('やったね！');
    expect(root?.textContent).toContain('✨ じこベストこうしん！ ⭐ 5 こ');
    expect(root?.textContent).toContain('⭐ 5 こ あつめたよ！');
    expect(root?.textContent).toContain('⚫ 水星の ずかんカード ゲット！');
    expect(root?.textContent).toContain('なかまに なったよ！');
    expect(root?.textContent).toContain('つぎのぼうけん');
    expect(retryButton?.disabled).toBe(true);
    expect(retryButton?.style.visibility).toBe('hidden');
    expect(continueButton?.disabled).toBe(true);
    expect(continueButton?.style.visibility).toBe('hidden');
  });

  it('enableContinue reveals both CTA buttons and each action fires once', () => {
    const onRetry = vi.fn();
    const onContinue = vi.fn();
    overlay.show(createOptions({ onRetry, onContinue }));

    overlay.enableContinue();

    const retryButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(retryButton?.disabled).toBe(false);
    expect(retryButton?.style.visibility).toBe('visible');
    expect(continueButton?.disabled).toBe(false);
    expect(continueButton?.style.visibility).toBe('visible');

    retryButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    retryButton?.dispatchEvent(new Event('pointerup', { bubbles: true }));
    continueButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onContinue).not.toHaveBeenCalled();

    overlay.show(createOptions({ onRetry, onContinue }));
    overlay.enableContinue();
    const nextContinueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    nextContinueButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    nextContinueButton?.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('setRewardOpen blocks reward and CTA interactions until cleared', () => {
    const onReward = vi.fn();
    const onContinue = vi.fn();
    overlay.show(createOptions({ onReward, onContinue }));
    overlay.enableContinue();
    overlay.setRewardOpen(true);

    const rewardButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-card]');
    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');

    rewardButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    continueButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(rewardButton?.style.pointerEvents).toBe('none');
    expect(onReward).not.toHaveBeenCalled();
    expect(onContinue).not.toHaveBeenCalled();

    overlay.setRewardOpen(false);
    rewardButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    rewardButton?.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(rewardButton?.style.pointerEvents).toBe('auto');
    expect(onReward).toHaveBeenCalledTimes(1);
  });

  it('injects celebration styles and keeps best-update line order', () => {
    overlay.show(createOptions());

    const root = document.querySelector<HTMLElement>('[data-stage-clear-overlay]');
    const texts = Array.from(root?.children ?? [])
      .filter((el) => !(el as HTMLElement).hasAttribute('data-stage-clear-burst'))
      .map((el) => (el as HTMLElement).textContent ?? '');

    const yattaneIdx = texts.findIndex((text) => text.includes('やったね'));
    const bestIdx = texts.findIndex((text) => text.includes('じこベストこうしん'));
    const scoreIdx = texts.findIndex((text) => text.startsWith('⭐'));

    expect(yattaneIdx).toBeGreaterThanOrEqual(0);
    expect(bestIdx).toBeGreaterThan(yattaneIdx);
    expect(scoreIdx).toBeGreaterThan(bestIdx);
    expect(document.getElementById('best-stage-stars-animation')?.textContent).toContain('@keyframes bestStageStarsPop');
    expect(document.getElementById('stage-clear-burst-animation')?.textContent).toContain('@keyframes stageClearEmojiBurst');
  });

  it('omits the reward button when there is no new unlock', () => {
    overlay.show(createOptions({ rewardEntry: undefined, onReward: undefined }));

    expect(document.querySelector('[data-stage-clear-card]')).toBeNull();
  });
});
