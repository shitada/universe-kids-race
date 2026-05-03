// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputSystem } from '../../../src/game/systems/InputSystem';

function setCanvasLayout(
  canvas: HTMLCanvasElement,
  { width, left = 0 }: { width: number; left?: number },
): void {
  Object.defineProperty(canvas, 'clientWidth', { configurable: true, value: width });
  canvas.getBoundingClientRect = vi.fn(() => ({
    left,
    width,
    right: left + width,
    top: 0,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON: () => ({}),
  })) as typeof canvas.getBoundingClientRect;
}

function createCanvas(options: { width?: number; left?: number } = {}): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  setCanvasLayout(canvas, { width: options.width ?? 1024, left: options.left ?? 0 });
  document.body.appendChild(canvas);
  return canvas;
}

function keyDown(key: string, opts?: KeyboardEventInit): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...opts }));
}

function keyUp(key: string, opts?: KeyboardEventInit): void {
  window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, ...opts }));
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

function windowPointerUp(pointerId = 1): void {
  window.dispatchEvent(
    new PointerEvent('pointerup', { pointerId, bubbles: true }),
  );
}

function documentPointerCancel(pointerId = 1): void {
  document.dispatchEvent(
    new PointerEvent('pointercancel', { pointerId, bubbles: true }),
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

  it.each([
    { key: ' ', label: 'space character' },
    { key: 'Spacebar', label: 'legacy Spacebar key' },
    { key: 'Unidentified', code: 'Space', label: 'Space code fallback' },
  ])('Space-compatible keydown (%s) sets boostPressed to true', ({ key, code }) => {
    keyDown(key, code ? { code } : undefined);
    expect(input.getState().boostPressed).toBe(true);
  });

  it.each([
    { key: ' ', label: 'space character' },
    { key: 'Spacebar', label: 'legacy Spacebar key' },
    { key: 'Unidentified', code: 'Space', label: 'Space code fallback' },
  ])('Space-compatible keyup (%s) resets boostPressed to false', ({ key, code }) => {
    keyDown(key, code ? { code } : undefined);
    expect(input.getState().boostPressed).toBe(true);
    keyUp(key, code ? { code } : undefined);
    expect(input.getState().boostPressed).toBe(false);
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

  it('Space keyup clears boost without affecting ArrowRight movement', () => {
    keyDown('ArrowRight');
    keyDown(' ');
    expect(input.getState()).toEqual({ moveDirection: 1, boostPressed: true });
    keyUp(' ');
    expect(input.getState()).toEqual({ moveDirection: 1, boostPressed: false });
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

  it('pointerdown in center dead zone does not move until pointer leaves center', () => {
    pointerDown(canvas, 512);
    expect(input.getState().moveDirection).toBe(0);

    pointerMove(canvas, 500);
    expect(input.getState().moveDirection).toBe(0);

    pointerMove(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);

    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('uses the canvas center instead of the viewport center when canvas has a left offset', () => {
    input.dispose();
    canvas.remove();

    input = new InputSystem();
    canvas = createCanvas({ width: 1000, left: 200 });
    input.setup(canvas);

    pointerDown(canvas, 300);
    expect(input.getState().moveDirection).toBe(-1);

    pointerMove(canvas, 1100);
    expect(input.getState().moveDirection).toBe(1);
  });

  it('center-start pointer can resolve to right on pointermove', () => {
    pointerDown(canvas, 512);
    expect(input.getState().moveDirection).toBe(0);

    pointerMove(canvas, 900);
    expect(input.getState().moveDirection).toBe(1);
  });

  it('pointerup after center dead zone tap keeps moveDirection at 0', () => {
    pointerDown(canvas, 512);
    expect(input.getState().moveDirection).toBe(0);

    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);

    pointerMove(canvas, 100);
    expect(input.getState().moveDirection).toBe(0);
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
    // pointer events with width 0 must not crash or change direction
    zeroCanvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, pointerId: 1, bubbles: true }));
    const before = input.getState().moveDirection;
    zeroCanvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(before);
    zeroCanvas.remove();
  });
});

describe('InputSystem — passive pointermove & cached width', () => {
  it('registers pointermove with { passive: true } and removes it with the same options', () => {
    const canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 800 });
    const addSpy: Array<{ type: string; options: unknown }> = [];
    const removeSpy: Array<{ type: string; options: unknown }> = [];
    const origAdd = canvas.addEventListener.bind(canvas);
    const origRemove = canvas.removeEventListener.bind(canvas);
    canvas.addEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions,
    ) => {
      addSpy.push({ type, options });
      return origAdd(type, listener, options);
    }) as typeof canvas.addEventListener;
    canvas.removeEventListener = ((
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions,
    ) => {
      removeSpy.push({ type, options });
      return origRemove(type, listener, options);
    }) as typeof canvas.removeEventListener;

    const input = new InputSystem();
    input.setup(canvas);
    const moveAdd = addSpy.find((e) => e.type === 'pointermove');
    expect(moveAdd).toBeDefined();
    expect(moveAdd!.options).toEqual({ passive: true });

    // Other pointer listeners must remain non-passive (default — no options arg).
    const downAdd = addSpy.find((e) => e.type === 'pointerdown');
    expect(downAdd).toBeDefined();
    expect(downAdd!.options).toBeUndefined();

    input.dispose();
    const moveRemove = removeSpy.find((e) => e.type === 'pointermove');
    expect(moveRemove).toBeDefined();
    expect(moveRemove!.options).toEqual({ passive: true });
  });

  it('sideOf() uses the cached width from notifyResize() instead of clientWidth', () => {
    const canvas = document.createElement('canvas');
    // Initial DOM width 1000 → half=500, deadZone=20 → clientX=600 is right.
    setCanvasLayout(canvas, { width: 1000, left: 0 });
    document.body.appendChild(canvas);
    const input = new InputSystem();
    input.setup(canvas);

    // Now mutate the DOM metrics in a way notifyResize would NOT see, and also
    // call notifyResize with different left/width values to prove sideOf trusts
    // the cached values rather than re-reading layout on pointer events.
    setCanvasLayout(canvas, { width: 200, left: 10 });
    input.notifyResize(400, 2000); // localX=200 → left side of cached canvas

    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 600, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(-1);

    // Update the cache again — boundary moves back so clientX=950 becomes right.
    input.notifyResize(200, 800); // localX=750 → right side of cached canvas
    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 950, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(1);

    input.dispose();
    canvas.remove();
  });

  it('notifyResize updates the cached canvas left and width together', () => {
    const canvas = document.createElement('canvas');
    setCanvasLayout(canvas, { width: 1000, left: 0 });
    document.body.appendChild(canvas);
    const input = new InputSystem();
    input.setup(canvas);

    input.notifyResize(200, 1000);
    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 700, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(0);

    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 1100, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(1);

    input.dispose();
    canvas.remove();
  });

  it('notifyResize ignores non-positive widths (defensive)', () => {
    const canvas = document.createElement('canvas');
    setCanvasLayout(canvas, { width: 1000, left: 0 });
    document.body.appendChild(canvas);
    const input = new InputSystem();
    input.setup(canvas);

    input.notifyResize(200, 0);
    input.notifyResize(200, -50);
    // Cached left/width should remain the original metrics; clientX=700 stays right.
    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 700, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(1);

    input.dispose();
    canvas.remove();
  });

  it('center dead zone stays canvas-relative after a left-offset resize', () => {
    const canvas = document.createElement('canvas');
    setCanvasLayout(canvas, { width: 1000, left: 0 });
    document.body.appendChild(canvas);
    const input = new InputSystem();
    input.setup(canvas);

    input.notifyResize(200, 1000);
    canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 700, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(0);

    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 685, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(0);

    canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 650, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(-1);

    input.dispose();
    canvas.remove();
  });
});

