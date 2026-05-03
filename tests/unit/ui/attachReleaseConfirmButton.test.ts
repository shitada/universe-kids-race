// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { attachReleaseConfirmButton } from '../../../src/ui/attachReleaseConfirmButton';

function createPointerEvent(type: string, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, { bubbles: true, ...init });
}

describe('attachReleaseConfirmButton', () => {
  let button: HTMLButtonElement;

  beforeEach(() => {
    button = document.createElement('button');
    document.body.appendChild(button);
  });

  afterEach(() => {
    button.remove();
    document.body.innerHTML = '';
  });

  it('activates only when the pointer is released on the same element', () => {
    const onActivate = vi.fn();
    attachReleaseConfirmButton(button, { onActivate });

    button.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 20 }));
    expect(onActivate).not.toHaveBeenCalled();

    button.dispatchEvent(createPointerEvent('pointerup', { clientX: 10, clientY: 20 }));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('cancels activation after moving beyond the configured tolerance', () => {
    const onActivate = vi.fn();
    const onPressChange = vi.fn();
    attachReleaseConfirmButton(button, {
      onActivate,
      onPressChange,
      moveTolerancePx: 12,
    });

    button.dispatchEvent(createPointerEvent('pointerdown', { clientX: 10, clientY: 10 }));
    document.dispatchEvent(createPointerEvent('pointermove', { clientX: 23, clientY: 10 }));
    button.dispatchEvent(createPointerEvent('pointerup', { clientX: 23, clientY: 10 }));

    expect(onActivate).not.toHaveBeenCalled();
    expect(onPressChange).toHaveBeenLastCalledWith(false);
  });

  it('falls back to the legacy release-confirm behavior when coordinates are unavailable', () => {
    const onActivate = vi.fn();
    attachReleaseConfirmButton(button, {
      onActivate,
      moveTolerancePx: 12,
    });

    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    button.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('removes document listeners when cleaned up during an active pointer press', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const cleanup = attachReleaseConfirmButton(button, {
      onActivate: vi.fn(),
      moveTolerancePx: 12,
    });

    button.dispatchEvent(createPointerEvent('pointerdown', { clientX: 1, clientY: 1 }));
    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function), true);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function), true);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function), true);
  });
});
