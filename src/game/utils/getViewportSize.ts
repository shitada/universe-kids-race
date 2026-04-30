export interface ViewportSize {
  width: number;
  height: number;
}

interface VisualViewportLike {
  width: number;
  height: number;
}

interface WindowLike {
  innerWidth: number;
  innerHeight: number;
  visualViewport?: VisualViewportLike | null;
}

/**
 * Returns the current viewport size, preferring `window.visualViewport` when
 * available so that iPad Safari URL bar show/hide is reflected immediately.
 * Falls back to `window.innerWidth` / `window.innerHeight` otherwise.
 */
export function getViewportSize(win: WindowLike = window): ViewportSize {
  const vv = win.visualViewport;
  if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height) && vv.width > 0 && vv.height > 0) {
    return { width: vv.width, height: vv.height };
  }
  return { width: win.innerWidth, height: win.innerHeight };
}

type Listener = () => void;

interface EventTargetLike {
  addEventListener(type: string, listener: Listener): void;
  removeEventListener(type: string, listener: Listener): void;
}

interface SubscribeWindowLike extends WindowLike, EventTargetLike {
  visualViewport?: (VisualViewportLike & EventTargetLike) | null;
}

/**
 * Subscribes `onResize` to viewport-related events on the given window.
 *
 * Listens to `resize` and `orientationchange` on the window, plus `resize` and
 * `scroll` on `window.visualViewport` when available. The visualViewport events
 * are required to track iPad Safari URL bar show/hide reliably; duplicate
 * dispatches are absorbed by the rAF coalescer downstream.
 *
 * Returns an unsubscribe function that removes all registered listeners.
 */
export function subscribeViewportResize(
  win: SubscribeWindowLike,
  onResize: Listener,
): () => void {
  win.addEventListener('resize', onResize);
  win.addEventListener('orientationchange', onResize);
  const vv = win.visualViewport ?? null;
  if (vv) {
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
  }
  return () => {
    win.removeEventListener('resize', onResize);
    win.removeEventListener('orientationchange', onResize);
    if (vv) {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
    }
  };
}
