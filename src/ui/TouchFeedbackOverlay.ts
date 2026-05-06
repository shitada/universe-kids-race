import type { MotionSensitivity } from '../types';

type GameplayFeedbackSide = 'left' | 'right' | 'center';
type TouchFeedbackVariant = 'game-left' | 'game-right' | 'game-center' | 'ui';

interface FeedbackEntry {
  host: HTMLDivElement;
  marker: HTMLDivElement;
  ripple: HTMLDivElement;
  markerTimeoutId: number | null;
  rippleTimeoutId: number | null;
  releaseScheduled: boolean;
  activePointerId: number | null;
  animationToggle: boolean;
}

const MOTION_PROFILE: Record<MotionSensitivity, {
  rippleDurationMs: number;
  markerDurationMs: number;
  rippleScale: number;
  markerScale: number;
}> = {
  strong: {
    rippleDurationMs: 360,
    markerDurationMs: 300,
    rippleScale: 2.35,
    markerScale: 1,
  },
  medium: {
    rippleDurationMs: 340,
    markerDurationMs: 300,
    rippleScale: 2.05,
    markerScale: 0.98,
  },
  gentle: {
    rippleDurationMs: 320,
    markerDurationMs: 280,
    rippleScale: 1.75,
    markerScale: 0.94,
  },
  minimal: {
    rippleDurationMs: 280,
    markerDurationMs: 240,
    rippleScale: 1.45,
    markerScale: 0.9,
  },
};

export class TouchFeedbackOverlay {
  private static readonly STYLE_ID = 'touch-feedback-overlay-styles';
  private static readonly UI_ROOT_LISTENER_OPTIONS: AddEventListenerOptions = {
    capture: true,
    passive: true,
  };

  private root: HTMLDivElement | null = null;
  private readonly activeEntries = new Map<number, FeedbackEntry>();
  private readonly pooledEntries: FeedbackEntry[] = [];
  private readonly uiRootCleanups = new Set<() => void>();
  private motionSensitivity: MotionSensitivity = 'strong';

  attach(): void {
    const root = this.ensureRoot();
    if (!root.isConnected) {
      document.body.appendChild(root);
    }
  }

  hide(): void {
    this.clearUiRoots();
    for (const pointerId of this.activeEntries.keys()) {
      this.releaseGameplayTouch(pointerId);
    }
    this.activeEntries.clear();
    while (this.pooledEntries.length > 0) {
      const entry = this.pooledEntries.pop();
      entry?.host.remove();
    }
    this.root?.remove();
  }

  dispose(): void {
    this.hide();
    this.root = null;
  }

  setMotionSensitivity(value: MotionSensitivity): void {
    this.motionSensitivity = value;
    const root = this.ensureRoot();
    const profile = MOTION_PROFILE[value];
    root.style.setProperty('--touch-feedback-ripple-duration', `${profile.rippleDurationMs}ms`);
    root.style.setProperty('--touch-feedback-marker-duration', `${profile.markerDurationMs}ms`);
    root.style.setProperty('--touch-feedback-ripple-scale', `${profile.rippleScale}`);
    root.style.setProperty('--touch-feedback-marker-scale', `${profile.markerScale}`);
  }

