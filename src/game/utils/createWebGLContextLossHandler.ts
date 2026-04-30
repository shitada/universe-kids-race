/**
 * Subscribe to WebGL context lost / restored events on the given canvas.
 *
 * Returns a teardown function that removes both listeners.
 *
 * Why a pure helper:
 * - jsdom has no WebGL context, but it can dispatch arbitrary `Event`s on a
 *   canvas. Keeping this helper free of Three.js / WebGL imports lets us
 *   unit-test the wiring with a manual `dispatchEvent(new Event(...))`.
 * - `webglcontextlost` MUST call `event.preventDefault()` so the browser
 *   keeps the canvas around and is allowed to fire `webglcontextrestored`.
 */
export interface WebGLContextLossCallbacks {
  onLost: () => void;
  onRestored: () => void;
}

export function createWebGLContextLossHandler(
  canvas: HTMLCanvasElement,
  { onLost, onRestored }: WebGLContextLossCallbacks,
): () => void {
  const lostListener = (event: Event): void => {
    event.preventDefault();
    onLost();
  };
  const restoredListener = (): void => {
    onRestored();
  };

  canvas.addEventListener('webglcontextlost', lostListener as EventListener, false);
  canvas.addEventListener('webglcontextrestored', restoredListener as EventListener, false);

  return () => {
    canvas.removeEventListener('webglcontextlost', lostListener as EventListener, false);
    canvas.removeEventListener('webglcontextrestored', restoredListener as EventListener, false);
  };
}
