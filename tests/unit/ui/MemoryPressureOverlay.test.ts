// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryPressureOverlay } from '../../../src/ui/MemoryPressureOverlay';

describe('MemoryPressureOverlay', () => {
  let overlay: MemoryPressureOverlay;

  beforeEach(() => {
    document.body.innerHTML = '<div id="ui-overlay"></div>';
    overlay = new MemoryPressureOverlay();
  });

  afterEach(() => {
    overlay.dispose();
    document.body.innerHTML = '';
  });

  it('shows a child-friendly rest message and restart button', () => {
    overlay.show({ onReload: () => {} });

    const root = document.querySelector<HTMLElement>('[data-memory-pressure-overlay]');
    const button = document.querySelector<HTMLButtonElement>('[data-memory-pressure-reload]');

    expect(root).not.toBeNull();
    expect(root?.textContent).toContain('ちょっと やすもう');
    expect(root?.textContent).toContain('⭐');
    expect(button?.textContent).toContain('あたらしく はじめよう');
    expect(button?.style.minWidth).toBe('88px');
    expect(button?.style.minHeight).toBe('88px');
  });

  it('invokes onReload only once on repeated taps', () => {
    const onReload = vi.fn();
    overlay.show({ onReload });

    const button = document.querySelector<HTMLButtonElement>('[data-memory-pressure-reload]')!;
    button.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    button.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));

    expect(onReload).toHaveBeenCalledTimes(1);
  });

  it('dispose removes the overlay safely', () => {
    overlay.show({ onReload: () => {} });

    overlay.dispose();
    overlay.dispose();

    expect(document.querySelector('[data-memory-pressure-overlay]')).toBeNull();
    expect(overlay.isVisible()).toBe(false);
  });
});
