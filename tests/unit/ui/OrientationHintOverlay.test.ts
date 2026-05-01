// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { OrientationHintOverlay } from '../../../src/ui/OrientationHintOverlay';

function getOverlay(): HTMLElement | null {
  return document.querySelector('[data-orientation-hint-overlay]');
}

describe('OrientationHintOverlay', () => {
  let overlay: OrientationHintOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new OrientationHintOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('is hidden by default', () => {
    expect(overlay.isVisible()).toBe(false);
    expect(getOverlay()).toBeNull();
  });

  it('show() attaches DOM into #ui-overlay with role=dialog and aria-live', () => {
    overlay.show();

    expect(overlay.isVisible()).toBe(true);
    const el = getOverlay();
    expect(el).not.toBeNull();
    expect(el?.parentElement?.id).toBe('ui-overlay');
    expect(el?.getAttribute('role')).toBe('dialog');
    expect(el?.getAttribute('aria-live')).toBe('polite');
    expect(el?.getAttribute('aria-label')).toContain('よこむき');
    expect(el?.textContent ?? '').toContain('よこむきにしてね');
  });

  it('falls back to body when #ui-overlay is missing', () => {
    document.body.innerHTML = '';
    overlay.show();
    expect(getOverlay()?.parentElement).toBe(document.body);
  });

  it('repeated show() does not stack overlays', () => {
    overlay.show();
    overlay.show();
    overlay.show();
    expect(document.querySelectorAll('[data-orientation-hint-overlay]').length).toBe(1);
  });

  it('hide() removes the DOM', () => {
    overlay.show();
    overlay.hide();
    expect(overlay.isVisible()).toBe(false);
    expect(getOverlay()).toBeNull();
  });

  it('hide() before show() is a safe no-op', () => {
    expect(() => overlay.hide()).not.toThrow();
    expect(getOverlay()).toBeNull();
  });

  it('dispose() is safe to call multiple times', () => {
    overlay.show();
    overlay.dispose();
    overlay.dispose();
    expect(getOverlay()).toBeNull();
  });

  it('blocks pointer events from reaching the canvas behind it', () => {
    overlay.show();
    const el = getOverlay() as HTMLElement;
    expect(el.style.pointerEvents).toBe('auto');
    expect(parseInt(el.style.zIndex, 10)).toBeGreaterThan(0);
  });

  it('injects the rotate keyframes only once across multiple show/hide cycles', () => {
    overlay.show();
    overlay.hide();
    overlay.show();
    overlay.hide();
    expect(document.querySelectorAll('#orientation-hint-overlay-keyframes').length).toBe(1);
  });
});
