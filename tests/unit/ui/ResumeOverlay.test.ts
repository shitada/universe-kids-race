// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ResumeOverlay } from '../../../src/ui/ResumeOverlay';

function getOverlay(): HTMLElement | null {
  return document.querySelector('[data-resume-overlay]');
}

describe('ResumeOverlay', () => {
  let overlay: ResumeOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new ResumeOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('is hidden by default', () => {
    expect(overlay.isVisible()).toBe(false);
    expect(getOverlay()).toBeNull();
  });

  it('show() attaches DOM into #ui-overlay and does not call onResume yet', () => {
    const onResume = vi.fn();
    overlay.show(onResume);

    expect(overlay.isVisible()).toBe(true);
    const el = getOverlay();
    expect(el).not.toBeNull();
    expect(el?.parentElement?.id).toBe('ui-overlay');
    expect(el?.textContent ?? '').toContain('またあそぼう');
    expect(onResume).not.toHaveBeenCalled();
  });

  it('falls back to body when #ui-overlay is missing', () => {
    document.body.innerHTML = '';
    overlay.show(() => {});
    expect(getOverlay()?.parentElement).toBe(document.body);
  });

  it('tap (pointerdown) calls onResume exactly once and removes the overlay', () => {
    const onResume = vi.fn();
    overlay.show(onResume);

    const el = getOverlay() as HTMLElement;
    el.dispatchEvent(new Event('pointerdown', { cancelable: true, bubbles: true }));

    expect(onResume).toHaveBeenCalledTimes(1);
    expect(overlay.isVisible()).toBe(false);
    expect(getOverlay()).toBeNull();
  });

  it('subsequent click after pointerdown does not double-fire onResume', () => {
    const onResume = vi.fn();
    overlay.show(onResume);

    const el = getOverlay() as HTMLElement;
    el.dispatchEvent(new Event('pointerdown', { cancelable: true, bubbles: true }));
    // Simulate a follow-up click that some browsers also dispatch; the overlay
    // is already removed, so this is a no-op.
    el.dispatchEvent(new Event('click', { cancelable: true, bubbles: true }));

    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('repeated show() does not stack overlays; latest onResume wins', () => {
    const first = vi.fn();
    const second = vi.fn();
    overlay.show(first);
    overlay.show(second);

    expect(document.querySelectorAll('[data-resume-overlay]').length).toBe(1);

    const el = getOverlay() as HTMLElement;
    el.dispatchEvent(new Event('pointerdown', { cancelable: true, bubbles: true }));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('hide() removes DOM without invoking onResume', () => {
    const onResume = vi.fn();
    overlay.show(onResume);
    overlay.hide();

    expect(getOverlay()).toBeNull();
    expect(onResume).not.toHaveBeenCalled();
  });

  it('dispose() is safe to call multiple times', () => {
    overlay.show(() => {});
    overlay.dispose();
    overlay.dispose();
    expect(getOverlay()).toBeNull();
  });

  it('exposes role=button and aria-label for accessibility', () => {
    overlay.show(() => {});
    const el = getOverlay() as HTMLElement;
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('aria-label')).toContain('タップ');
  });
});
