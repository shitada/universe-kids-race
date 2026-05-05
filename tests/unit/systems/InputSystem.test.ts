// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputSystem } from '../../../src/game/systems/InputSystem';
import type { TouchFeedbackOverlay } from '../../../src/ui/TouchFeedbackOverlay';

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

describe('InputSystem — touch-only input', () => {
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

    keyDown('ArrowRight');
    expect(input.getState().moveDirection).toBe(0);

    keyUp('ArrowLeft');
    expect(input.getState().moveDirection).toBe(1);
    keyUp('ArrowRight');
    expect(input.getState().moveDirection).toBe(0);
  });

  it.each([
    { key: ' ', label: 'space character' },
    { key: 'Spacebar', label: 'legacy Spacebar key' },
    { key: 'Unidentified', code: 'Space', label: 'Space code fallback' },
  ])('boost key sets boostPressed: %s', ({ key, code }) => {
    keyDown(key, code ? { code } : undefined);
    expect(input.getState().boostPressed).toBe(true);

    keyUp(key, code ? { code } : undefined);
    expect(input.getState().boostPressed).toBe(false);
  });

  it('setBoostPressed updates boostPressed directly for HUD-driven boost input', () => {
    input.setBoostPressed(true);
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: true });

    input.setBoostPressed(false);
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: false });
  });

  it('dispose() stops keyboard events from changing state', () => {
    input.dispose();
    keyDown('ArrowLeft');
    keyDown(' ');
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: false });
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
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 512);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 525);
    expect(input.getState().moveDirection).toBe(-1);
    pointerMove(canvas, 495);
    expect(input.getState().moveDirection).toBe(-1);
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
    pointerDown(canvas, 100, 1);
    pointerDown(canvas, 900, 2);
    expect(input.getState().moveDirection).toBe(0);
    pointerMove(canvas, 800, 1);
    expect(input.getState().moveDirection).toBe(1);
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

  it('pointermove ignored when canvas clientWidth is 0', () => {
    input.dispose();
    const zeroCanvas = document.createElement('canvas');
    Object.defineProperty(zeroCanvas, 'clientWidth', { value: 0 });
    document.body.appendChild(zeroCanvas);
    input = new InputSystem();
    input.setup(zeroCanvas);
    zeroCanvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, pointerId: 1, bubbles: true }));
    const before = input.getState().moveDirection;
    zeroCanvas.dispatchEvent(new PointerEvent('pointermove', { clientX: 100, pointerId: 1, bubbles: true }));
    expect(input.getState().moveDirection).toBe(before);
    zeroCanvas.remove();
  });
});

describe('InputSystem — touch feedback integration', () => {
  let input: InputSystem;
  let canvas: HTMLCanvasElement;
  let overlay: {
    showGameplayTouch: ReturnType<typeof vi.fn>;
    moveGameplayTouch: ReturnType<typeof vi.fn>;
    releaseGameplayTouch: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    input = new InputSystem();
    canvas = createCanvas();
    input.setup(canvas);
    overlay = {
      showGameplayTouch: vi.fn(),
      moveGameplayTouch: vi.fn(),
      releaseGameplayTouch: vi.fn(),
    };
    input.setTouchFeedbackOverlay(overlay as unknown as TouchFeedbackOverlay);
  });

  afterEach(() => {
    input.dispose();
    canvas.remove();
  });

  it('reports immediate gameplay feedback on pointerdown and pointerup', () => {
    pointerDown(canvas, 120, 7);

    expect(overlay.showGameplayTouch).toHaveBeenCalledWith(7, 120, 0, 'left');

    pointerUp(canvas, 7);
    expect(overlay.releaseGameplayTouch).toHaveBeenCalledWith(7);
  });

  it('reports center-start feedback and later side resolution on pointermove', () => {
    pointerDown(canvas, 512, 9);
    expect(overlay.showGameplayTouch).toHaveBeenCalledWith(9, 512, 0, 'center');

    pointerMove(canvas, 860, 9);
    expect(overlay.moveGameplayTouch).toHaveBeenCalledWith(9, 860, 0, 'right');
  });

  it('releases tracked feedback when resetPointers() clears ghost touches', () => {
    pointerDown(canvas, 900, 21);
    expect(input.getState().moveDirection).toBe(1);

    input.resetPointers();

    expect(overlay.releaseGameplayTouch).toHaveBeenCalledWith(21);
    expect(input.getState().moveDirection).toBe(0);
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
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  });

  it('window blur clears active pointers and resets moveDirection to 0', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().moveDirection).toBe(0);
    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('visibilitychange (hidden=true) clears activePointers and resets moveDirection', () => {
    pointerDown(canvas, 100);
    expect(input.getState().moveDirection).toBe(-1);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState().moveDirection).toBe(0);
    pointerUp(canvas);
    expect(input.getState().moveDirection).toBe(0);
  });

  it('visibilitychange (hidden=false) does NOT reset inputs', () => {
    pointerDown(canvas, 900);
    expect(input.getState().moveDirection).toBe(1);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState().moveDirection).toBe(1);
  });

  it('pagehide clears inputs (iOS Safari background fallback)', () => {
    pointerDown(canvas, 100);
    input.setBoostPressed(true);
    expect(input.getState()).toEqual({ moveDirection: -1, boostPressed: true });
    window.dispatchEvent(new Event('pagehide'));
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: false });
  });

  it('blur also resets boostPressed to false', () => {
    input.setBoostPressed(true);
    expect(input.getState().boostPressed).toBe(true);
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().boostPressed).toBe(false);
  });

  it('keyboard state resets on blur and visibility changes', () => {
    keyDown(' ');
    keyDown('ArrowLeft');
    expect(input.getState()).toEqual({ moveDirection: -1, boostPressed: true });

    window.dispatchEvent(new Event('blur'));
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: false });

    keyDown('Spacebar');
    keyUp('Spacebar');
    expect(input.getState().boostPressed).toBe(false);

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: false });
  });

  it('after reset, new pointer input still updates moveDirection', () => {
    pointerDown(canvas, 100);
    window.dispatchEvent(new Event('blur'));
    expect(input.getState().moveDirection).toBe(0);
    pointerDown(canvas, 900, 2);
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
    canvas.dispatchEvent(
      new PointerEvent('lostpointercapture', { pointerId: 10, bubbles: true }),
    );
    expect(input.getState().moveDirection).toBe(0);
  });

  it('lostpointercapture for unknown pointer is a no-op', () => {
    pointerDown(canvas, 100, 1);
    expect(input.getState().moveDirection).toBe(-1);
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

  it('does not clear HUD-triggered boost state', () => {
    input.setBoostPressed(true);
    pointerDown(canvas, 900, 1);

    input.resetPointers();

    expect(input.getState()).toEqual({ moveDirection: 0, boostPressed: true });
  });

  it('subsequent pointerup after resetPointers is a no-op', () => {
    pointerDown(canvas, 900, 1);
    input.resetPointers();
    expect(input.getState().moveDirection).toBe(0);
    pointerUp(canvas, 1);
    expect(input.getState().moveDirection).toBe(0);
  });
});
