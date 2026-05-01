/**
 * Subscribe to page visibility / lifecycle events that should pause and
 * resume the game loop and audio.
 *
 * Why a pure helper:
 *  - iPad Safari does not always fire `visibilitychange` on bfcache restore
 *    or when the URL bar / share sheet is dismissed. We need to multiplex
 *    several events into a single (onHide, onShow) pair so callers do not
 *    need to know about per-platform quirks.
 *  - jsdom can dispatch arbitrary `Event`s on `document` / `window`, so
 *    keeping this helper free of Three.js / WebGL imports lets us unit-test
 *    the wiring with `dispatchEvent(new Event(...))`.
 *
 * Hide signals (call `onHide`):
 *  - `document.visibilitychange` when `document.hidden === true`
 *  - `window.pagehide`  (tab swipe-close, navigation away)
 *  - `window.blur`      (app switch on iPad Safari)
 *
 * Show signals (call `onShow`):
 *  - `document.visibilitychange` when `document.hidden === false`
 *  - `window.pageshow` with `event.persisted === true` (bfcache restore)
 *  - `window.focus`     (URL bar / share sheet dismissed without firing
 *                        `visibilitychange`)
 *
 * Both callbacks must be idempotent: the same logical transition can produce
 * multiple events (e.g. `pageshow` then `focus` on bfcache restore).
 */
export interface VisibilityPauseHandlerOptions {
  /** Called when the page becomes hidden / loses focus. Must be idempotent. */
  onHide: () => void;
  /** Called when the page becomes visible / regains focus. Must be idempotent. */
  onShow: () => void;
  /** Injection point for tests. Defaults to global `document`. */
  doc?: Pick<Document, 'addEventListener' | 'removeEventListener'> & {
    readonly hidden: boolean;
  };
  /** Injection point for tests. Defaults to global `window`. */
  win?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

export function createVisibilityPauseHandler(
  options: VisibilityPauseHandlerOptions,
): () => void {
  const doc = options.doc ?? document;
  const win = options.win ?? window;
  const { onHide, onShow } = options;

  const visibilityListener = (): void => {
    if (doc.hidden) onHide();
    else onShow();
  };
  const pagehideListener = (): void => {
    onHide();
  };
  const blurListener = (): void => {
    onHide();
  };
  const pageshowListener = (event: Event): void => {
    if ((event as PageTransitionEvent).persisted) onShow();
  };
  const focusListener = (): void => {
    onShow();
  };

  doc.addEventListener('visibilitychange', visibilityListener as EventListener);
  win.addEventListener('pagehide', pagehideListener as EventListener);
  win.addEventListener('blur', blurListener as EventListener);
  win.addEventListener('pageshow', pageshowListener as EventListener);
  win.addEventListener('focus', focusListener as EventListener);

  return () => {
    doc.removeEventListener('visibilitychange', visibilityListener as EventListener);
    win.removeEventListener('pagehide', pagehideListener as EventListener);
    win.removeEventListener('blur', blurListener as EventListener);
    win.removeEventListener('pageshow', pageshowListener as EventListener);
    win.removeEventListener('focus', focusListener as EventListener);
  };
}
