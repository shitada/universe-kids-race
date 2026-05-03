// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD aria-labels (VoiceOver support)', () => {
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

  function getHomeButton(): HTMLButtonElement | null {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return null;
    return Array.from(hudRoot.querySelectorAll('button')).find(
      (btn) => btn.textContent === '🏠'
    ) as HTMLButtonElement | null;
  }

  function getBoostButton(): HTMLButtonElement | null {
    const overlay = document.getElementById('ui-overlay');
    if (!overlay) return null;
    return Array.from(overlay.querySelectorAll('button')).find((btn) =>
      (btn.textContent ?? '').includes('ブースト')
    ) as HTMLButtonElement | null;
  }

  function getPauseButton(): HTMLButtonElement | null {
    const hudRoot = document.getElementById('hud');
    if (!hudRoot) return null;
    return Array.from(hudRoot.querySelectorAll('button')).find((btn) =>
      (btn.textContent ?? '').includes('やすむ')
    ) as HTMLButtonElement | null;
  }

  it('home button has aria-label "ホームへ もどる"', () => {
    hud.show('🌙');
    const btn = getHomeButton();
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toBe('ホームへ もどる');
  });

  it('boost button has aria-label "ブースト"', () => {
    hud.show('🌙');
    const btn = getBoostButton();
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toBe('ブースト');
  });

  it('boost button visible glyph is unchanged ("🚀 ブースト!")', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    expect(btn.textContent).toBe('🚀 ブースト!');
  });

  it('home button visible glyph is unchanged ("🏠")', () => {
    hud.show('🌙');
    const btn = getHomeButton()!;
    expect(btn.textContent).toBe('🏠');
  });

  it('pause button has aria-label "やすむ"', () => {
    hud.show('🌙');
    const btn = getPauseButton();
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('aria-label')).toBe('やすむ');
  });

  it('pause button visible text contains "やすむ"', () => {
    hud.show('🌙');
    const btn = getPauseButton()!;
    expect(btn.textContent).toContain('やすむ');
  });

  it('setPauseEnabled(false) sets aria-disabled="true" on pause button', () => {
    hud.show('🌙');
    const btn = getPauseButton()!;
    hud.setPauseEnabled(false);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    hud.setPauseEnabled(true);
    expect(btn.getAttribute('aria-disabled')).toBe('false');
  });

  it('boost button initial aria-disabled is "false"', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    expect(btn.getAttribute('aria-disabled')).toBe('false');
  });

  it('updateCooldown(0.5) sets aria-disabled="true" on boost button', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    hud.updateCooldown(0.5);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
  });

  it('updateCooldown(1.0) sets aria-disabled="false" on boost button', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    hud.updateCooldown(0.5);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    hud.updateCooldown(1.0);
    expect(btn.getAttribute('aria-disabled')).toBe('false');
  });

  it('setBoostLocked(true) sets aria-disabled="true" and unlock restores ready state', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    hud.updateCooldown(1.0);
    hud.setBoostLocked(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    hud.setBoostLocked(false);
    expect(btn.getAttribute('aria-disabled')).toBe('false');
  });

  it('setBoostLocked(true) keeps aria-disabled="true" even when cooldown is ready', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    hud.updateCooldown(0.5);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    hud.setBoostLocked(true);
    hud.updateCooldown(1.0);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    hud.setBoostLocked(false);
    expect(btn.getAttribute('aria-disabled')).toBe('false');
  });

  it('setBoostLocked(true) prevents boost callback until unlocked', () => {
    hud.show('🌙');
    const btn = getBoostButton()!;
    const onBoost = vi.fn();
    const onBoostDenied = vi.fn();
    hud.setBoostCallback(onBoost);
    hud.setBoostDeniedCallback(onBoostDenied);

    hud.setBoostLocked(true);
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onBoost).not.toHaveBeenCalled();
    expect(onBoostDenied).not.toHaveBeenCalled();

    hud.setBoostLocked(false);
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onBoost).toHaveBeenCalledTimes(1);
  });
});
