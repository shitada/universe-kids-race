// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD', () => {
  let hud: HUD;

  beforeEach(() => {
    // Create #hud and #ui-overlay elements
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

  describe('Stage Name Visibility (US2)', () => {
    it('creates stage name element with correct text', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      // Stage name is second child (after home button)
      const stageNameEl = hudRoot.children[1] as HTMLElement;
      expect(stageNameEl).not.toBeNull();
      expect(stageNameEl.textContent).toBe('🌙 つきを めざせ！');
    });

    it('applies font-size of 1.5rem to stage name', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const stageNameEl = hudRoot.children[1] as HTMLElement;
      expect(stageNameEl.style.cssText).toContain('1.5rem');
    });

    it('applies text-shadow for contrast', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const stageNameEl = hudRoot.children[1] as HTMLElement;
      expect(stageNameEl.style.cssText).toContain('text-shadow');
    });

    it('sets z-index on hud root for visibility', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      expect(hudRoot.style.zIndex).toBe('10');
    });
  });

  describe('Home Button (US3)', () => {
    it('creates home button element in #hud', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button');
      expect(homeBtn).not.toBeNull();
      expect(homeBtn!.textContent).toBe('🏠');
    });

    it('positions home button at top-left with safe area inset', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button') as HTMLButtonElement;
      expect(homeBtn.style.position).toBe('absolute');
      expect(homeBtn.style.top).toBe('0.8rem');
    });

    it('sets pointer-events auto on home button', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button') as HTMLButtonElement;
      expect(homeBtn.style.pointerEvents).toBe('auto');
    });

    it('invokes callback on pointerdown', () => {
      hud.show('🌙 つきを めざせ！');
      let called = false;
      hud.setHomeCallback(() => { called = true; });
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button') as HTMLButtonElement;
      homeBtn.dispatchEvent(new Event('pointerdown'));
      expect(called).toBe(true);
    });

    it('home button is removed on hide()', () => {
      hud.show('🌙 つきを めざせ！');
      hud.hide();
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button');
      expect(homeBtn).toBeNull();
    });

    describe('press visual feedback', () => {
      const getHomeBtn = (): HTMLButtonElement =>
        document.getElementById('hud')!.querySelector('button') as HTMLButtonElement;

      it('initialises home button transform to scale(1) with transform transition', () => {
        hud.show('🌙 つきを めざせ！');
        const btn = getHomeBtn();
        expect(btn.style.transform).toBe('scale(1)');
        expect(btn.style.transition).toContain('transform');
      });

      it('shrinks home button to scale(0.9) on pointerdown', () => {
        hud.show('🌙 つきを めざせ！');
        const btn = getHomeBtn();
        btn.dispatchEvent(new Event('pointerdown'));
        expect(btn.style.transform).toBe('scale(0.9)');
      });

      it('restores home button to scale(1) on pointerup', () => {
        hud.show('🌙 つきを めざせ！');
        const btn = getHomeBtn();
        btn.dispatchEvent(new Event('pointerdown'));
        btn.dispatchEvent(new Event('pointerup'));
        expect(btn.style.transform).toBe('scale(1)');
      });

      it('restores home button to scale(1) on pointercancel', () => {
        hud.show('🌙 つきを めざせ！');
        const btn = getHomeBtn();
        btn.dispatchEvent(new Event('pointerdown'));
        btn.dispatchEvent(new Event('pointercancel'));
        expect(btn.style.transform).toBe('scale(1)');
      });

      it('restores home button to scale(1) on pointerleave', () => {
        hud.show('🌙 つきを めざせ！');
        const btn = getHomeBtn();
        btn.dispatchEvent(new Event('pointerdown'));
        btn.dispatchEvent(new Event('pointerleave'));
        expect(btn.style.transform).toBe('scale(1)');
      });

      it('still fires home callback on pointerdown when applying press feedback', () => {
        hud.show('🌙 つきを めざせ！');
        let called = 0;
        hud.setHomeCallback(() => { called++; });
        const btn = getHomeBtn();
        btn.dispatchEvent(new Event('pointerdown'));
        expect(called).toBe(1);
        expect(btn.style.transform).toBe('scale(0.9)');
      });
    });
  });

  describe('Cooldown Indicator (US5)', () => {
    it('creates cooldown indicator elements on show()', () => {
      hud.show('Test');
      const uiOverlay = document.getElementById('ui-overlay')!;
      const container = uiOverlay.querySelector('[data-cooldown-container]');
      const bar = uiOverlay.querySelector('[data-cooldown-bar]');
      expect(container).not.toBeNull();
      expect(bar).not.toBeNull();
    });

    it('updateCooldown sets bar width percentage', () => {
      hud.show('Test');
      hud.updateCooldown(0.5);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.width).toBe('50%');
    });

    it('updateCooldown(0) sets bar width to 0%', () => {
      hud.show('Test');
      hud.updateCooldown(0);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.width).toBe('0%');
    });

    it('updateCooldown(1.0) sets bar width to 100%', () => {
      hud.show('Test');
      hud.updateCooldown(1.0);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.width).toBe('100%');
    });

    it('adds glow class when progress reaches 1.0', () => {
      hud.show('Test');
      hud.updateCooldown(0.5);
      hud.updateCooldown(1.0);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.boxShadow).toContain('0 0 10px');
    });

    it('removes glow when progress drops below 1.0', () => {
      hud.show('Test');
      hud.updateCooldown(1.0);
      hud.updateCooldown(0.0);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.boxShadow).toBe('none');
    });

    it('cooldown indicator is removed on hide()', () => {
      hud.show('Test');
      hud.hide();
      const container = document.querySelector('[data-cooldown-container]');
      expect(container).toBeNull();
    });
  });

  describe('Stage Number Display (004-US1)', () => {
    it('displays stage name with stage number prefix', () => {
      hud.show('ステージ1: 🌙 月をめざせ！');
      const hudRoot = document.getElementById('hud')!;
      const stageNameEl = hudRoot.children[1] as HTMLElement;
      expect(stageNameEl.textContent).toBe('ステージ1: 🌙 月をめざせ！');
    });

    it('displays stage 8 with correct format', () => {
      hud.show('ステージ8: ☀️ 太陽をめざせ！');
      const hudRoot = document.getElementById('hud')!;
      const stageNameEl = hudRoot.children[1] as HTMLElement;
      expect(stageNameEl.textContent).toBe('ステージ8: ☀️ 太陽をめざせ！');
    });
  });

  describe('Boost Button Design (US6)', () => {
    it('has gradient background', () => {
      hud.show('Test');
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      expect(boostBtn.style.background).toContain('linear-gradient');
    });

    it('contains 🚀 emoji in text content', () => {
      hud.show('Test');
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      expect(boostBtn.textContent).toContain('🚀');
    });

    it('has border-radius 2rem', () => {
      hud.show('Test');
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      expect(boostBtn.style.borderRadius).toBe('2rem');
    });

    it('applies press animation class on pointerdown', () => {
      hud.show('Test');
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(boostBtn.style.transform).toContain('scale');
    });

    it('applies cooldown disabled state with updateCooldown', () => {
      hud.show('Test');
      hud.updateCooldown(0.0);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      expect(boostBtn.style.opacity).toBe('0.5');
      expect(boostBtn.style.filter).toContain('grayscale');
    });

    it('removes disabled state when cooldown completes', () => {
      hud.show('Test');
      hud.updateCooldown(0.0);
      hud.updateCooldown(1.0);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      expect(boostBtn.style.opacity).toBe('1');
      expect(boostBtn.style.filter).toBe('none');
    });
  });

  describe('Boost Button Cooldown Tap Feedback', () => {
    it('does not invoke callback while cooldown is in progress', () => {
      hud.show('Test');
      let callCount = 0;
      hud.setBoostCallback(() => { callCount++; });
      hud.updateCooldown(0.5);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(callCount).toBe(0);
    });

    it('adds data-boost-shake attribute on cooldown tap and removes it after ~250ms', async () => {
      hud.show('Test');
      hud.setBoostCallback(() => {});
      hud.updateCooldown(0.5);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(boostBtn.hasAttribute('data-boost-shake')).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 300));
      expect(boostBtn.hasAttribute('data-boost-shake')).toBe(false);
    });

    it('invokes callback once when cooldown is complete', () => {
      hud.show('Test');
      let callCount = 0;
      hud.setBoostCallback(() => { callCount++; });
      hud.updateCooldown(1.0);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(callCount).toBe(1);
    });

    it('invokes callback on first tap before any updateCooldown call (initial active state)', () => {
      hud.show('Test');
      let callCount = 0;
      hud.setBoostCallback(() => { callCount++; });
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(callCount).toBe(1);
    });
  });

  describe('Boost Button Denied SFX Callback', () => {
    it('invokes boost denied callback when tapped during cooldown', () => {
      hud.show('Test');
      let deniedCount = 0;
      let boostCount = 0;
      hud.setBoostCallback(() => { boostCount++; });
      hud.setBoostDeniedCallback(() => { deniedCount++; });
      hud.updateCooldown(0.5);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(deniedCount).toBe(1);
      expect(boostCount).toBe(0);
    });

    it('does NOT invoke boost denied callback when boost is available', () => {
      hud.show('Test');
      let deniedCount = 0;
      let boostCount = 0;
      hud.setBoostCallback(() => { boostCount++; });
      hud.setBoostDeniedCallback(() => { deniedCount++; });
      hud.updateCooldown(1.0);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(deniedCount).toBe(0);
      expect(boostCount).toBe(1);
    });

    it('debounces boost denied callback within shake window (250ms)', () => {
      hud.show('Test');
      let deniedCount = 0;
      hud.setBoostDeniedCallback(() => { deniedCount++; });
      hud.updateCooldown(0.5);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      boostBtn.dispatchEvent(new Event('pointerdown'));
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(deniedCount).toBe(1);
    });

    it('allows boost denied callback again after shake window elapses', async () => {
      hud.show('Test');
      let deniedCount = 0;
      hud.setBoostDeniedCallback(() => { deniedCount++; });
      hud.updateCooldown(0.5);
      const uiOverlay = document.getElementById('ui-overlay')!;
      const boostBtn = uiOverlay.querySelector('button') as HTMLButtonElement;
      boostBtn.dispatchEvent(new Event('pointerdown'));
      await new Promise((resolve) => setTimeout(resolve, 300));
      boostBtn.dispatchEvent(new Event('pointerdown'));
      expect(deniedCount).toBe(2);
    });
  });

  describe('updateCooldown differential writes (perf)', () => {
    function spyStyleSetter(el: HTMLElement, prop: string): { count: number; values: string[] } {
      const tracker = { count: 0, values: [] as string[] };
      let current = (el.style as unknown as Record<string, string>)[prop] ?? '';
      Object.defineProperty(el.style, prop, {
        configurable: true,
        get() { return current; },
        set(v: string) {
          tracker.count++;
          tracker.values.push(v);
          current = v;
        },
      });
      return tracker;
    }

    it('does not rewrite cooldown bar width when progress is unchanged across frames', () => {
      hud.show('Test');
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      // Prime with an initial value, then start spying.
      hud.updateCooldown(0.42);
      const widthSpy = spyStyleSetter(bar, 'width');
      for (let i = 0; i < 10; i++) {
        hud.updateCooldown(0.42);
      }
      expect(widthSpy.count).toBe(0);
    });

    it('does not rewrite boost button opacity/filter/animation while ready state is unchanged', () => {
      hud.show('Test');
      const boostBtn = document.getElementById('ui-overlay')!.querySelector('button') as HTMLButtonElement;
      // Establish ready state.
      hud.updateCooldown(1.0);
      const opacitySpy = spyStyleSetter(boostBtn, 'opacity');
      const filterSpy = spyStyleSetter(boostBtn, 'filter');
      const animationSpy = spyStyleSetter(boostBtn, 'animation');
      hud.updateCooldown(1.0);
      hud.updateCooldown(1.0);
      hud.updateCooldown(1.0);
      expect(opacitySpy.count).toBe(0);
      expect(filterSpy.count).toBe(0);
      expect(animationSpy.count).toBe(0);
    });

    it('updates boxShadow and animation exactly once per ready-state transition', () => {
      hud.show('Test');
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      const boostBtn = document.getElementById('ui-overlay')!.querySelector('button') as HTMLButtonElement;
      // Start from a known not-ready state.
      hud.updateCooldown(0.5);
      const boxShadowSpy = spyStyleSetter(bar, 'boxShadow');
      const animationSpy = spyStyleSetter(boostBtn, 'animation');

      // 0.5 -> 1.0 : 1 transition (not-ready -> ready)
      hud.updateCooldown(1.0);
      // 1.0 -> 0.5 : 1 transition (ready -> not-ready)
      hud.updateCooldown(0.5);

      expect(boxShadowSpy.count).toBe(2);
      expect(animationSpy.count).toBe(2);
    });

    it('quantizes width to integer percentage', () => {
      hud.show('Test');
      hud.updateCooldown(0.333);
      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      expect(bar.style.width).toBe('33%');
    });

    it('reapplies styles on the first updateCooldown after hide()/show() re-entry', () => {
      hud.show('Test');
      hud.updateCooldown(0.5);
      hud.hide();

      const uiOverlay = document.createElement('div');
      uiOverlay.id = 'ui-overlay';
      const hudRoot = document.createElement('div');
      hudRoot.id = 'hud';
      // Fresh DOM hosts (afterEach already removed previous ones during teardown,
      // but we are still inside the same test, so re-create them now).
      document.getElementById('ui-overlay')?.remove();
      document.getElementById('hud')?.remove();
      document.body.appendChild(hudRoot);
      document.body.appendChild(uiOverlay);

      hud.show('Test');
      hud.updateCooldown(0.5);

      const bar = document.querySelector('[data-cooldown-bar]') as HTMLElement;
      const boostBtn = document.getElementById('ui-overlay')!.querySelector('button') as HTMLButtonElement;
      expect(bar.style.width).toBe('50%');
      expect(boostBtn.style.opacity).toBe('0.5');
    });
  });

  describe('update(score, starCount) differential writes (perf)', () => {
    function spyTextContent(el: HTMLElement): { count: number; values: string[] } {
      const tracker = { count: 0, values: [] as string[] };
      let current = el.textContent ?? '';
      Object.defineProperty(el, 'textContent', {
        configurable: true,
        get() { return current; },
        set(v: string) {
          tracker.count++;
          tracker.values.push(v);
          current = v;
        },
      });
      return tracker;
    }

    function getScoreAndStarSpans(): { scoreEl: HTMLElement; starEl: HTMLElement } {
      const hudRoot = document.getElementById('hud')!;
      const spans = hudRoot.querySelectorAll('span');
      // First span is score, second is star count (per show() construction order).
      return {
        scoreEl: spans[0] as HTMLElement,
        starEl: spans[1] as HTMLElement,
      };
    }

    it('does not rewrite score/star textContent when values are unchanged across frames', () => {
      hud.show('Test');
      // Prime with an initial value, then start spying.
      hud.update(7, 3);
      const { scoreEl, starEl } = getScoreAndStarSpans();
      const scoreSpy = spyTextContent(scoreEl);
      const starSpy = spyTextContent(starEl);
      for (let i = 0; i < 10; i++) {
        hud.update(7, 3);
      }
      expect(scoreSpy.count).toBe(0);
      expect(starSpy.count).toBe(0);
    });

    it('writes immediately when score or starCount changes', () => {
      hud.show('Test');
      hud.update(0, 0);
      const { scoreEl, starEl } = getScoreAndStarSpans();
      const scoreSpy = spyTextContent(scoreEl);
      const starSpy = spyTextContent(starEl);

      hud.update(5, 0);
      expect(scoreSpy.count).toBe(1);
      expect(scoreSpy.values[0]).toBe('5');
      expect(starSpy.count).toBe(0);

      hud.update(5, 2);
      expect(scoreSpy.count).toBe(1);
      expect(starSpy.count).toBe(1);
      expect(starSpy.values[0]).toBe('2');
    });

    it('reapplies score/star textContent on the first update after hide()/show() re-entry', () => {
      hud.show('Test');
      hud.update(42, 9);
      hud.hide();

      // Recreate DOM hosts (afterEach hasn't run yet inside the test).
      document.getElementById('ui-overlay')?.remove();
      document.getElementById('hud')?.remove();
      const hudRoot = document.createElement('div');
      hudRoot.id = 'hud';
      const uiOverlay = document.createElement('div');
      uiOverlay.id = 'ui-overlay';
      document.body.appendChild(hudRoot);
      document.body.appendChild(uiOverlay);

      hud.show('Test');
      // Spy BEFORE any update so we can confirm the very first update writes.
      const { scoreEl, starEl } = getScoreAndStarSpans();
      const scoreSpy = spyTextContent(scoreEl);
      const starSpy = spyTextContent(starEl);

      hud.update(42, 9);
      expect(scoreSpy.count).toBe(1);
      expect(scoreSpy.values[0]).toBe('42');
      expect(starSpy.count).toBe(1);
      expect(starSpy.values[0]).toBe('9');
    });
  });
});
