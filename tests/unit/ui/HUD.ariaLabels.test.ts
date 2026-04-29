// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
});