describe('InputSystem — focus/visibility reset', () => {
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
    // restore visibility default
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  });

  it('window blur clears pressedKeys and resets moveDirection to 0', () => {
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(-1);
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().moveDirection).toBe(0);
    // Subsequent keyup should not produce side effects
    keyUp('ArrowLeft');
    expect(input.getState().moveDirection).toBe(0);
  });

  it('visibilitychange (hidden=true) clears activePointers and resets moveDirection', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState().moveDirection).toBe(0);
    // After reset, pointerup for the same id must be a no-op (no negative side effects)
    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('visibilitychange (hidden=false) does NOT reset inputs', () => {
    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(1);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState().moveDirection).toBe(1);
  });

  it('pagehide clears inputs (iOS Safari background fallback)', () => {
    keyDown('ArrowLeft');
    expect(input.getState().moveDirection).toBe(-1);
    window.dispatchEvent(new Event('pagehide'));
    expect(input.getState().moveDirection).toBe(0);
  });

  it('blur also resets boostPressed to false', () => {
    keyDown(' ');
    expect(input.getState().boostPressed).toBe(true);
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().boostPressed).toBe(false);
  });

  it('Space keyup stays cleared before and after blur / visibility resets', () => {
    keyDown(' ');
    keyUp(' ');
    expect(input.getState().boostPressed).toBe(false);

    window.dispatchEvent(new Event('blur'));
    expect(input.getState().boostPressed).toBe(false);

    keyDown('Spacebar');
    keyUp('Spacebar');
    expect(input.getState().boostPressed).toBe(false);

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState().boostPressed).toBe(false);
  });

  it('after reset, new keypress still updates moveDirection (listeners not removed)', () => {
    keyDown('ArrowLeft');
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().moveDirection).toBe(0);
    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(1);
  });

  it('dispose() removes blur/visibilitychange/pagehide listeners (no side effects after dispose)', () => {
    input.dispose();
    expect(() => {
      window.dispatchEvent(new Event('blur'));
      window.dispatchEvent(new Event('pagehide'));
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
    }).not.toThrow();
    expect(input.getState().moveDirection).toBe(0);
    expect(input.getState().boostPressed).toBe(false);
  });

  it('repeated setup→dispose cycles do not leak listeners', () => {
    input.dispose();
    for (let i = 0; i < 5; i++) {
      const c = createCanvas();
      const sys = new InputSystem();
      sys.setup(c);
      window.dispatchEvent(new Event('blur'));
      expect(sys.getState().moveDirection).toBe(0);
      sys.dispose();
      c.remove();
    }
    // Reinitialize for afterEach to dispose cleanly
    input = new InputSystem();
    canvas = createCanvas();
    input.setup(canvas);
  });
});

