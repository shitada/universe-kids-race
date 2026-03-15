import type { InputState } from '../../types';

export class InputSystem {
  private state: InputState = { moveDirection: 0, boostPressed: false };
  private canvas: HTMLCanvasElement | null = null;
  private activePointers = new Map<number, 'left' | 'right'>();

  private onPointerDown = (e: PointerEvent): void => {
    e.preventDefault();
    if (!this.canvas) return;
    const half = this.canvas.clientWidth / 2;
    const side = e.clientX < half ? 'left' : 'right';
    this.activePointers.set(e.pointerId, side);
    this.updateDirection();
  };

  private onPointerUp = (e: PointerEvent): void => {
    e.preventDefault();
    this.activePointers.delete(e.pointerId);
    this.updateDirection();
  };

  private onPointerCancel = (e: PointerEvent): void => {
    this.activePointers.delete(e.pointerId);
    this.updateDirection();
  };

  private updateDirection(): void {
    let left = false;
    let right = false;
    for (const side of this.activePointers.values()) {
      if (side === 'left') left = true;
      if (side === 'right') right = true;
    }
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
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerCancel);
    canvas.addEventListener('pointerleave', this.onPointerUp);
  }

  getState(): InputState {
    return this.state;
  }

  setBoostPressed(pressed: boolean): void {
    this.state.boostPressed = pressed;
  }

  dispose(): void {
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.onPointerDown);
      this.canvas.removeEventListener('pointerup', this.onPointerUp);
      this.canvas.removeEventListener('pointercancel', this.onPointerCancel);
      this.canvas.removeEventListener('pointerleave', this.onPointerUp);
      this.canvas = null;
    }
    this.activePointers.clear();
    this.state = { moveDirection: 0, boostPressed: false };
  }
}
