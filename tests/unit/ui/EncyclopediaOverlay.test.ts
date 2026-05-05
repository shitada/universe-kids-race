// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';
import type { CompanionPreviewController } from '../../../src/ui/CompanionPreview';

function createPointerEvent(type: string, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, { bubbles: true, ...init });
}

function dispatchReleaseConfirm(element: HTMLElement, init: PointerEventInit = {}): void {
  element.dispatchEvent(createPointerEvent('pointerdown', init));
  element.dispatchEvent(createPointerEvent('pointerup', init));
}

function dispatchCancelledReleaseConfirm(
  element: HTMLElement,
  moveInit: PointerEventInit,
  startInit: PointerEventInit = {},
): void {
  element.dispatchEvent(createPointerEvent('pointerdown', startInit));
  document.dispatchEvent(createPointerEvent('pointermove', { ...startInit, ...moveInit }));
  element.dispatchEvent(createPointerEvent('pointerup', { ...startInit, ...moveInit }));
}

describe('EncyclopediaOverlay', () => {
  let overlay: EncyclopediaOverlay;
  let uiOverlay: HTMLDivElement;
  const originalInnerHeight = window.innerHeight;
  let previewController: CompanionPreviewController;
  let createPreviewController: ReturnType<typeof vi.fn>;
  let previewShow: ReturnType<typeof vi.fn>;
  let previewHide: ReturnType<typeof vi.fn>;
  let previewDispose: ReturnType<typeof vi.fn>;

  const setViewportHeight = (height: number) => {
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: height,
    });
  };

  beforeEach(() => {
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    previewShow = vi.fn((entry, container: HTMLElement) => {
      const previewNode = document.createElement('div');
      previewNode.setAttribute('data-preview-stage', String(entry.stageNumber));
      container.replaceChildren(previewNode);
    });
    previewHide = vi.fn();
    previewDispose = vi.fn();
    previewController = {
      show: previewShow,
      hide: previewHide,
      dispose: previewDispose,
    };
    createPreviewController = vi.fn(() => previewController);
    overlay = new EncyclopediaOverlay({ createPreviewController });
  });

  afterEach(() => {
    overlay.hide();
    uiOverlay.remove();
    setViewportHeight(originalInnerHeight);
  });

  it('show creates fullscreen DOM in #ui-overlay', () => {
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
  });

  it('adds identity marks to planet names when color-and-mark mode is enabled', () => {
    overlay.show([1], () => {}, undefined, undefined, [], 'color-and-marks');
    const firstCard = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement | null;
    expect(firstCard?.textContent).toContain('○ 月（つき）');
  });

  it('card grid renders all encyclopedia slots', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    expect(cards.length).toBe(PLANET_ENCYCLOPEDIA.length);
  });

  it('renders a constellation gallery section with hidden and discovered entries', () => {
    overlay.show([1], () => {}, undefined, undefined, [1]);

    const cards = uiOverlay.querySelectorAll('[data-constellation-card]');
    const pictures = uiOverlay.querySelectorAll('[data-constellation-picture]');
    expect(cards.length).toBeGreaterThan(0);
    expect(pictures.length).toBe(cards.length);
    expect(uiOverlay.textContent).toContain('せいざずかん');
    expect(uiOverlay.querySelector('[data-constellation-card][data-stage="1"]')?.textContent).toContain('おおぐまざ');
    expect(uiOverlay.querySelector('[data-constellation-card][data-stage="4"]')?.textContent).toContain('？？？');
  });

  it('shows monthly encounters in the celestial encyclopedia tab', () => {
    overlay.show([1], () => {}, undefined, undefined, [], undefined, ['new-year-comet']);

    const monthlyTab = uiOverlay.querySelector('[data-encyclopedia-tab="monthly"]') as HTMLElement;
    dispatchReleaseConfirm(monthlyTab);

    expect(uiOverlay.querySelector('[data-encyclopedia-panel="monthly"]')?.getAttribute('data-active')).toBe('true');
    expect(uiOverlay.textContent).toContain('てんたいずかん');
    expect(uiOverlay.querySelector('[data-monthly-encounter-card][data-monthly-encounter-id="new-year-comet"]')?.textContent)
      .toContain('しんねんすいせい');
    expect(uiOverlay.querySelector('[data-monthly-encounter-card][data-monthly-encounter-id="geminid-rain"]')?.textContent)
      .toContain('？？？');
  });

  it('shows discovered and hidden space gems in the treasure tab', () => {
    overlay.show([1], () => {}, undefined, undefined, [], undefined, [], ['diamond-nebula']);

    const gemTab = uiOverlay.querySelector('[data-encyclopedia-tab="gems"]') as HTMLElement;
    dispatchReleaseConfirm(gemTab);

    expect(uiOverlay.querySelector('[data-encyclopedia-panel="gems"]')?.getAttribute('data-active')).toBe('true');
    expect(uiOverlay.textContent).toContain('たからばこ');
    expect(uiOverlay.querySelector('[data-space-gem-card][data-space-gem-id="diamond-nebula"]')?.textContent)
      .toContain('だいやもんどせいうん');
    expect(uiOverlay.querySelector('[data-space-gem-card][data-space-gem-id="ruby-solar-wind"]')?.textContent)
      .toContain('？？？');
  });

  it('unlocked card shows emoji and name', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.textContent).toContain('🌙');
    expect(firstCard.textContent).toContain('月（つき）');
  });

  it('locked card shows ???', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.textContent).toContain('？？？');
  });

  it('locked card has opacity 0.6', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.style.opacity).toBe('0.6');
  });

  it('detail modal on unlocked card tap shows trivia', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    dispatchReleaseConfirm(firstCard);
    const detail = uiOverlay.querySelector('[data-detail]') as HTMLElement;
    expect(detail).not.toBeNull();
    expect(detail.textContent).toContain('つきは ちきゅうの まわりを まわっているよ');
  });

  it('unlocked card does not open detail until pointer release', () => {
    overlay.show([1], () => {});
    const firstCard = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;

    firstCard.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 10 }));
    expect(uiOverlay.querySelector('[data-detail]')).toBeNull();

    firstCard.dispatchEvent(createPointerEvent('pointerup', { clientX: 10, clientY: 10 }));
    expect(uiOverlay.querySelector('[data-detail]')).not.toBeNull();
  });

  it('unlocked card does not open detail after scroll-like movement beyond tolerance', () => {
    overlay.show([1], () => {});
    const firstCard = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;

    dispatchCancelledReleaseConfirm(
      firstCard,
      { clientX: 24, clientY: 10 },
      { clientX: 10, clientY: 10 },
    );

    expect(uiOverlay.querySelector('[data-detail]')).toBeNull();
  });

  it('detail modal includes a companion preview area', () => {
    overlay.show([1], () => {});
    const firstCard = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(firstCard);

    const preview = uiOverlay.querySelector('[data-detail-companion-preview]') as HTMLElement | null;
    expect(preview).not.toBeNull();
    expect(preview?.children.length).toBeGreaterThan(0);
    expect(uiOverlay.textContent).toContain('うちゅうの なかま');
  });

  it('reuses one preview controller across sequential detail opens', () => {
    overlay.show([1, 2], () => {});

    const firstCard = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(firstCard);
    const firstBackBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    dispatchReleaseConfirm(firstBackBtn);

    const secondCard = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    dispatchReleaseConfirm(secondCard);

    expect(createPreviewController).toHaveBeenCalledTimes(1);
    expect(previewShow).toHaveBeenCalledTimes(2);
    expect(previewHide).toHaveBeenCalledTimes(1);
    expect(previewDispose).not.toHaveBeenCalled();
  });

  it('hides preview on detail close but disposes it only when overlay closes', () => {
    overlay.show([1], () => {});
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(card);

    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    dispatchReleaseConfirm(backBtn);

    expect(previewHide).toHaveBeenCalledTimes(1);
    expect(previewDispose).not.toHaveBeenCalled();

    overlay.hide();
    expect(previewDispose).toHaveBeenCalledTimes(1);
  });

  it('hideDetail returns to gallery', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    dispatchReleaseConfirm(firstCard);
    // Click back button in detail
    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    expect(backBtn).not.toBeNull();
    dispatchReleaseConfirm(backBtn);
    const detail = uiOverlay.querySelector('[data-detail]');
    expect(detail).toBeNull();
  });

  it('showStageDetail opens a read-only detail overlay and closes back to the caller', () => {
    let closed = false;
    const shown = overlay.showStageDetail(2, () => {
      closed = true;
    }, {
      bestStageStars: { 2: 5 },
      backLabel: 'クリアへ もどる',
      zIndex: 50,
    });

    expect(shown).toBe(true);
    const detailOverlay = uiOverlay.querySelector('[data-encyclopedia-detail-overlay]') as HTMLElement | null;
    expect(detailOverlay).not.toBeNull();
    expect(detailOverlay?.style.zIndex).toBe('50');
    expect(detailOverlay?.textContent).toContain('水星（すいせい）');
    expect(detailOverlay?.textContent).toContain('すいせいは たいように いちばん ちかい わくせいだよ');
    expect(
      detailOverlay?.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-detail"]')?.textContent,
    ).toContain('⭐ ベスト 5');
    expect(detailOverlay?.querySelector('[data-detail-play]')).toBeNull();

    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    expect(backBtn.textContent).toBe('クリアへ もどる');
    dispatchReleaseConfirm(backBtn);

    expect(closed).toBe(true);
    expect(uiOverlay.querySelector('[data-encyclopedia-detail-overlay]')).toBeNull();
  });

  it('hide removes DOM', () => {
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
    overlay.hide();
    expect(uiOverlay.children.length).toBe(0);
  });

  it('double-show prevention', () => {
    overlay.show([], () => {});
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
  });

  it('back button calls onClose', () => {
    let closed = false;
    overlay.show([], () => { closed = true; });
    const backBtn = uiOverlay.querySelector('[data-gallery-back]') as HTMLElement;
    expect(backBtn).not.toBeNull();
    dispatchReleaseConfirm(backBtn);
    expect(closed).toBe(true);
  });

  it('cards have data-stage attribute matching stageNumber', () => {
    overlay.show([1, 2], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    expect(cards[0].getAttribute('data-stage')).toBe('1');
    expect(cards[1].getAttribute('data-stage')).toBe('2');
  });

  it('with onSelectStage, unlocked card tap opens detail without calling callback', () => {
    const selected: number[] = [];
    overlay.show([2], () => {}, (stageNumber) => {
      selected.push(stageNumber);
    }, { 2: 4 });
    const card = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    expect(card).not.toBeNull();
    dispatchReleaseConfirm(card);
    expect(selected).toEqual([]);
    const detail = uiOverlay.querySelector('[data-detail]') as HTMLElement | null;
    expect(detail).not.toBeNull();
    expect(detail?.textContent).toContain('水星（すいせい）');
    expect(detail?.textContent).toContain('すいせいは たいように いちばん ちかい わくせいだよ');
    expect(
      detail?.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-detail"]')?.textContent,
    ).toContain('⭐ ベスト 4');
  });

  it('detail play button calls onSelectStage exactly once and hides overlay', () => {
    const selected: number[] = [];
    overlay.show([1], () => {}, (stageNumber) => {
      selected.push(stageNumber);
    });
    expect(uiOverlay.children.length).toBe(1);
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(card);
    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement | null;
    expect(playButton).not.toBeNull();
    playButton && dispatchReleaseConfirm(playButton);
    expect(selected).toEqual([1]);
    expect(uiOverlay.children.length).toBe(0);
  });

  it('detail play and back buttons activate only on release', () => {
    const selected: number[] = [];
    overlay.show([1], () => {}, (stageNumber) => {
      selected.push(stageNumber);
    });
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(card);

    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement;
    playButton.dispatchEvent(createPointerEvent('pointerdown', { clientX: 40, clientY: 40 }));
    expect(selected).toEqual([]);
    expect(uiOverlay.children.length).toBe(1);
    playButton.dispatchEvent(createPointerEvent('pointerup', { clientX: 40, clientY: 40 }));

    expect(selected).toEqual([1]);
    expect(uiOverlay.children.length).toBe(0);

    overlay.show([1], () => {}, () => {});
    dispatchReleaseConfirm(uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement);
    const backButton = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    backButton.dispatchEvent(createPointerEvent('pointerdown', { clientX: 12, clientY: 12 }));
    expect(uiOverlay.querySelector('[data-detail]')).not.toBeNull();
    backButton.dispatchEvent(createPointerEvent('pointerup', { clientX: 12, clientY: 12 }));
    expect(uiOverlay.querySelector('[data-detail]')).toBeNull();
  });

  it('locked card does not invoke onSelectStage', () => {
    let called = false;
    overlay.show([], () => {}, () => { called = true; });
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    // Locked cards have pointer-events: none, but verify no listener side-effect
    card.dispatchEvent(createPointerEvent('pointerdown'));
    expect(called).toBe(false);
    expect(card.style.pointerEvents).toBe('none');
  });

  it('without onSelectStage, unlocked card still opens detail (backward compat)', () => {
    overlay.show([1], () => {});
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(card);
    const detail = uiOverlay.querySelector('[data-detail]');
    expect(detail).not.toBeNull();
  });

  it('uses a compact no-scroll gallery layout on low viewport heights', () => {
    setViewportHeight(520);

    overlay.show([1], () => {});

    const galleryContent = uiOverlay.querySelector('[data-gallery-content]') as HTMLElement | null;
    const galleryMain = uiOverlay.querySelector('[data-gallery-main]') as HTMLElement | null;
    const grid = uiOverlay.querySelector('[data-gallery-grid]') as HTMLElement | null;
    const backBtn = uiOverlay.querySelector('[data-gallery-back]') as HTMLButtonElement | null;

    expect(galleryContent).not.toBeNull();
    expect(galleryContent?.style.maxHeight).toBe('720px');
    expect(galleryContent?.style.overflow).toBe('hidden');
    expect(galleryMain?.style.display).toBe('grid');
    expect(grid?.style.gridTemplateColumns).toContain('minmax(86px, 1fr)');
    expect(backBtn).not.toBeNull();
  });

  it('keeps detail actions inside compact no-scroll containers on low viewport heights', () => {
    setViewportHeight(520);

    overlay.show([1], () => {}, () => {});
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    dispatchReleaseConfirm(card);

    const detailContent = uiOverlay.querySelector('[data-detail-content]') as HTMLElement | null;
    const detailCard = uiOverlay.querySelector('[data-detail-card]') as HTMLElement | null;
    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLButtonElement | null;
    const playBtn = uiOverlay.querySelector('[data-detail-play]') as HTMLButtonElement | null;

    expect(detailContent).not.toBeNull();
    expect(detailContent?.style.maxHeight).toBe('720px');
    expect(detailContent?.style.overflow).toBe('hidden');
    expect(detailCard?.style.overflowY).toBe('hidden');
    expect(detailCard).not.toBeNull();
    expect(backBtn).not.toBeNull();
    expect(playBtn).not.toBeNull();
    expect(uiOverlay.textContent).toContain('せいざ');
  });

  describe('bestStageStars display', () => {
    it('shows medal progress on unlocked card when no record exists', () => {
      overlay.show([1], () => {}, undefined, {});
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      const medal = card.querySelector(
        '[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]',
      ) as HTMLElement | null;
      expect(medal).not.toBeNull();
      expect(medal?.getAttribute('data-stage-medal-earned')).toBe('0');
      expect(medal?.textContent).toContain('つぎ ⭐ 2');
    });

    it('shows medal progress when bestStageStars omitted (backward compat)', () => {
      overlay.show([1], () => {});
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      expect(
        card.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]'),
      ).not.toBeNull();
    });

    it('shows empty medal progress when count is 0', () => {
      overlay.show([1], () => {}, undefined, { 1: 0 });
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      expect(
        card.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]')
          ?.getAttribute('data-stage-medal-earned'),
      ).toBe('0');
    });

    it('shows earned medals and best hint on unlocked card when a record exists', () => {
      overlay.show([1], () => {}, undefined, { 1: 7 });
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      const medal = card.querySelector(
        '[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]',
      ) as HTMLElement | null;
      expect(medal).not.toBeNull();
      expect(medal?.getAttribute('data-stage-medal-earned')).toBe('2');
      expect(medal?.textContent).toContain('⭐ ベスト 7');
    });

    it('does not show medal progress on locked card', () => {
      overlay.show([], () => {}, undefined, { 1: 9 });
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      expect(card.querySelector('[data-stage-medal-display]')).toBeNull();
    });

    it('shows medal progress inside detail view when a record exists', () => {
      overlay.show([1], () => {}, undefined, { 1: 4 });
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      card.dispatchEvent(new Event('pointerup', { bubbles: true }));
      const detailMedal = uiOverlay.querySelector(
        '[data-stage-medal-display][data-stage-medal-scope="encyclopedia-detail"]',
      ) as HTMLElement | null;
      expect(detailMedal).not.toBeNull();
      expect(detailMedal?.getAttribute('data-stage-medal-earned')).toBe('1');
      expect(detailMedal?.textContent).toContain('⭐ ベスト 4');
    });

    it('shows next target inside detail when no record exists', () => {
      overlay.show([1], () => {}, undefined, {});
      const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      card.dispatchEvent(new Event('pointerup', { bubbles: true }));
      expect(
        uiOverlay.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-detail"]')
          ?.textContent,
      ).toContain('つぎ ⭐ 2');
    });

    it('per-stage medal counts render independently', () => {
      overlay.show([1, 2], () => {}, undefined, { 1: 3, 2: 8 });
      const c1 = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
      const c2 = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
      expect(
        c1.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]')
          ?.getAttribute('data-stage-medal-earned'),
      ).toBe('1');
      expect(
        c2.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-card"]')
          ?.getAttribute('data-stage-medal-earned'),
      ).toBe('2');
    });
  });
});
