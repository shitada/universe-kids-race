// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContextLossOverlay } from '../../../src/ui/ContextLossOverlay';

describe('ContextLossOverlay', () => {
  let overlay: ContextLossOverlay;

  beforeEach(() => {
    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    overlay = new ContextLossOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.getElementById('ui-overlay')?.remove();
  });

  it('show() inserts overlay into #ui-overlay', () => {
    overlay.show(() => {});
    const el = document.querySelector('[data-context-loss-overlay]');
    expect(el).not.toBeNull();
    expect(overlay.isVisible()).toBe(true);
  });

  it('show() is idempotent', () => {
    overlay.show(() => {});
    overlay.show(() => {});
    expect(document.querySelectorAll('[data-context-loss-overlay]').length).toBe(1);
  });

  it('renders reload button with rocket emoji', () => {
    overlay.show(() => {});
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]');
    expect(btn).not.toBeNull();
    expect(btn!.textContent).toContain('もういちど');
    expect(btn!.textContent).toContain('🚀');
  });

  it('uses Zen Maru Gothic font on title and button', () => {
    overlay.show(() => {});
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    expect(btn.style.fontFamily).toContain('Zen Maru Gothic');
  });

  it('reload button meets 88x88 minimum tap target', () => {
    overlay.show(() => {});
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    expect(btn.style.minWidth).toBe('88px');
    expect(btn.style.minHeight).toBe('88px');
  });

  it('uses dark navy background and yellow heading color', () => {
    overlay.show(() => {});
    const root = document.querySelector<HTMLDivElement>('[data-context-loss-overlay]')!;
    expect(root.style.background).toContain('rgba(0, 0, 32');
    const heading = root.firstElementChild as HTMLElement;
    expect(heading.style.color).toMatch(/#FFD700|rgb\(255,\s*215,\s*0\)/i);
  });

  it('button pointerdown invokes onReload exactly once', () => {
    const onReload = vi.fn();
    overlay.show(onReload);
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('pointerdown stops propagation to parent listeners', () => {
    const onReload = vi.fn();
    const parentHandler = vi.fn();
    document.body.addEventListener('pointerdown', parentHandler);
    try {
      overlay.show(onReload);
      const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
      btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
      expect(onReload).toHaveBeenCalledTimes(1);
      expect(parentHandler).not.toHaveBeenCalled();
    } finally {
      document.body.removeEventListener('pointerdown', parentHandler);
    }
  });

  it('repeated pointerdown does not invoke onReload more than once', () => {
    const onReload = vi.fn();
    overlay.show(onReload);
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('applies pressed scale on pointerdown and restores on pointerup', () => {
    overlay.show(() => {});
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(btn.style.transform).toBe('scale(0.9)');
    btn.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(btn.style.transform).toBe('scale(1)');
  });

  it('reload button uses touch-action: manipulation', () => {
    overlay.show(() => {});
    const btn = document.querySelector<HTMLButtonElement>('[data-context-loss-reload]')!;
    expect(btn.style.touchAction).toBe('manipulation');
  });

  it('hide() removes overlay from DOM', () => {
    overlay.show(() => {});
    overlay.hide();
    expect(document.querySelector('[data-context-loss-overlay]')).toBeNull();
    expect(overlay.isVisible()).toBe(false);
  });

  it('hide() is safe when not shown', () => {
    expect(() => overlay.hide()).not.toThrow();
  });
});
