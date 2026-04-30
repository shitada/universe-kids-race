// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD stage progress bar (🚀 ─── 🪐)', () => {
  let hud: HUD;

  beforeEach(() => {
    const hudRoot = document.createElement('div');
    hudRoot.id = 'hud';
    document.body.appendChild(hudRoot);

    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);

    hud = new HUD();
  });

  afterEach(() => {
    hud.hide();
    document.getElementById('hud')?.remove();
    document.getElementById('ui-overlay')?.remove();
  });

  function getContainer(): HTMLElement | null {
    return document.querySelector('[data-stage-progress-container]') as HTMLElement | null;
  }
  function getFill(): HTMLElement | null {
    return document.querySelector('[data-stage-progress-fill]') as HTMLElement | null;
  }
  function getShip(): HTMLElement | null {
    return document.querySelector('[data-stage-progress-ship]') as HTMLElement | null;
  }
  function getGoal(): HTMLElement | null {
    return document.querySelector('[data-stage-progress-goal]') as HTMLElement | null;
  }

  describe('DOM structure on show()', () => {
    it('creates container, fill, ship and goal elements', () => {
      hud.show('テスト', 0xff66aa);
      expect(getContainer()).not.toBeNull();
      expect(getFill()).not.toBeNull();
      expect(getShip()).not.toBeNull();
      expect(getGoal()).not.toBeNull();
    });

    it('uses Zen Maru Gothic font and rounded shape on container/track', () => {
      hud.show('テスト', 0xff66aa);
      const container = getContainer()!;
      const track = document.querySelector('[data-stage-progress-track]') as HTMLElement;
      expect(container.style.fontFamily).toContain('Zen Maru Gothic');
      expect(track.style.borderRadius).toBe('7px');
    });

    it('🚀 sits to the left and 🪐 to the right of the track in DOM order', () => {
      hud.show('テスト', 0x00ff88);
      const container = getContainer()!;
      const ship = getShip()!;
      const goal = getGoal()!;
      const shipIdx = Array.from(container.children).indexOf(ship);
      const goalIdx = Array.from(container.children).indexOf(goal);
      expect(shipIdx).toBeGreaterThanOrEqual(0);
      expect(goalIdx).toBeGreaterThan(shipIdx);
    });

    it('applies planetColor to fill gradient and goal text-shadow', () => {
      hud.show('テスト', 0x00ff88);
      const fill = getFill()!;
      const goal = getGoal()!;
      expect(fill.getAttribute('data-stage-progress-color')).toBe('#00ff88');
      expect(goal.style.textShadow.toLowerCase()).toContain('#00ff88');
    });

    it('falls back to a default goal colour when planetColor is omitted', () => {
      hud.show('テスト');
      const fill = getFill()!;
      expect(fill.getAttribute('data-stage-progress-color')).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('sets aria attributes for screen readers', () => {
      hud.show('テスト', 0xffffff);
      const container = getContainer()!;
      expect(container.getAttribute('role')).toBe('progressbar');
      expect(container.getAttribute('aria-label')).toBe('ゴールまでの すすみ');
      expect(container.getAttribute('aria-valuemin')).toBe('0');
      expect(container.getAttribute('aria-valuemax')).toBe('100');
      expect(container.getAttribute('aria-valuenow')).toBe('0');
    });
  });

  describe('updateStageProgress', () => {
    it('width=0% when called with 0', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(0);
      expect(getFill()!.style.width).toBe('0%');
      expect(getContainer()!.getAttribute('aria-valuenow')).toBe('0');
    });

    it('width=50% when called with 0.5', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(0.5);
      expect(getFill()!.style.width).toBe('50%');
      expect(getContainer()!.getAttribute('aria-valuenow')).toBe('50');
    });

    it('width=100% and complete attribute when called with 1', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(1);
      expect(getFill()!.style.width).toBe('100%');
      expect(getContainer()!.hasAttribute('data-stage-progress-complete')).toBe(true);
      expect(getContainer()!.getAttribute('aria-valuenow')).toBe('100');
    });

    it('clamps values below 0 and above 1', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(-2);
      expect(getFill()!.style.width).toBe('0%');
      hud.updateStageProgress(2);
      expect(getFill()!.style.width).toBe('100%');
    });

    it('does not re-write style.width when the integer percentage is unchanged', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(0.5);
      const fill = getFill()!;
      let writes = 0;
      const desc = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'width');
      Object.defineProperty(fill.style, 'width', {
        configurable: true,
        get() {
          return '50%';
        },
        set() {
          writes++;
        },
      });
      // 0.501 still rounds to 50% → no write
      hud.updateStageProgress(0.501);
      hud.updateStageProgress(0.499);
      expect(writes).toBe(0);
      // 0.6 rounds to 60% → exactly one write
      hud.updateStageProgress(0.6);
      expect(writes).toBe(1);
      if (desc) {
        Object.defineProperty(fill.style, 'width', desc);
      }
    });

    it('re-fires the goal flash only on transitions into complete', () => {
      hud.show('テスト', 0xffffff);
      const goal = getGoal()!;
      hud.updateStageProgress(0.5);
      expect(goal.hasAttribute('data-stage-goal-flash')).toBe(false);
      hud.updateStageProgress(1.0);
      expect(goal.hasAttribute('data-stage-goal-flash')).toBe(true);
      // Repeated calls at 1.0 must not retrigger while the flash is still set.
      goal.removeAttribute('data-stage-goal-flash');
      hud.updateStageProgress(1.0);
      expect(goal.hasAttribute('data-stage-goal-flash')).toBe(false);
    });
  });

  describe('hide() and re-show()', () => {
    it('removes all stage progress DOM elements on hide()', () => {
      hud.show('テスト', 0xffffff);
      hud.hide();
      expect(getContainer()).toBeNull();
      expect(getFill()).toBeNull();
      expect(getShip()).toBeNull();
      expect(getGoal()).toBeNull();
    });

    it('resets the differential cache so re-show + updateStageProgress(0) writes width=0%', () => {
      hud.show('テスト', 0xffffff);
      hud.updateStageProgress(0.7);
      hud.hide();
      hud.show('テスト2', 0xffffff);
      // Fresh element starts at width=0% from createStageProgress.
      expect(getFill()!.style.width).toBe('0%');
      hud.updateStageProgress(0);
      expect(getFill()!.style.width).toBe('0%');
      expect(getContainer()!.hasAttribute('data-stage-progress-complete')).toBe(false);
    });
  });
});
