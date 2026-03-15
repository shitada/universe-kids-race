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

    it('positions home button at top-left', () => {
      hud.show('🌙 つきを めざせ！');
      const hudRoot = document.getElementById('hud')!;
      const homeBtn = hudRoot.querySelector('button') as HTMLButtonElement;
      expect(homeBtn.style.position).toBe('absolute');
      expect(homeBtn.style.top).toBe('0.8rem');
      expect(homeBtn.style.left).toBe('1rem');
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
});
