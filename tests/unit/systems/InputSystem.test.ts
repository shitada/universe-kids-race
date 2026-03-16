// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { InputSystem } from '../../../src/game/systems/InputSystem';

function createCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  Object.defineProperty(canvas, 'clientWidth', { value: 1024 });
  document.body.appendChild(canvas);
  return canvas;
}

function keyDown(key: string, opts?: Partial<KeyboardEvent>): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
}

function keyUp(key: string): void {
  window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

function pointerDown(canvas: HTMLCanvasElement, clientX: number, pointerId = 1): void {
  canvas.dispatchEvent(
    new PointerEvent('pointerdown', { clientX, pointerId, bubbles: true }),
  );
}

function pointerUp(canvas: HTMLCanvasElement, pointerId = 1): void {
  canvas.dispatchEvent(
    new PointerEvent('pointerup', { pointerId, bubbles: true }),
  );
}

describe('InputSystem — keyboard', () => {
  let input: InputSystem;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    input = new InputSystem();
    canvas = createCanvas();
    input.setup(canvas);
  });

  afterEach(() => {
    input.dispose();
    canvas.remove();
  });

  it('ArrowLeft keydown sets moveDirection to -1', () => {
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(-1);
  });

  it('ArrowRight keydown sets moveDirection to 1', () => {
    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(1);
  });

  it('ArrowLeft + ArrowRight simultaneous sets moveDirection to 0', () => {
    keyDown('ArrowLeft');
    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(0);
  });

  it('Space keydown sets boostPressed to true', () => {
    keyDown(' ');
    expect(input.getState().boostPressed).toBe(true);
  });

  it('ArrowLeft keyup resets moveDirection to 0', () => {
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(-1);
    keyUp('ArrowLeft');
    expect(input.getState().moveDirection).toBe(0);
  });

  it('e.repeat=true keydown is ignored', () => {
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(-1);
    keyUp('ArrowLeft');
    expect(input.getState().moveDirection).toBe(0);
    // repeat event should not re-register the key
    keyDown('ArrowLeft', { repeat: true });
    expect(input.getState().moveDirection).toBe(0);
  });

  it('dispose() stops keyboard events from being handled', () => {
    input.dispose();
    keyDown('ArrowLeft');
    // After dispose, a fresh state is created with moveDirection=0
    expect(input.getState().moveDirection).toBe(0);
  });

  it('pointer left + keyboard right merges to moveDirection 0', () => {
    // Pointer on left side (clientX < half of 1024)
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    // Add keyboard right
    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(0);
    // Release pointer, only keyboard right remains
    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(1);
  });
});
