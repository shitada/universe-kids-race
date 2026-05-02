// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { ScorePopupManager } from '../../../src/ui/ScorePopupManager';

describe('ScorePopupManager', () => {
  let manager: ScorePopupManager;
  let camera: THREE.PerspectiveCamera;

  beforeEach(() => {
    vi.useFakeTimers();
    const overlay = document.createElement('div');
    overlay.id = 'ui-overlay';
    document.body.appendChild(overlay);
    manager = new ScorePopupManager();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    Object.defineProperty(overlay, 'clientWidth', { value: 1024, configurable: true });
    Object.defineProperty(overlay, 'clientHeight', { value: 768, configurable: true });
  });

  afterEach(() => {
    manager.dispose();
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('shows a popup and cleans it up after the fallback timeout', () => {
    manager.show(100, { x: 0, y: 0, z: 0 }, camera);

    const popup = document.querySelector<HTMLElement>('[data-score-popup]');
    expect(popup).not.toBeNull();
    expect(popup?.textContent).toBe('+100');
    expect(popup?.style.visibility).toBe('visible');
    expect(popup?.hasAttribute('data-score-popup-active')).toBe(true);

    vi.advanceTimersByTime(720);

    expect(popup?.style.visibility).toBe('hidden');
    expect(popup?.hasAttribute('data-score-popup-active')).toBe(false);
  });

  it('reuses a fixed-size DOM pool', () => {
    for (let i = 0; i < 10; i++) {
      manager.show(100, { x: i * 0.05, y: 0, z: 0 }, camera);
    }

    expect(document.querySelectorAll('[data-score-popup]').length).toBe(6);
  });

  it('does nothing when ui-overlay is missing', () => {
    document.getElementById('ui-overlay')?.remove();

    expect(() => manager.show(500, { x: 0, y: 0, z: 0 }, camera)).not.toThrow();
    expect(document.querySelector('[data-score-popup-root]')).toBeNull();
  });
});
