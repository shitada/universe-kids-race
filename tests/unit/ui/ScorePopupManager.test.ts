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
    expect(popup?.style.left).toBe('50%');
    expect(popup?.style.top).toBe('50%');
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

  it('restarts the animation when a pooled popup is reused', () => {
    for (let i = 0; i < 6; i++) {
      manager.show(100, { x: i * 0.05, y: 0, z: 0 }, camera);
    }

    const [popup] = Array.from(document.querySelectorAll<HTMLElement>('[data-score-popup]'));
    expect(popup).not.toBeUndefined();
    const firstAnimationName = popup.style.animationName;
    vi.advanceTimersByTime(720);
    manager.show(500, { x: 0.1, y: 0, z: 0 }, camera);

    expect(document.querySelectorAll('[data-score-popup]')).toHaveLength(6);
    expect(popup.textContent).toBe('+500');
    expect(popup.style.visibility).toBe('visible');
    expect(popup.style.animationName).not.toBe(firstAnimationName);
  });

  it('avoids layout reads when showing and replaying a popup', () => {
    const overlay = document.getElementById('ui-overlay') as HTMLDivElement;
    Object.defineProperty(overlay, 'clientWidth', {
      configurable: true,
      get: () => {
        throw new Error('clientWidth should not be read');
      },
    });
    Object.defineProperty(overlay, 'clientHeight', {
      configurable: true,
      get: () => {
        throw new Error('clientHeight should not be read');
      },
    });

    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => {
        throw new Error('offsetWidth should not be read');
      },
    });

    try {
      expect(() => manager.show(100, { x: 0, y: 0, z: 0 }, camera)).not.toThrow();
      vi.advanceTimersByTime(720);
      expect(() => manager.show(100, { x: 0, y: 0, z: 0 }, camera)).not.toThrow();
    } finally {
      if (originalOffsetWidth) {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
      }
    }
  });

  it('does nothing when ui-overlay is missing', () => {
    document.getElementById('ui-overlay')?.remove();

    expect(() => manager.show(500, { x: 0, y: 0, z: 0 }, camera)).not.toThrow();
    expect(document.querySelector('[data-score-popup-root]')).toBeNull();
  });
});
