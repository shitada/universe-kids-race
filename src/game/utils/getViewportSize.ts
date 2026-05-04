export interface ViewportSize {
  width: number;
  height: number;
}

export interface VisualViewportLike {
  width: number;
  height: number;
}

export interface WindowLike {
  innerWidth: number;
  innerHeight: number;
  visualViewport?: VisualViewportLike | null;
}

let cachedViewportSize: ViewportSize | null = null;

function isGlobalWindow(win: WindowLike): boolean {
  return typeof window !== 'undefined' && win === window;
}

function readViewportSize(win: WindowLike): ViewportSize {
  const vv = win.visualViewport;
  if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height) && vv.width > 0 && vv.height > 0) {
    return { width: vv.width, height: vv.height };
  }
  return { width: win.innerWidth, height: win.innerHeight };
}

export function updateViewportSizeCache(win: WindowLike = window): ViewportSize {
  const nextViewportSize = readViewportSize(win);
  if (isGlobalWindow(win)) {
    cachedViewportSize = nextViewportSize;
  }
  return nextViewportSize;
}

/**
 * Returns the current viewport size, preferring `window.visualViewport` when
 * available so that iPad Safari URL bar show/hide is reflected immediately.
 * Falls back to `window.innerWidth` / `window.innerHeight` otherwise.
 */
export function getViewportSize(win: WindowLike = window): ViewportSize {
  if (isGlobalWindow(win)) {
    if (cachedViewportSize === null) {
      cachedViewportSize = updateViewportSizeCache(win);
    }
    return cachedViewportSize;
  }
  return readViewportSize(win);
}

type Listener = () => void;

export interface EventTargetLike {
  addEventListener(type: string, listener: Listener): void;
  removeEventListener(type: string, listener: Listener): void;
}

export interface SubscribeWindowLike extends WindowLike, EventTargetLike {
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
  updateViewportSizeCache(win);
  const handleResize = (): void => {
    updateViewportSizeCache(win);
    onResize();
  };
  win.addEventListener('resize', handleResize);
  win.addEventListener('orientationchange', handleResize);
  const vv = win.visualViewport ?? null;
  if (vv) {
    vv.addEventListener('resize', handleResize);
    vv.addEventListener('scroll', handleResize);
  }
  return () => {
    win.removeEventListener('resize', handleResize);
    win.removeEventListener('orientationchange', handleResize);
    if (vv) {
      vv.removeEventListener('resize', handleResize);
      vv.removeEventListener('scroll', handleResize);
    }
  };
}