  bindUiRoots(roots: Array<HTMLElement | null | undefined>): void {
    this.clearUiRoots();
    for (const root of roots) {
      if (!root) continue;
      const handler = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (this.root?.contains(target)) return;
        const interactiveTarget = target.closest('button, [role="button"], [data-touch-feedback-button]');
        if (!(interactiveTarget instanceof HTMLElement) || !root.contains(interactiveTarget)) {
          return;
        }
        const pointerEvent = event as PointerEvent;
        if (typeof pointerEvent.clientX !== 'number' || typeof pointerEvent.clientY !== 'number') {
          return;
        }
        this.showUiTouch(pointerEvent.clientX, pointerEvent.clientY);
      };
      root.addEventListener(
        'pointerdown',
        handler,
        TouchFeedbackOverlay.UI_ROOT_LISTENER_OPTIONS,
      );
      this.uiRootCleanups.add(() => {
        root.removeEventListener(
          'pointerdown',
          handler,
          TouchFeedbackOverlay.UI_ROOT_LISTENER_OPTIONS,
        );
      });
    }
  }

  showGameplayTouch(pointerId: number, clientX: number, clientY: number, side: GameplayFeedbackSide): void {
    const entry = this.activeEntries.get(pointerId) ?? this.acquireEntry(pointerId);
    this.activeEntries.set(pointerId, entry);
    this.activateEntry(entry, clientX, clientY, this.toGameplayVariant(side));
  }

  moveGameplayTouch(pointerId: number, clientX: number, clientY: number, side: GameplayFeedbackSide): void {
    this.showGameplayTouch(pointerId, clientX, clientY, side);
  }

  releaseGameplayTouch(pointerId: number): void {
    const entry = this.activeEntries.get(pointerId);
    if (!entry) return;
    this.activeEntries.delete(pointerId);
    entry.activePointerId = null;
    this.recycleWhenIdle(entry);
  }

  private showUiTouch(clientX: number, clientY: number): void {
    const entry = this.acquireEntry(null);
    this.activateEntry(entry, clientX, clientY, 'ui');
    this.recycleWhenIdle(entry);
  }

  private ensureRoot(): HTMLDivElement {
    if (this.root) {
      return this.root;
    }
    this.injectStyles();
    const root = document.createElement('div');
    root.setAttribute('data-touch-feedback-root', '');
    root.style.cssText = `
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 25;
      contain: layout style paint;
      --touch-feedback-ripple-duration: ${MOTION_PROFILE.strong.rippleDurationMs}ms;
      --touch-feedback-marker-duration: ${MOTION_PROFILE.strong.markerDurationMs}ms;
      --touch-feedback-ripple-scale: ${MOTION_PROFILE.strong.rippleScale};
      --touch-feedback-marker-scale: ${MOTION_PROFILE.strong.markerScale};
    `;
    this.root = root;
    this.setMotionSensitivity(this.motionSensitivity);
    return root;
  }

  private injectStyles(): void {
    if (document.getElementById(TouchFeedbackOverlay.STYLE_ID)) {
      return;
    }
    const style = document.createElement('style');
    style.id = TouchFeedbackOverlay.STYLE_ID;
    style.textContent = `
      @keyframes touchFeedbackRippleA {
        0% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.35); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(var(--touch-feedback-ripple-scale)); }
      }
      @keyframes touchFeedbackRippleB {
        0% { opacity: 0.74; transform: translate(-50%, -50%) scale(0.42); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-ripple-scale) * 0.94)); }
      }
      @keyframes touchFeedbackMarkerA {
        0% { opacity: 0.82; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 0.82)); }
        70% { opacity: 0.56; transform: translate(-50%, -50%) scale(var(--touch-feedback-marker-scale)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 1.06)); }
      }
      @keyframes touchFeedbackMarkerB {
        0% { opacity: 0.78; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 0.88)); }
        70% { opacity: 0.52; transform: translate(-50%, -50%) scale(var(--touch-feedback-marker-scale)); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(calc(var(--touch-feedback-marker-scale) * 1.03)); }
      }
      [data-touch-feedback-entry] {
        position: absolute;
        inset: 0 auto auto 0;
        width: 0;
        height: 0;
      }
      [data-touch-feedback-ripple],
      [data-touch-feedback-marker] {
        position: absolute;
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        will-change: transform, opacity;
      }
      [data-touch-feedback-ripple] {
        width: 4rem;
        height: 4rem;
        border-radius: 999px;
        border: 0.24rem solid var(--touch-feedback-color, rgba(255,255,255,0.9));
        box-shadow: 0 0 24px var(--touch-feedback-color, rgba(255,255,255,0.3));
        opacity: 0;
      }
      [data-touch-feedback-marker] {
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 999px;
        background:
          radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.96), transparent 36%),
          var(--touch-feedback-color, rgba(255,255,255,0.9));
        border: 0.16rem solid rgba(255, 255, 255, 0.94);
        box-shadow:
          0 0 18px var(--touch-feedback-color, rgba(255,255,255,0.35)),
          0 0 0 0.18rem rgba(255, 255, 255, 0.2);
        opacity: 0;
      }
      [data-touch-feedback-variant="game-left"] {
        --touch-feedback-color: rgba(119, 220, 255, 0.95);
      }
      [data-touch-feedback-variant="game-right"] {
        --touch-feedback-color: rgba(255, 162, 231, 0.96);
      }
      [data-touch-feedback-variant="game-center"] {
        --touch-feedback-color: rgba(255, 255, 255, 0.92);
      }
      [data-touch-feedback-variant="ui"] {
        --touch-feedback-color: rgba(255, 223, 120, 0.97);
      }
      [data-touch-feedback-ripple][data-touch-feedback-anim="a"] {
        animation: touchFeedbackRippleA var(--touch-feedback-ripple-duration) ease-out forwards;
      }
      [data-touch-feedback-ripple][data-touch-feedback-anim="b"] {
        animation: touchFeedbackRippleB var(--touch-feedback-ripple-duration) ease-out forwards;
      }
      [data-touch-feedback-marker][data-touch-feedback-anim="a"] {
        animation: touchFeedbackMarkerA var(--touch-feedback-marker-duration) ease-out forwards;
      }
      [data-touch-feedback-marker][data-touch-feedback-anim="b"] {
        animation: touchFeedbackMarkerB var(--touch-feedback-marker-duration) ease-out forwards;
      }
    `;
    document.head.appendChild(style);
  }

  private acquireEntry(pointerId: number | null): FeedbackEntry {
    const entry = this.pooledEntries.pop() ?? this.createEntry();
    entry.activePointerId = pointerId;
    entry.releaseScheduled = false;
    this.ensureRoot().appendChild(entry.host);
    return entry;
  }

  private createEntry(): FeedbackEntry {
    const host = document.createElement('div');
    host.setAttribute('data-touch-feedback-entry', '');
    const ripple = document.createElement('div');
    ripple.setAttribute('data-touch-feedback-ripple', '');
    const marker = document.createElement('div');
    marker.setAttribute('data-touch-feedback-marker', '');
    host.append(ripple, marker);
    const entry: FeedbackEntry = {
      host,
      marker,
      ripple,
      markerTimeoutId: null,
      rippleTimeoutId: null,
      releaseScheduled: false,
      activePointerId: null,
      animationToggle: false,
    };
    const handleAnimationEnd = (event: Event): void => {
      if (!(event.target instanceof HTMLElement)) return;
      event.target.removeAttribute('data-touch-feedback-anim');
      this.recycleWhenIdle(entry);
    };
    ripple.addEventListener('animationend', handleAnimationEnd);
    marker.addEventListener('animationend', handleAnimationEnd);
    return entry;
  }

  private activateEntry(
    entry: FeedbackEntry,
    clientX: number,
    clientY: number,
    variant: TouchFeedbackVariant,
  ): void {
    const animationKey = entry.animationToggle ? 'a' : 'b';
    entry.animationToggle = !entry.animationToggle;
    entry.releaseScheduled = false;
    entry.host.style.left = `${clientX}px`;
    entry.host.style.top = `${clientY}px`;
    entry.host.setAttribute('data-touch-feedback-variant', variant);
    entry.ripple.setAttribute('data-touch-feedback-anim', animationKey);
    entry.marker.setAttribute('data-touch-feedback-anim', animationKey);
    if (entry.markerTimeoutId !== null) {
      window.clearTimeout(entry.markerTimeoutId);
    }
    if (entry.rippleTimeoutId !== null) {
      window.clearTimeout(entry.rippleTimeoutId);
    }
    const rippleDurationMs = MOTION_PROFILE[this.motionSensitivity].rippleDurationMs;
    const markerDurationMs = MOTION_PROFILE[this.motionSensitivity].markerDurationMs;
    entry.rippleTimeoutId = window.setTimeout(() => {
      entry.rippleTimeoutId = null;
      entry.ripple.removeAttribute('data-touch-feedback-anim');
      this.recycleWhenIdle(entry);
    }, rippleDurationMs + 24);
    entry.markerTimeoutId = window.setTimeout(() => {
      entry.markerTimeoutId = null;
      entry.marker.removeAttribute('data-touch-feedback-anim');
      this.recycleWhenIdle(entry);
    }, markerDurationMs + 24);
  }

  private recycleWhenIdle(entry: FeedbackEntry): void {
    if (entry.activePointerId !== null || entry.releaseScheduled) {
      return;
    }
    const rippleAnimating = entry.ripple.hasAttribute('data-touch-feedback-anim');
    const markerAnimating = entry.marker.hasAttribute('data-touch-feedback-anim');
    if (rippleAnimating || markerAnimating) {
      return;
    }
    entry.releaseScheduled = true;
    entry.host.remove();
    entry.host.removeAttribute('data-touch-feedback-variant');
    if (entry.markerTimeoutId !== null) {
      window.clearTimeout(entry.markerTimeoutId);
      entry.markerTimeoutId = null;
    }
    if (entry.rippleTimeoutId !== null) {
      window.clearTimeout(entry.rippleTimeoutId);
      entry.rippleTimeoutId = null;
    }
    this.pooledEntries.push(entry);
  }

  private clearUiRoots(): void {
    const cleanups = Array.from(this.uiRootCleanups);
    this.uiRootCleanups.clear();
    for (const cleanup of cleanups) {
      cleanup();
    }
  }

  private toGameplayVariant(side: GameplayFeedbackSide): TouchFeedbackVariant {
    switch (side) {
      case 'left':
        return 'game-left';
      case 'right':
        return 'game-right';
      default:
        return 'game-center';
    }
  }
}
