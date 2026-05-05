// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { HUD } from '../../../src/ui/HUD';

describe('HUD color accessibility mode', () => {
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
    document.body.innerHTML = '';
  });

  it('thickens contrast cues on the progress track and boost button', () => {
    hud.setHighContrastMode(true);
    hud.show('テスト', 0x00ff88);

    const track = document.querySelector('[data-stage-progress-track]') as HTMLElement | null;
    const boostButton = document.querySelector('#ui-overlay button[aria-label="ブースト"]') as HTMLButtonElement | null;
    const cooldown = document.querySelector('[data-cooldown-container]') as HTMLElement | null;

    expect(track?.style.border).toContain('3px');
    expect(boostButton?.style.border).toContain('4px');
    expect(cooldown?.style.border).toContain('2px');
  });

  it('adds a ready ring animation when boost becomes available', () => {
    hud.show('テスト');
    const boostButton = document.querySelector('#ui-overlay button[aria-label="ブースト"]') as HTMLButtonElement | null;

    hud.updateCooldown(1);

    expect(boostButton?.getAttribute('data-boost-ready-ring')).toBe('');
    expect(boostButton?.style.animation).toContain('boostReadyRing');
  });
});
