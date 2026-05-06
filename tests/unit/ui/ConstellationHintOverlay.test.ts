// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getConstellationForStage } from '../../../src/game/config/ConstellationData';
import { ConstellationHintOverlay } from '../../../src/ui/ConstellationHintOverlay';

function getOverlayRoot(): HTMLDivElement | null {
  return document.querySelector('[data-constellation-hint-overlay]');
}

function getPointer(): HTMLDivElement | null {
  return document.querySelector('[data-constellation-pointer]');
}

describe('ConstellationHintOverlay', () => {
  let overlay: ConstellationHintOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true, writable: true });
    overlay = new ConstellationHintOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('shows a child-friendly minimap guide with the next star highlighted', () => {
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    overlay.showGuide(definition, 1);
    overlay.updateTargetScreenPosition({ x: 220, y: 320, visible: true });

    const root = getOverlayRoot();
    const pointer = getPointer();
    expect(root).not.toBeNull();
    expect(root?.parentElement?.id).toBe('ui-overlay');
    expect(root?.getAttribute('aria-live')).toBe('polite');
    expect(root?.textContent).toContain('つぎは ここだよ');
    expect(root?.textContent).toContain('あと3こ');
    expect(root?.style.top).toBe('0.75rem');
    expect(root?.style.maxWidth).not.toContain('env(');
    expect(root?.style.pointerEvents).toBe('none');
    expect(root?.querySelectorAll('[data-constellation-star="collected"]').length).toBe(1);
    expect(root?.querySelector('[data-constellation-next-star]')).not.toBeNull();
    expect(pointer?.style.display).toBe('flex');
    expect(pointer?.style.left).not.toBe('');
    expect(pointer?.style.top).not.toBe('');
  });

  it('switches to high contrast colors and disables animation for reduced motion', () => {
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    overlay.setHighContrastMode(true);
    overlay.setMotionSensitivity('minimal');
    overlay.showGuide(definition, 0);
    overlay.updateTargetScreenPosition({ x: -30, y: 240, visible: false });

    const root = getOverlayRoot();
    const pointer = getPointer();
    expect(root?.style.getPropertyValue('--constellation-card-bg')).toContain('255');
    expect(root?.style.getPropertyValue('--constellation-pulse-animation')).toBe('none');
    expect(root?.querySelector('[data-constellation-status]')?.getAttribute('style')).toContain('2px solid');
    expect(pointer?.style.animation).toBe('none');
    expect(Number.parseFloat(pointer?.style.left ?? '0')).toBeGreaterThanOrEqual(28);
  });

  it('auto-hides the celebration after its timer finishes', () => {
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    overlay.showGuide(definition, definition.points.length);
    overlay.showCelebration(`✨ ${definition.name} かんせい！`);
    expect(overlay.getMessage()).toContain(definition.name);

    overlay.tick(3.7);

    expect(overlay.getMessage()).toBeNull();
    expect(getOverlayRoot()?.style.display).toBe('none');
    expect(getPointer()?.style.display).toBe('none');
  });
});
