// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD mute button', () => {
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

  function getMuteButton(): HTMLButtonElement | null {
    return document.querySelector('button[data-mute-button]') as HTMLButtonElement | null;
  }

  it('creates a mute button on show()', () => {
    hud.show('🌙');
    const btn = getMuteButton();
    expect(btn).not.toBeNull();
  });

  it('defaults to the speaker emoji (🔊) when not muted', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.textContent).toBe('🔊');
    expect(btn.getAttribute('aria-label')).toBe('サウンド オン');
  });

  it('shows the muted emoji (🔇) when initial state is muted', () => {
    hud.setMuteState(true);
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.textContent).toBe('🔇');
    expect(btn.getAttribute('aria-label')).toBe('サウンド オフ');
  });

  it('positions the button at top-right (absolute, top: 0.8rem)', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.style.position).toBe('absolute');
    expect(btn.style.top).toBe('0.8rem');
    expect(btn.style.right).toBe('1rem');
  });

  it('uses pointer-events:auto so taps reach the button', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.style.pointerEvents).toBe('auto');
    expect(btn.style.touchAction).toBe('manipulation');
  });

  it('uses the same circular styling as the home button (3rem diameter)', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.style.width).toBe('3rem');
    expect(btn.style.height).toBe('3rem');
    expect(btn.style.borderRadius).toBe('50%');
  });

  it('invokes the mute callback on pointerdown', () => {
    const cb = vi.fn();
    hud.setMuteCallback(cb);
    hud.show('🌙');
    const btn = getMuteButton()!;
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('stops pointerdown propagation so canvas input is not affected', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    let bubbledToParent = false;
    document.body.addEventListener('pointerdown', () => {
      bubbledToParent = true;
    });
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(bubbledToParent).toBe(false);
  });

  it('setMuteState() updates the visible glyph and aria-label after show()', () => {
    hud.show('🌙');
    const btn = getMuteButton()!;
    expect(btn.textContent).toBe('🔊');
    hud.setMuteState(true);
    expect(btn.textContent).toBe('🔇');
    expect(btn.getAttribute('aria-label')).toBe('サウンド オフ');
    hud.setMuteState(false);
    expect(btn.textContent).toBe('🔊');
    expect(btn.getAttribute('aria-label')).toBe('サウンド オン');
  });

  it('setMuteState() before show() persists into the rendered button', () => {
    hud.setMuteState(true);
    expect(hud.isMuted()).toBe(true);
    hud.show('🌙');
    expect(getMuteButton()!.textContent).toBe('🔇');
  });

  it('hide() removes the mute button from the DOM', () => {
    hud.show('🌙');
    expect(getMuteButton()).not.toBeNull();
    hud.hide();
    expect(getMuteButton()).toBeNull();
  });

  it('does not invoke a stale callback set before hide() is called again', () => {
    const cb = vi.fn();
    hud.setMuteCallback(cb);
    hud.show('🌙');
    hud.hide();
    // Re-show without re-registering callback should still use the existing one
    hud.show('🌙');
    getMuteButton()!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
