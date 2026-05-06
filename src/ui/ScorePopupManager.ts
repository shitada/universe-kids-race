import * as THREE from 'three';
import type { StarType } from '../types';

type WorldPosition = Pick<THREE.Vector3, 'x' | 'y' | 'z'>;

interface PopupEntry {
  el: HTMLDivElement;
  active: boolean;
  timeoutId: number | null;
  onAnimationEnd: ((ev: AnimationEvent) => void) | null;
  useAltAnimation: boolean;
  currentAnimationName: 'scorePopupFloatA' | 'scorePopupFloatB' | 'none';
}

export type PopupKind =
  | 'normal'
  | 'bonus'
  | 'shooting-star'
  | 'special-star'
  | 'monthly-encounter'
  | 'space-gem'
  | 'lovely-star';

interface PopupVisualStyle {
  text: string;
  kind: PopupKind;
  color: string;
  shadow: string;
}

export interface ScoreGainPresentation {
  worldText: string;
  hudText: string;
  kind: PopupKind;
  color: string;
  shadow: string;
}

export function createScoreGainPresentation(score: number, starType?: StarType): ScoreGainPresentation {
  if (starType === 'LOVELY') {
    return {
      worldText: `💖 +${score}`,
      hudText: `+${score}`,
      kind: 'lovely-star',
      color: '#ff8fd6',
      shadow: 'rgba(255, 143, 214, 0.65)',
    };
  }
  const isBonus = score >= 500;
  return {
    worldText: `${isBonus ? '🌈' : '⬢'} +${score}`,
    hudText: `+${score}`,
    kind: isBonus ? 'bonus' : 'normal',
    color: isBonus ? '#ff9cf7' : '#ffe066',
    shadow: isBonus ? 'rgba(255, 156, 247, 0.55)' : 'rgba(255, 214, 102, 0.55)',
  };
}

export class ScorePopupManager {
  private static readonly STYLE_ID = 'score-popup-animations';
  private static readonly POOL_SIZE = 6;
  private static readonly POPUP_LIFETIME_MS = 720;

  private root: HTMLDivElement | null = null;
  private pool: PopupEntry[] = [];
  private highContrastMode = false;
  private nextRecycleIndex = 0;
  private readonly scratch = new THREE.Vector3();

  setHighContrastMode(enabled: boolean): void {
    this.highContrastMode = enabled;
  }

  show(score: number, worldPosition: WorldPosition, camera: THREE.Camera, starType?: StarType): void {
    const presentation = createScoreGainPresentation(score, starType);
    this.showPopup(
      {
        text: presentation.worldText,
        kind: presentation.kind,
        color: presentation.color,
        shadow: presentation.shadow,
      },
      worldPosition,
      camera,
    );
  }

  showLabel(text: string, worldPosition: WorldPosition, camera: THREE.Camera, kind: PopupKind = 'normal'): void {
    const style =
      kind === 'shooting-star'
        || kind === 'special-star'
        || kind === 'monthly-encounter'
        || kind === 'space-gem'
        || kind === 'lovely-star'
        ? {
            text,
            kind,
            color: kind === 'lovely-star' ? '#ff8fd6' : kind === 'space-gem' ? '#dff8ff' : 'rgb(255, 244, 179)',
            shadow: kind === 'lovely-star'
              ? 'rgba(255, 143, 214, 0.65)'
              : kind === 'space-gem'
                ? 'rgba(167, 244, 255, 0.78)'
                : 'rgba(191, 231, 255, 0.75)',
          }
        : {
            text,
            kind,
            color: '#ffe066',
            shadow: 'rgba(255, 214, 102, 0.55)',
          };
    this.showPopup(style, worldPosition, camera);
  }

  private showPopup(style: PopupVisualStyle, worldPosition: WorldPosition, camera: THREE.Camera): void {
    const root = this.ensureRoot();
    if (!root) return;

    this.scratch.set(worldPosition.x, worldPosition.y, worldPosition.z).project(camera);
    if (
      !Number.isFinite(this.scratch.x) ||
      !Number.isFinite(this.scratch.y) ||
      !Number.isFinite(this.scratch.z)
    ) {
      return;
    }

    const x = Math.round((this.scratch.x * 0.5 + 0.5) * 100000) / 1000;
    const y = Math.round((-this.scratch.y * 0.5 + 0.5) * 100000) / 1000;
    const entry = this.acquireEntry(root);
    const animationName = entry.useAltAnimation ? 'scorePopupFloatB' : 'scorePopupFloatA';
    entry.useAltAnimation = !entry.useAltAnimation;
    entry.currentAnimationName = animationName;

    entry.el.textContent = style.text;
    entry.el.style.left = `${x}%`;
    entry.el.style.top = `${y}%`;
    entry.el.style.color = style.color;
    entry.el.style.textShadow = `0 2px 10px ${style.shadow}`;
    entry.el.style.background = this.highContrastMode
        ? style.kind === 'bonus'
        || style.kind === 'shooting-star'
        || style.kind === 'special-star'
        || style.kind === 'monthly-encounter'
        || style.kind === 'space-gem'
        || style.kind === 'lovely-star'
        ? 'rgba(13, 18, 38, 0.92)'
        : 'rgba(0, 0, 0, 0.82)'
      : 'transparent';
    entry.el.style.border = this.highContrastMode
        ? style.kind === 'bonus'
        || style.kind === 'shooting-star'
        || style.kind === 'special-star'
        || style.kind === 'monthly-encounter'
        || style.kind === 'space-gem'
        || style.kind === 'lovely-star'
        ? '3px solid rgba(255, 255, 255, 0.95)'
        : '2px dashed rgba(255, 255, 255, 0.95)'
      : 'none';
    entry.el.style.borderRadius = this.highContrastMode ? '999px' : '0';
    entry.el.style.padding = this.highContrastMode ? '0.18rem 0.55rem' : '0';
    entry.el.style.setProperty('-webkit-text-stroke', this.highContrastMode ? '0.6px #061126' : '0');
    entry.el.setAttribute('data-score-popup-kind', style.kind);
    entry.el.style.visibility = 'visible';
    entry.el.style.opacity = '1';
    entry.el.style.animationName = animationName;
    entry.el.removeAttribute('data-score-popup-active');
    entry.el.setAttribute('data-score-popup-active', '');
    entry.active = true;

    const cleanup = (): void => {
      this.releaseEntry(entry);
    };

    entry.onAnimationEnd = (ev: AnimationEvent): void => {
      if (ev.animationName !== entry.currentAnimationName) return;
      cleanup();
    };
    entry.el.addEventListener('animationend', entry.onAnimationEnd);
    entry.timeoutId = window.setTimeout(cleanup, ScorePopupManager.POPUP_LIFETIME_MS);
  }

