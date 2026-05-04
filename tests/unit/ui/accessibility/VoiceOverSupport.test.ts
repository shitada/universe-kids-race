// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HUD } from '../../../../src/ui/HUD';
import { TouchGuideOverlay } from '../../../../src/ui/TouchGuideOverlay';
import { EncyclopediaOverlay } from '../../../../src/ui/EncyclopediaOverlay';
import type { CompanionPreviewController } from '../../../../src/ui/CompanionPreview';

function getLiveRegion(politeness: 'polite' | 'assertive'): HTMLElement | null {
  return document.querySelector(`[data-hud-live-region="${politeness}"]`) as HTMLElement | null;
}

describe('VoiceOver support', () => {
  let hud: HUD;

  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    hud = new HUD();
  });

  afterEach(() => {
    hud.hide();
    document.body.innerHTML = '';
  });

  it('announces star pickups, progress milestones, boost ready, and clear messages via live regions', () => {
    hud.show('ステージ1');

    hud.update(0, 0);
    hud.update(10, 3);
    expect(getLiveRegion('polite')?.getAttribute('data-live-message')).toBe('ほし 3こ ゲット！');

    hud.updateStageProgress(0.5);
    const progress = document.querySelector('[data-stage-progress-container]') as HTMLElement | null;
    expect(progress?.getAttribute('aria-valuetext')).toBe('ゴールまで あと 50%');
    expect(getLiveRegion('polite')?.getAttribute('data-live-message')).toBe('ゴールまで あと 50%');

    hud.flashBoostReady();
    expect(getLiveRegion('polite')?.getAttribute('data-live-message')).toBe('ブースト じゅんび OK！');

    hud.announceStageClear(4, true, true);
    expect(getLiveRegion('assertive')?.getAttribute('data-live-message')).toContain('ステージ クリア！ ほし 4こ');
    expect(getLiveRegion('assertive')?.getAttribute('data-live-message')).toContain('じこベスト こうしん！');
    expect(getLiveRegion('assertive')?.getAttribute('data-live-message')).toContain('あたらしい なかま');
  });

  it('announces touch guide hints without exposing decorative arrows', () => {
    const overlay = new TouchGuideOverlay();
    overlay.show();

    const instruction = document.querySelector('[data-touch-guide-instruction]') as HTMLElement | null;
    expect(instruction?.getAttribute('data-touch-guide-message')).toBe('ひだりか みぎを さわると うごけるよ');
    expect(document.querySelector('[data-touch-guide="left"]')?.getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('[data-touch-guide="right"]')?.getAttribute('aria-hidden')).toBe('true');

    overlay.setMode('assist-right');
    expect(instruction?.getAttribute('data-touch-guide-message')).toBe('みぎへ よけよう');

    overlay.hide();
  });

  it('adds dialog semantics and readable card labels to encyclopedia overlays', () => {
    const previewShow = vi.fn((_, container: HTMLElement) => {
      container.replaceChildren(document.createElement('div'));
    });
    const previewController: CompanionPreviewController = {
      show: previewShow,
      hide: vi.fn(),
      dispose: vi.fn(),
    };
    const overlay = new EncyclopediaOverlay({
      createPreviewController: () => previewController,
    });

    overlay.show([1], () => {}, undefined, { 1: 4 });

    const gallery = document.querySelector('#ui-overlay > div') as HTMLElement | null;
    const card = document.querySelector('[data-card][data-stage="1"]') as HTMLElement | null;
    expect(gallery?.getAttribute('role')).toBe('dialog');
    expect(gallery?.getAttribute('aria-modal')).toBe('true');
    expect(card?.getAttribute('role')).toBe('button');
    expect(card?.getAttribute('tabindex')).toBe('0');
    expect(card?.getAttribute('aria-label')).toContain('月（つき）');
    expect(card?.getAttribute('aria-label')).toContain('ベスト ほし 4こ');

    card?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    card?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    const detail = document.querySelector('[data-detail]') as HTMLElement | null;
    const detailTitle = detail?.querySelector(`#encyclopedia-detail-title`) as HTMLElement | null;
    expect(gallery?.getAttribute('aria-labelledby')).toBe('encyclopedia-gallery-title');
    expect(detailTitle?.textContent).toContain('月（つき）');
    expect(document.querySelector('[data-detail-companion-preview]')?.getAttribute('aria-hidden')).toBe('true');

    overlay.hide();
  });
});
