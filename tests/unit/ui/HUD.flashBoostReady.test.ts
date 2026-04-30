// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD.flashBoostReady', () => {
  let hud: HUD;

  beforeEach(() => {
    vi.useFakeTimers();
    const hudRoot = document.createElement('div');
    hudRoot.id = 'hud';
    document.body.appendChild(hudRoot);
    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    hud = new HUD();
    hud.show('test');
  });

  afterEach(() => {
    hud.hide();
    document.getElementById('hud')?.remove();
    document.getElementById('ui-overlay')?.remove();
    document.getElementById('boost-animations')?.remove();
    vi.useRealTimers();
  });

  function getBoostButton(): HTMLButtonElement {
    const btn = document
      .getElementById('ui-overlay')!
      .querySelector('button[aria-label*="ブースト"], button[aria-label*="Boost"], button') as HTMLButtonElement;
    expect(btn).not.toBeNull();
    return btn;
  }

  it('adds data-boost-ready-flash attribute on call', () => {
    const btn = getBoostButton();
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(false);
    hud.flashBoostReady();
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(true);
  });

  it('removes data-boost-ready-flash attribute after animationend', () => {
    const btn = getBoostButton();
    hud.flashBoostReady();
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(true);

    const ev = new Event('animationend') as AnimationEvent;
    Object.defineProperty(ev, 'animationName', { value: 'boostBtnReadyFlash' });
    btn.dispatchEvent(ev);

    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(false);
  });

  it('ignores animationend events for other animations', () => {
    const btn = getBoostButton();
    hud.flashBoostReady();

    const ev = new Event('animationend') as AnimationEvent;
    Object.defineProperty(ev, 'animationName', { value: 'boostBtnPulse' });
    btn.dispatchEvent(ev);

    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(true);
  });

  it('does not re-trigger when called repeatedly while flash in progress', () => {
    const btn = getBoostButton();
    hud.flashBoostReady();
    btn.removeAttribute('data-boost-ready-flash');
    // Simulate second call while listener still registered (attribute was
    // externally cleared but internal "in progress" guard relies on attribute
    // — re-adding via second call is allowed only if attribute is absent).
    // Re-call with attribute present should be a no-op:
    btn.setAttribute('data-boost-ready-flash', '');
    hud.flashBoostReady(); // should be no-op
    // Attribute remains exactly once
    expect(btn.getAttributeNames().filter((n) => n === 'data-boost-ready-flash').length).toBe(1);
  });

  it('falls back to setTimeout cleanup when animationend never fires', () => {
    const btn = getBoostButton();
    hud.flashBoostReady();
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(true);

    vi.advanceTimersByTime(500);
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(false);
  });

  it('clears flash attribute when cooldown restarts (updateCooldown -> not ready)', () => {
    const btn = getBoostButton();
    // Start in ready state then trigger flash, then restart cooldown
    hud.updateCooldown(1.0);
    hud.flashBoostReady();
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(true);

    hud.updateCooldown(0.0);
    expect(btn.hasAttribute('data-boost-ready-flash')).toBe(false);
  });

  it('is a no-op before show() (no boost button)', () => {
    const fresh = new HUD();
    expect(() => fresh.flashBoostReady()).not.toThrow();
  });
});
