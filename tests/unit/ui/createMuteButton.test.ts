// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMuteButton } from '../../../src/ui/createMuteButton';

describe('createMuteButton', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('appends a <button data-mute-button> to the container', () => {
    createMuteButton({ initialMuted: false, container, onToggle: () => {} });
    const btn = container.querySelector('button[data-mute-button]');
    expect(btn).not.toBeNull();
  });

  it('renders 🔊 with "サウンド オン" aria-label when not muted', () => {
    const handle = createMuteButton({ initialMuted: false, container, onToggle: () => {} });
    expect(handle.element.textContent).toBe('🔊');
    expect(handle.element.getAttribute('aria-label')).toBe('サウンド オン');
  });

  it('renders 🔇 with "サウンド オフ" aria-label when initially muted', () => {
    const handle = createMuteButton({ initialMuted: true, container, onToggle: () => {} });
    expect(handle.element.textContent).toBe('🔇');
    expect(handle.element.getAttribute('aria-label')).toBe('サウンド オフ');
  });

  it('uses the same circular HUD styling (3rem diameter, top-right)', () => {
    const handle = createMuteButton({ initialMuted: false, container, onToggle: () => {} });
    const btn = handle.element;
    expect(btn.style.position).toBe('absolute');
    expect(btn.style.top).toBe('0.8rem');
    expect(btn.style.width).toBe('3rem');
    expect(btn.style.height).toBe('3rem');
    expect(btn.style.borderRadius).toBe('50%');
    expect(btn.style.pointerEvents).toBe('auto');
    expect(btn.style.touchAction).toBe('manipulation');
  });

  it('honours the topRem option', () => {
    const handle = createMuteButton({ initialMuted: false, container, onToggle: () => {}, topRem: 1.2 });
    expect(handle.element.style.top).toBe('1.2rem');
  });

  it('invokes onToggle on pointerdown and stops propagation', () => {
    const onToggle = vi.fn();
    const handle = createMuteButton({ initialMuted: false, container, onToggle });
    let bubbled = false;
    document.body.addEventListener('pointerdown', () => {
      bubbled = true;
    });
    handle.element.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(bubbled).toBe(false);
  });

  it('setMuted(true) flips glyph and aria-label', () => {
    const handle = createMuteButton({ initialMuted: false, container, onToggle: () => {} });
    handle.setMuted(true);
    expect(handle.element.textContent).toBe('🔇');
    expect(handle.element.getAttribute('aria-label')).toBe('サウンド オフ');
    handle.setMuted(false);
    expect(handle.element.textContent).toBe('🔊');
    expect(handle.element.getAttribute('aria-label')).toBe('サウンド オン');
  });

  it('remove() detaches the button from the DOM', () => {
    const handle = createMuteButton({ initialMuted: false, container, onToggle: () => {} });
    expect(container.querySelector('button[data-mute-button]')).not.toBeNull();
    handle.remove();
    expect(container.querySelector('button[data-mute-button]')).toBeNull();
  });
});