  dispose(): void {
    for (const entry of this.pool) {
      this.clearEntry(entry);
      entry.el.remove();
    }
    this.pool = [];
    this.root?.remove();
    this.root = null;
    this.nextRecycleIndex = 0;
  }

  private ensureRoot(): HTMLDivElement | null {
    const overlay = document.getElementById('ui-overlay');
    if (!overlay) return null;

    if (this.root && (this.root.parentElement !== overlay || !this.root.isConnected)) {
      this.dispose();
    }

    if (this.root) return this.root;

    this.injectStyles();
    this.root = document.createElement('div');
    this.root.setAttribute('data-score-popup-root', '');
    this.root.style.position = 'absolute';
    this.root.style.inset = '0';
    this.root.style.overflow = 'hidden';
    this.root.style.pointerEvents = 'none';
    this.root.style.contain = 'layout style paint';
    overlay.appendChild(this.root);
    return this.root;
  }

  private acquireEntry(root: HTMLDivElement): PopupEntry {
    if (this.pool.length < ScorePopupManager.POOL_SIZE) {
      const entry = this.createEntry();
      this.pool.push(entry);
      root.appendChild(entry.el);
      return entry;
    }

    const entry = this.pool.find((candidate) => !candidate.active)
      ?? this.pool[this.nextRecycleIndex++ % this.pool.length];
    this.clearEntry(entry);
    return entry;
  }

  private createEntry(): PopupEntry {
    const el = document.createElement('div');
    el.setAttribute('data-score-popup', '');
    el.style.position = 'absolute';
    el.style.transform = 'translate3d(-50%, -50%, 0)';
    el.style.fontFamily = "'Zen Maru Gothic', sans-serif";
    el.style.fontSize = 'clamp(1rem, 3.5vmin, 1.4rem)';
    el.style.fontWeight = '900';
    el.style.lineHeight = '1';
    el.style.whiteSpace = 'nowrap';
    el.style.pointerEvents = 'none';
    el.style.willChange = 'transform, opacity';
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
    el.style.animationDuration = `${ScorePopupManager.POPUP_LIFETIME_MS}ms`;
    el.style.animationTimingFunction = 'ease-out';
    el.style.animationIterationCount = '1';
    return {
      el,
      active: false,
      timeoutId: null,
      onAnimationEnd: null,
      useAltAnimation: false,
      currentAnimationName: 'none',
    };
  }

  private releaseEntry(entry: PopupEntry): void {
    this.clearEntry(entry);
    entry.el.style.visibility = 'hidden';
    entry.el.style.opacity = '0';
  }

  private clearEntry(entry: PopupEntry): void {
    entry.active = false;
    entry.currentAnimationName = 'none';
    entry.el.removeAttribute('data-score-popup-active');
    entry.el.removeAttribute('data-score-popup-kind');
    entry.el.style.animationName = 'none';
    if (entry.timeoutId !== null) {
      window.clearTimeout(entry.timeoutId);
      entry.timeoutId = null;
    }
    if (entry.onAnimationEnd) {
      entry.el.removeEventListener('animationend', entry.onAnimationEnd);
      entry.onAnimationEnd = null;
    }
  }

  private injectStyles(): void {
    if (document.getElementById(ScorePopupManager.STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = ScorePopupManager.STYLE_ID;
    style.textContent = `
      @keyframes scorePopupFloatA {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -32%, 0) scale(0.82);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -54%, 0) scale(1.16);
        }
        34% {
          opacity: 1;
          transform: translate3d(-50%, -48%, 0) scale(0.96);
        }
        52% {
          opacity: 1;
          transform: translate3d(-50%, -62%, 0) scale(1.05);
        }
        100% {
          opacity: 0;
          transform: translate3d(-50%, -105%, 0) scale(1.02);
        }
      }
      @keyframes scorePopupFloatB {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -32%, 0) scale(0.82);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -54%, 0) scale(1.16);
        }
        34% {
          opacity: 1;
          transform: translate3d(-48%, -48%, 0) scale(0.96);
        }
        72% {
          opacity: 1;
          transform: translate3d(-43%, -84%, 0) scale(1.05);
        }
        100% {
          opacity: 0;
          transform: translate3d(-38%, -105%, 0) scale(1.03);
        }
      }
    `;
    document.head.appendChild(style);
  }
}