describe('InputSystem — pointer capture', () => {
  let input: InputSystem;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    input = new InputSystem();
    canvas = createCanvas();
    // Provide setPointerCapture stub (jsdom does not implement it)
    canvas.setPointerCapture = canvas.setPointerCapture ?? (() => {});
    input.setup(canvas);
  });

  afterEach(() => {
    input.dispose();
    canvas.remove();
  });

  it('calls setPointerCapture on pointerdown', () => {
    const captured: number[] = [];
    canvas.setPointerCapture = (id: number) => { captured.push(id); };
    pointerDown(canvas, 100, 42);
    expect(captured).toContain(42);
  });

  it('lostpointercapture cleans up ghost pointer', () => {
    pointerDown(canvas, 900, 10);
    expect(input.getState().moveDirection).toBe(1);
    // Simulate capture loss without pointerup
    canvas.dispatchEvent(
      new PointerEvent('lostpointercapture', { pointerId: 10, bubbles: true }),
    );
    expect(input.getState().moveDirection).toBe(0);
  });

  it('lostpointercapture for unknown pointer is a no-op', () => {
    pointerDown(canvas, 100, 1);
    expect(input.getState().moveDirection).toBe(-1);
    // lostpointercapture for a different pointer ID — should not affect state
    canvas.dispatchEvent(
      new PointerEvent('lostpointercapture', { pointerId: 999, bubbles: true }),
    );
    expect(input.getState().moveDirection).toBe(-1);
  });

  it('window pointerup clears a tracked pointer that ended outside the canvas', () => {
    pointerDown(canvas, 900, 7);
    expect(input.getState().moveDirection).toBe(1);

    windowPointerUp(7);

    expect(input.getState().moveDirection).toBe(0);
  });

  it('document pointercancel clears a tracked pointer that was intercepted by an overlay', () => {
    pointerDown(canvas, 100, 8);
    expect(input.getState().moveDirection).toBe(-1);

    documentPointerCancel(8);

    expect(input.getState().moveDirection).toBe(0);
  });
});

describe('InputSystem — resetPointers', () => {
  let input: InputSystem;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    input = new InputSystem();
    canvas = createCanvas();
    canvas.setPointerCapture = canvas.setPointerCapture ?? (() => {});
    input.setup(canvas);
  });

  afterEach(() => {
    input.dispose();
    canvas.remove();
  });

  it('clears active pointers and resets moveDirection', () => {
    pointerDown(canvas, 900, 1);
    expect(input.getState().moveDirection).toBe(1);
    input.resetPointers();
    expect(input.getState().moveDirection).toBe(0);
  });

  it('does not clear keyboard state', () => {
    keyDown('ArrowLeft');
    pointerDown(canvas, 900, 1);
    // left + right → 0
    expect(input.getState().moveDirection).toBe(0);
    // resetPointers clears only pointers; ArrowLeft key remains
    input.resetPointers();
    expect(input.getState().moveDirection).toBe(-1);
  });

  it('subsequent pointerup after resetPointers is a no-op', () => {
    pointerDown(canvas, 900, 1);
    input.resetPointers();
    expect(input.getState().moveDirection).toBe(0);
    pointerUp(canvas, 1);
    expect(input.getState().moveDirection).toBe(0);
  });
});
