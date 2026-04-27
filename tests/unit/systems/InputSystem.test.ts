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

function pointerMove(canvas: HTMLCanvasElement, clientX: number, pointerId = 1): void {
  canvas.dispatchEvent(
    new PointerEvent('pointermove', { clientX, pointerId, bubbles: true }),
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

describe('InputSystem — pointermove tracking', () => {
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

  it('pointerdown(left) → pointermove(right half) switches moveDirection from -1 to 1', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 900);
    expect(input.getState().moveDirection).toBe(1);
  });

  it('pointerdown(right) → pointermove(left half) switches moveDirection from 1 to -1', () => {
    pointerDown(canvas, 900);
    expect(input.getState().moveDirection).toBe(1);
    pointerMove(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
  });

  it('pointermove within hysteresis dead zone keeps previous direction', () => {
    // canvas width 1024, half = 512, dead zone ±2% (±20.48px) → [491.52, 532.48]
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    // Move into the dead zone — must stay -1
    pointerMove(canvas, 512);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 525);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 495);
    expect(input.getState().moveDirection).toBe(-1);
    // Move clearly outside the dead zone
    pointerMove(canvas, 600);
    expect(input.getState().moveDirection).toBe(1);
  });

  it('two pointers: moving one across center does not affect the other', () => {
    // Pointer 1 on left, pointer 2 on right → both active → moveDirection 0
    pointerDown(canvas, 100, 1);
    pointerDown(canvas, 900, 2);
    expect(input.getState().moveDirection).toBe(0);
    // Move pointer 1 to right side; pointer 2 still right → both right → moveDirection 1
    pointerMove(canvas, 800, 1);
    expect(input.getState().moveDirection).toBe(1);
    // Move pointer 2 to left side; pointer 1 still right → mixed → 0
    pointerMove(canvas, 100, 2);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('pointermove after pointerup does not affect moveDirection', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);
    pointerMove(canvas, 900);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('pointermove + keyboard composition follows existing precedence (left+right → 0)', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    // Slide pointer to right side
    pointerMove(canvas, 900);
    expect(input.getState().moveDirection).toBe(1);
    // Hold keyboard left → mixed → 0
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(0);
    keyUp('ArrowLeft');
    expect(input.getState().moveDirection).toBe(1);
  });

  it('pointermove ignored when canvas clientWidth is 0', () => {
    // Replace canvas with one having width 0
    input.dispose();
    const zeroCanvas = document.createElement('canvas');
    Object.defineProperty(zeroCanvas, 'clientWidth', { value: 0 });
    document.body.appendChild(zeroCanvas);
    input = new InputSystem();
    input.setup(zeroCanvas);
    // pointerdown still registers (fallback) — but pointermove with width 0 must not crash and not change side
    zeroCanvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, pointerId: 1, bubbles: true }));
    const before = input.getState().moveDirection;
    zeroCanvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(before);
    zeroCanvas.remove();
  });
});
