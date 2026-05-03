// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EncyclopediaOverlay } from '../../../src/ui/EncyclopediaOverlay';

describe('EncyclopediaOverlay', () => {
  let overlay: EncyclopediaOverlay;
  let uiOverlay: HTMLDivElement;

  beforeEach(() => {
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    overlay = new EncyclopediaOverlay();
  });

  afterEach(() => {
    overlay.hide();
    uiOverlay.remove();
  });

  it('show creates fullscreen DOM in #ui-overlay', () => {
    overlay.show([], () => {});
    expect(uiOverlay.children.length).toBe(1);
  });

  it('card grid renders 11 slots', () => {
    overlay.show([], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    expect(cards.length).toBe(11);
  });

  it('unlocked card shows emoji and name', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.textContent).toContain('🌙');
    expect(firstCard.textContent).toContain('月');
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
    firstCard.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const detail = uiOverlay.querySelector('[data-detail]') as HTMLElement;
    expect(detail).not.toBeNull();
    expect(detail.textContent).toContain('つきは ちきゅうの まわりを まわっているよ');
  });

  it('hideDetail returns to gallery', () => {
    overlay.show([1], () => {});
    const cards = uiOverlay.querySelectorAll('[data-card]');
    const firstCard = cards[0] as HTMLElement;
    firstCard.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    // Click back button in detail
    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    expect(backBtn).not.toBeNull();
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
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
    expect(detailOverlay?.textContent).toContain('水星');
    expect(detailOverlay?.textContent).toContain('すいせいは たいように いちばん ちかい わくせいだよ');
    expect(
      detailOverlay?.querySelector('[data-stage-medal-display][data-stage-medal-scope="encyclopedia-detail"]')?.textContent,
    ).toContain('⭐ ベスト 5');
    expect(detailOverlay?.querySelector('[data-detail-play]')).toBeNull();

    const backBtn = uiOverlay.querySelector('[data-detail-back]') as HTMLElement;
    expect(backBtn.textContent).toBe('クリアへ もどる');
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));

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
    backBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
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
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(selected).toEqual([]);
    const detail = uiOverlay.querySelector('[data-detail]') as HTMLElement | null;
    expect(detail).not.toBeNull();
    expect(detail?.textContent).toContain('水星');
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
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement | null;
    expect(playButton).not.toBeNull();
    playButton?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(selected).toEqual([1]);
    expect(uiOverlay.children.length).toBe(0);
  });

  it('locked card does not invoke onSelectStage', () => {
    let called = false;
    overlay.show([], () => {}, () => { called = true; });
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    // Locked cards have pointer-events: none, but verify no listener side-effect
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(called).toBe(false);
    expect(card.style.pointerEvents).toBe('none');
  });

  it('without onSelectStage, unlocked card still opens detail (backward compat)', () => {
    overlay.show([1], () => {});
    const card = uiOverlay.querySelector('[data-card][data-stage="1"]') as HTMLElement;
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    const detail = uiOverlay.querySelector('[data-detail]');
    expect(detail).not.toBeNull();
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
