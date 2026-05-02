// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HomeConfirmOverlay } from '../../../src/ui/HomeConfirmOverlay';

describe('HomeConfirmOverlay', () => {
  let overlay: HomeConfirmOverlay;

  const press = (btn: HTMLButtonElement): void => {
    btn.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  };

  const releaseOnButton = (btn: HTMLButtonElement): void => {
    btn.dispatchEvent(new Event('pointerup', { bubbles: true }));
  };

  beforeEach(() => {
    const uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    overlay = new HomeConfirmOverlay();
  });

  afterEach(() => {
    overlay.hide();
    document.getElementById('ui-overlay')?.remove();
  });

  it('show() inserts overlay into #ui-overlay with role=dialog', () => {
    overlay.show(() => {}, () => {});
    const el = document.querySelector<HTMLDivElement>('[data-home-confirm-overlay]');
    expect(el).not.toBeNull();
    expect(el!.getAttribute('role')).toBe('dialog');
    expect(el!.getAttribute('aria-label')).toContain('もどり');
    expect(overlay.isVisible()).toBe(true);
  });

  it('show() is idempotent (二重表示防止)', () => {
    overlay.show(() => {}, () => {});
    overlay.show(() => {}, () => {});
    expect(document.querySelectorAll('[data-home-confirm-overlay]').length).toBe(1);
  });

  it('🏠 button does not fire onConfirm on pointerdown alone', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    expect(backBtn).not.toBeNull();
    press(backBtn);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(backBtn.style.transform).toBe('scale(0.9)');
    expect(overlay.isVisible()).toBe(true);
  });

  it('🏠 button fires onConfirm on pointerup and hides the overlay', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    expect(backBtn).not.toBeNull();
    press(backBtn);
    releaseOnButton(backBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('✋ つづける button fires onCancel on click and hides the overlay', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const continueBtn = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    expect(continueBtn).not.toBeNull();
    continueBtn.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('background tap (on overlay root, not card) cancels', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const root = document.querySelector<HTMLDivElement>('[data-home-confirm-overlay]')!;
    const evt = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(evt, 'target', { value: root, writable: false });
    root.dispatchEvent(evt);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(false);
  });

  it('tap inside the card does not trigger background-cancel', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const card = document.querySelector<HTMLDivElement>('[data-home-confirm-card]')!;
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(true);
  });

  it('repeated taps do not invoke callbacks more than once', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    press(backBtn);
    releaseOnButton(backBtn);
    backBtn.dispatchEvent(new Event('click', { bubbles: true }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('pointerleave then release outside does not invoke callbacks', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const root = document.querySelector<HTMLDivElement>('[data-home-confirm-overlay]')!;
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    press(backBtn);
    backBtn.dispatchEvent(new Event('pointerleave', { bubbles: true }));
    root.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(backBtn.style.transform).toBe('scale(1)');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(true);
  });

  it('pointercancel clears press state and does not invoke callbacks', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    overlay.show(onConfirm, onCancel);
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    press(backBtn);
    backBtn.dispatchEvent(new Event('pointercancel', { bubbles: true }));
    backBtn.dispatchEvent(new Event('click', { bubbles: true }));
    expect(backBtn.style.transform).toBe('scale(1)');
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
    expect(overlay.isVisible()).toBe(true);
  });

  it('both buttons meet 88x88 minimum tap target', () => {
    overlay.show(() => {}, () => {});
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    const continueBtn = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    expect(backBtn.style.minWidth).toBe('88px');
    expect(backBtn.style.minHeight).toBe('88px');
    expect(continueBtn.style.minWidth).toBe('88px');
    expect(continueBtn.style.minHeight).toBe('88px');
  });

  it('uses Zen Maru Gothic font on title and buttons', () => {
    overlay.show(() => {}, () => {});
    const root = document.querySelector<HTMLDivElement>('[data-home-confirm-overlay]')!;
    const card = root.querySelector<HTMLDivElement>('[data-home-confirm-card]')!;
    const title = card.firstElementChild as HTMLElement;
    expect(title.style.fontFamily).toContain('Zen Maru Gothic');
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    expect(backBtn.style.fontFamily).toContain('Zen Maru Gothic');
  });

  it('uses dark navy background and yellow heading color', () => {
    overlay.show(() => {}, () => {});
    const root = document.querySelector<HTMLDivElement>('[data-home-confirm-overlay]')!;
    expect(root.style.background).toContain('rgba(0, 0, 32');
    const card = root.querySelector<HTMLDivElement>('[data-home-confirm-card]')!;
    const title = card.firstElementChild as HTMLElement;
    expect(title.style.color).toMatch(/#FFD700|rgb\(255,\s*215,\s*0\)/i);
  });

  it('button uses touch-action: manipulation', () => {
    overlay.show(() => {}, () => {});
    const backBtn = document.querySelector<HTMLButtonElement>('[data-home-confirm-back]')!;
    const continueBtn = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    expect(backBtn.style.touchAction).toBe('manipulation');
    expect(continueBtn.style.touchAction).toBe('manipulation');
  });

  it('hide() removes overlay from DOM', () => {
    overlay.show(() => {}, () => {});
    overlay.hide();
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
    expect(overlay.isVisible()).toBe(false);
  });

  it('hide() is safe when not shown', () => {
    expect(() => overlay.hide()).not.toThrow();
  });
});
