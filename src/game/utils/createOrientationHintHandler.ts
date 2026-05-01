/**
 * Subscribe to viewport orientation changes (portrait <-> landscape) and
 * call the appropriate callback exactly once per logical transition.
 *
 * Why a pure helper:
 *  - iPad Safari's `matchMedia('(orientation: portrait)')` change event can
 *    lag behind the actual rotation, and on some iPadOS versions does not
 *    fire reliably. We multiplex three signals (matchMedia change,
 *    `window.resize`, `window.orientationchange`) into a single debounced
 *    portrait/landscape decision.
 *  - We also fall back to comparing `window.innerHeight > window.innerWidth`
 *    when matchMedia is not available (e.g. jsdom) or returns a stale value.
 *  - Keeping this free of Three.js / DOM overlay imports lets us unit-test
 *    the wiring with simple injection points.
 *
 * Both `onPortrait` and `onLandscape` must be idempotent: only the first call
 * after a state transition is dispatched, but defensive callers are safer.
 */
export interface OrientationHintHandlerOptions {
  /** Called when the viewport becomes portrait. Idempotent. */
  onPortrait: () => void;
  /** Called when the viewport becomes landscape. Idempotent. */
  onLandscape: () => void;
  /** Injection point for tests. Defaults to global `window`. */
  win?: Window;
  /** Debounce in ms to absorb Safari's lagged orientation events. Default 150ms. */
  debounceMs?: number;
  /**
   * Schedule a callback after the debounce window. Defaults to setTimeout.
   * Tests inject a controllable timer.
   */
  scheduler?: (cb: () => void, ms: number) => number;
  /** Cancel a pending scheduled callback. Defaults to clearTimeout. */
  cancelScheduled?: (handle: number) => void;
}

export interface OrientationHintHandler {
  /** Force-evaluate the current orientation and dispatch immediately. */
  evaluate(): void;
  /** Detach all listeners. Safe to call multiple times. */
  dispose(): void;
}

/**
 * Decide if the viewport is currently portrait. Uses matchMedia first and
 * falls back to viewport size comparison so we still react in environments
 * where matchMedia is unavailable or stale (iPad Safari mid-rotation, jsdom).
 */
export function isPortraitViewport(win: Window = window): boolean {
  let mediaSaysPortrait: boolean | null = null;
  if (typeof win.matchMedia === 'function') {
    try {
      mediaSaysPortrait = win.matchMedia('(orientation: portrait)').matches;
    } catch {
      mediaSaysPortrait = null;
    }
  }
  const w = win.innerWidth;
  const h = win.innerHeight;
  // Treat exact-square viewports as landscape (iPad's natural play mode).
  const sizeSaysPortrait = h > w;
  if (mediaSaysPortrait === null) return sizeSaysPortrait;
  // If matchMedia and the viewport agree, trust that. If they disagree
  // (mid-rotation Safari quirk), trust the viewport size — that's what the
  // user actually sees and what our renderer is sized to.
  return mediaSaysPortrait && sizeSaysPortrait
    ? true
    : !mediaSaysPortrait && !sizeSaysPortrait
      ? false
      : sizeSaysPortrait;
}

export function createOrientationHintHandler(
  options: OrientationHintHandlerOptions,
): OrientationHintHandler {
  const win = options.win ?? window;
  const debounceMs = options.debounceMs ?? 150;
  const schedule = options.scheduler ?? ((cb, ms) => win.setTimeout(cb, ms));
  const cancel = options.cancelScheduled ?? ((h) => win.clearTimeout(h));

  // null = not yet evaluated; explicit boolean afterwards so the very first
  // evaluation always dispatches the matching callback.
  let lastPortrait: boolean | null = null;
  let pending: number | null = null;
  let disposed = false;

  const dispatch = (): void => {
    if (disposed) return;
    const portrait = isPortraitViewport(win);
    if (portrait === lastPortrait) return;
    lastPortrait = portrait;
    if (portrait) {
      options.onPortrait();
    } else {
      options.onLandscape();
    }
  };

  const scheduleDispatch = (): void => {
    if (disposed) return;
    if (pending !== null) cancel(pending);
    pending = schedule(() => {
      pending = null;
      dispatch();
    }, debounceMs);
  };

  const onChange = (): void => {
    scheduleDispatch();
  };

  // Subscribe to all available signals. Each is best-effort; missing ones
  // (jsdom) are silently skipped.
  let mql: MediaQueryList | null = null;
  if (typeof win.matchMedia === 'function') {
    try {
      mql = win.matchMedia('(orientation: portrait)');
      // Older Safari only supports addListener / removeListener.
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', onChange);
      } else if (typeof (mql as unknown as { addListener?: (cb: () => void) => void }).addListener === 'function') {
        (mql as unknown as { addListener: (cb: () => void) => void }).addListener(onChange);
      }
    } catch {
      mql = null;
    }
  }

  win.addEventListener('resize', onChange);
  win.addEventListener('orientationchange', onChange);

  return {
    evaluate: (): void => {
      // Synchronous evaluation: skip the debounce window for the initial
      // boot-time check so the overlay can appear before the first frame.
      if (pending !== null) {
        cancel(pending);
        pending = null;
      }
      dispatch();
    },
    dispose: (): void => {
      if (disposed) return;
      disposed = true;
      if (pending !== null) {
        cancel(pending);
        pending = null;
      }
      if (mql) {
        if (typeof mql.removeEventListener === 'function') {
          mql.removeEventListener('change', onChange);
        } else if (typeof (mql as unknown as { removeListener?: (cb: () => void) => void }).removeListener === 'function') {
          (mql as unknown as { removeListener: (cb: () => void) => void }).removeListener(onChange);
        }
      }
      win.removeEventListener('resize', onChange);
      win.removeEventListener('orientationchange', onChange);
    },
  };
}
