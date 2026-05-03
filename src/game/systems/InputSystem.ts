import type { InputState } from '../../types';

export class InputSystem {
  private state: InputState = { moveDirection: 0, boostPressed: false };
  private canvas: HTMLCanvasElement | null = null;
  private activePointers = new Map<number, 'left' | 'right'>();
  private pendingPointers = new Set<number>();
  private pressedKeys = new Set<string>();
  // Cached canvas bounds to avoid forced reflow on every pointer event
  // (Constitution III/IV: iPad Safari touch latency / 60fps). Updated via
  // notifyResize() from the main resize pipeline.
  private canvasLeft = 0;
  private canvasWidth = 0;
  // pointermove listener options. Marked passive because the handler never
  // calls preventDefault(); this lets iPad Safari run pointermove on the
  // compositor fast path. DO NOT call preventDefault() inside onPointerMove.
  private static readonly POINTERMOVE_OPTIONS: AddEventListenerOptions = { passive: true };
  private static readonly BOOST_KEYS = new Set([' ', 'Spacebar']);

  private isBoostKey(e: KeyboardEvent): boolean {
    return e.code === 'Space' || InputSystem.BOOST_KEYS.has(e.key);
  }

  private updateCanvasMetricsFromDom(): void {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : this.canvas.clientWidth;
    if (width > 0) {
      this.canvasLeft = rect.left;
      this.canvasWidth = width;
    }
  }

  private getCanvasWidth(): number {
    if (this.canvasWidth > 0) return this.canvasWidth;
    // Defensive fallback: if notifyResize was never called or width is stale,
    // re-read from the DOM (this triggers a reflow but only on the cold path).
    if (this.canvas) {
      this.updateCanvasMetricsFromDom();
      return this.canvasWidth;
    }
    return 0;
  }

  private sideOf(clientX: number): 'left' | 'right' | null {
    if (!this.canvas) return null;
    const width = this.getCanvasWidth();
    if (width <= 0) return null;
    const localX = clientX - this.canvasLeft;
    const half = width / 2;
    const deadZone = width * 0.02;
    if (Math.abs(localX - half) <= deadZone) return null;
    return localX < half ? 'left' : 'right';
  }

  private onPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    if (!this.canvas) return;
    // Capture the pointer so that pointerup always fires on the canvas even
    // when a DOM overlay (stage-clear, home-confirm, etc.) appears on top
    // while the finger is still down. Without this, the pointerup fires on
    // the overlay and this.activePointers retains a ghost entry that causes
    // permanent directional drift. Guarded because jsdom (tests) does not
    // implement setPointerCapture.
    this.canvas.setPointerCapture?.(e.pointerId);
    const side = this.sideOf(e.clientX);
    if (side === null) {
      this.pendingPointers.add(e.pointerId);
      return;
    }
    this.activePointers.set(e.pointerId, side);
    this.updateDirection();
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.canvas) return;
    const side = this.sideOf(e.clientX);
    if (this.activePointers.has(e.pointerId)) {
      if (side === null) return;
      const current = this.activePointers.get(e.pointerId);
      if (current === side) return;
      this.activePointers.set(e.pointerId, side);
      this.updateDirection();
      return;
    }
    if (!this.pendingPointers.has(e.pointerId) || side === null) return;
    this.pendingPointers.delete(e.pointerId);
    this.activePointers.set(e.pointerId, side);
    this.updateDirection();
  };

  private onPointerUp = (e: PointerEvent): void => {
    e.preventDefault();
    this.pendingPointers.delete(e.pointerId);
    this.activePointers.delete(e.pointerId);
    this.updateDirection();
  };

  private onPointerCancel = (e: PointerEvent): void => {
    this.pendingPointers.delete(e.pointerId);
    this.activePointers.delete(e.pointerId);
    this.updateDirection();
  };

  // Fallback for older WebKit versions where setPointerCapture may be lost
  // unexpectedly. If capture is lost while the pointer is still tracked,
  // clean it up so the direction doesn't stay stuck.
  private onLostPointerCapture = (e: PointerEvent): void => {
    this.pendingPointers.delete(e.pointerId);
    if (this.activePointers.has(e.pointerId)) {
      this.activePointers.delete(e.pointerId);
      this.updateDirection();
    }
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.repeat) return;
    if (this.isBoostKey(e)) {
      e.preventDefault();
      this.state.boostPressed = true;
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        this.pressedKeys.add(e.key);
        this.updateDirection();
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (this.isBoostKey(e)) {
      this.state.boostPressed = false;
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.pressedKeys.delete(e.key);
        this.updateDirection();
        break;
    }
  };

  private resetInputs(): void {
    this.activePointers.clear();
    this.pendingPointers.clear();
    this.pressedKeys.clear();
    this.state.boostPressed = false;
    this.updateDirection();
  }

  private onLoseFocus = (): void => {
    this.resetInputs();
  };

  private onVisibilityChange = (): void => {
    if (typeof document !== 'undefined' && document.hidden) {
      this.resetInputs();
    }
  };

  private updateDirection(): void {
    let left = false;
    let right = false;
    for (const side of this.activePointers.values()) {
      if (side === 'left') left = true;
      if (side === 'right') right = true;
    }
    if (this.pressedKeys.has('ArrowLeft')) left = true;
    if (this.pressedKeys.has('ArrowRight')) right = true;
    if (left && right) {
      this.state.moveDirection = 0;
    } else if (left) {
      this.state.moveDirection = -1;
    } else if (right) {
      this.state.moveDirection = 1;
    } else {
      this.state.moveDirection = 0;
    }
  }

  setup(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.updateCanvasMetricsFromDom();
    canvas.addEventListener('pointerdown', this.onPointerDown);
    // pointermove is registered passive — see POINTERMOVE_OPTIONS comment.
    canvas.addEventListener('pointermove', this.onPointerMove, InputSystem.POINTERMOVE_OPTIONS);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerCancel);
    canvas.addEventListener('pointerleave', this.onPointerUp);
    canvas.addEventListener('lostpointercapture', this.onLostPointerCapture);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onLoseFocus);
    window.addEventListener('pagehide', this.onLoseFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  getState(): InputState {
    return this.state;
  }

  setBoostPressed(pressed: boolean): void {
    this.state.boostPressed = pressed;
  }

  /**
   * Notify the InputSystem of a canvas bounds change. Called from the main
   * resize pipeline so sideOf() can avoid reading layout on every pointer
   * event (which forces layout on iPad Safari).
   */
  notifyResize(left: number, width: number): void {
    if (width > 0) {
      this.canvasLeft = left;
      this.canvasWidth = width;
    }
  }

  /**
   * Clear all active pointer state without touching keyboard state.
   * Called on stage transitions to prevent ghost pointers from surviving
   * across stages (e.g. when a DOM overlay intercepts pointerup).
   */
  resetPointers(): void {
    this.activePointers.clear();
    this.pendingPointers.clear();
    this.updateDirection();
  }

  dispose(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('pointermove', this.onPointerMove, InputSystem.POINTERMOVE_OPTIONS);
      this.canvas.removeEventListener('pointerup', this.onPointerUp);
      this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
      this.canvas.removeEventListener('pointerleave', this.onPointerUp);
      this.canvas.removeEventListener('lostpointercapture', this.onLostPointerCapture);
      this.canvas = null;
      this.canvasLeft = 0;
      this.canvasWidth = 0;
    }
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onLoseFocus);
    window.removeEventListener('pagehide', this.onLoseFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.activePointers.clear();
    this.pendingPointers.clear();
    this.pressedKeys.clear();
    this.state = { moveDirection: 0, boostPressed: false };
  }
}
