import * as THREE from 'three';

type WorldPosition = Pick<THREE.Vector3, 'x' | 'y' | 'z'>;

interface PopupEntry {
  el: HTMLDivElement;
  active: boolean;
  timeoutId: number | null;
  onAnimationEnd: ((ev: AnimationEvent) => void) | null;
}

export class ScorePopupManager {
  private static readonly STYLE_ID = 'score-popup-animations';
  private static readonly POOL_SIZE = 6;
  private static readonly POPUP_LIFETIME_MS = 720;

  private root: HTMLDivElement | null = null;
  private pool: PopupEntry[] = [];
  private nextRecycleIndex = 0;
  private readonly scratch = new THREE.Vector3();

  show(score: number, worldPosition: WorldPosition, camera: THREE.Camera): void {
    const root = this.ensureRoot();
    if (!root) return;

    const overlay = root.parentElement;
    if (!overlay) return;

    const width = overlay.clientWidth || window.innerWidth || document.documentElement.clientWidth || 1;
    const height = overlay.clientHeight || window.innerHeight || document.documentElement.clientHeight || 1;

    this.scratch.set(worldPosition.x, worldPosition.y, worldPosition.z).project(camera);
    if (
      !Number.isFinite(this.scratch.x) ||
      !Number.isFinite(this.scratch.y) ||
      !Number.isFinite(this.scratch.z)
    ) {
      return;
    }

    const x = (this.scratch.x * 0.5 + 0.5) * width;
    const y = (-this.scratch.y * 0.5 + 0.5) * height;
    const entry = this.acquireEntry(root);
    const color = score >= 500 ? '#ff9cf7' : '#ffe066';

    entry.el.textContent = `+${score}`;
    entry.el.style.left = `${Math.round(x)}px`;
    entry.el.style.top = `${Math.round(y)}px`;
    entry.el.style.color = color;
    entry.el.style.textShadow = `0 2px 10px ${score >= 500 ? 'rgba(255, 156, 247, 0.55)' : 'rgba(255, 214, 102, 0.55)'}`;
    entry.el.style.visibility = 'visible';
    entry.el.style.opacity = '1';
    entry.el.removeAttribute('data-score-popup-active');
    void entry.el.offsetWidth;
    entry.el.setAttribute('data-score-popup-active', '');
    entry.active = true;

    const cleanup = (): void => {
      this.releaseEntry(entry);
    };

    entry.onAnimationEnd = (ev: AnimationEvent): void => {
      if (ev.animationName !== 'scorePopupFloat') return;
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
    return {
      el,
      active: false,
      timeoutId: null,
      onAnimationEnd: null,
    };
  }

  private releaseEntry(entry: PopupEntry): void {
    this.clearEntry(entry);
    entry.el.style.visibility = 'hidden';
    entry.el.style.opacity = '0';
  }

  private clearEntry(entry: PopupEntry): void {
    entry.active = false;
    entry.el.removeAttribute('data-score-popup-active');
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
      @keyframes scorePopupFloat {
        0% {
          opacity: 0;
          transform: translate3d(-50%, -35%, 0) scale(0.92);
        }
        18% {
          opacity: 1;
          transform: translate3d(-50%, -50%, 0) scale(1);
        }
        100% {
          opacity: 0;
          transform: translate3d(-50%, -105%, 0) scale(1.04);
        }
      }
      div[data-score-popup][data-score-popup-active] {
        animation: scorePopupFloat 0.72s ease-out 1;
      }
    `;
    document.head.appendChild(style);
  }
}
