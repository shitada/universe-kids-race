import type { ConstellationDefinition, MotionSensitivity } from '../types';

export interface ConstellationHintTargetScreenPosition {
  x: number;
  y: number;
  visible: boolean;
}

type OverlayMode = 'hidden' | 'guide' | 'message' | 'celebration';

interface GuideState {
  definition: ConstellationDefinition;
  collectedCount: number;
}

export class ConstellationHintOverlay {
  private static readonly DEFAULT_DURATION = 4.2;
  private static readonly CELEBRATION_DURATION = 3.6;
  private static readonly STYLE_ID = 'constellation-hint-overlay-styles';
  private static readonly POINTER_SIZE = 56;
  private static readonly POINTER_SAFE_MARGIN = 28;
  private static readonly POINTER_TOP_SAFE_AREA = 124;

  private element: HTMLDivElement | null = null;
  private messageElement: HTMLDivElement | null = null;
  private statusElement: HTMLDivElement | null = null;
  private miniMapElement: SVGSVGElement | null = null;
  private pointerElement: HTMLDivElement | null = null;
  private pointerArrowElement: HTMLDivElement | null = null;
  private timer = 0;
  private mode: OverlayMode = 'hidden';
  private message: string | null = null;
  private highContrast = false;
  private motionSensitivity: MotionSensitivity = 'strong';
  private guideState: GuideState | null = null;
  private targetScreenPosition: ConstellationHintTargetScreenPosition | null = null;

  showHint(message: string): void {
    this.mode = 'message';
    this.timer = ConstellationHintOverlay.DEFAULT_DURATION;
    this.message = message;
    this.render();
  }

  showGuide(definition: ConstellationDefinition, collectedCount: number): void {
    this.mode = 'guide';
    this.timer = 0;
    this.guideState = {
      definition,
      collectedCount: Math.max(0, Math.min(collectedCount, definition.points.length)),
    };
    this.message = this.buildGuideMessage(definition, this.guideState.collectedCount);
    this.render();
  }

  showCelebration(message: string): void {
    this.mode = 'celebration';
    this.timer = ConstellationHintOverlay.CELEBRATION_DURATION;
    this.message = message;
    this.render();
  }

  updateTargetScreenPosition(target: ConstellationHintTargetScreenPosition | null): void {
    this.targetScreenPosition = target;
    this.renderPointer();
  }

  tick(deltaTime: number): void {
    if (this.timer <= 0) {
      return;
    }
    this.timer = Math.max(0, this.timer - deltaTime);
    if (this.timer === 0) {
      if (this.mode === 'celebration') {
        const guideState = this.guideState;
        const canReturnToGuide = guideState !== null && guideState.collectedCount < guideState.definition.points.length;
        if (canReturnToGuide) {
          this.mode = 'guide';
          this.message = this.buildGuideMessage(guideState.definition, guideState.collectedCount);
          this.render();
          return;
        }
      }
      this.hide();
    }
  }

  hide(): void {
    this.timer = 0;
    this.mode = 'hidden';
    this.message = null;
    this.guideState = null;
    this.targetScreenPosition = null;
    if (this.element) {
      this.element.style.display = 'none';
      this.element.removeAttribute('data-constellation-message');
    }
    if (this.pointerElement) {
      this.pointerElement.style.display = 'none';
    }
  }

  dispose(): void {
    this.hide();
    this.element?.remove();
    this.pointerElement?.remove();
    this.element = null;
    this.messageElement = null;
    this.statusElement = null;
    this.miniMapElement = null;
    this.pointerElement = null;
    this.pointerArrowElement = null;
  }

  setHighContrastMode(enabled: boolean): void {
    this.highContrast = enabled;
    this.applyTheme();
    this.render();
  }

  setMotionSensitivity(value: MotionSensitivity): void {
    this.motionSensitivity = value;
    this.applyTheme();
    this.renderPointer();
  }

  getMessage(): string | null {
    return this.message;
  }

  private render(): void {
    const element = this.ensureElement();
    this.applyTheme();

    if (this.mode === 'hidden') {
      element.style.display = 'none';
      this.renderPointer();
      return;
    }

    element.style.display = 'flex';
    element.setAttribute('data-constellation-mode', this.mode);
    if (this.message) {
      element.setAttribute('data-constellation-message', this.message);
      element.setAttribute('aria-label', this.message);
    } else {
      element.removeAttribute('data-constellation-message');
      element.removeAttribute('aria-label');
    }

    const guideState = this.guideState;
    const hasGuide = guideState !== null;
    const isGuideLike = this.mode === 'guide' || this.mode === 'celebration';
    const statusText = hasGuide && isGuideLike
      ? this.buildGuideStatus(guideState.definition, guideState.collectedCount)
      : 'ヒント';

    if (this.messageElement) {
      this.messageElement.textContent = this.message ?? '';
    }
    if (this.statusElement) {
      this.statusElement.textContent = statusText;
      this.statusElement.style.display = statusText ? 'inline-flex' : 'none';
    }
    if (this.miniMapElement) {
      this.miniMapElement.style.display = hasGuide ? 'block' : 'none';
      if (hasGuide) {
        const mapMarkup = this.buildMiniMapMarkup(guideState.definition, guideState.collectedCount);
        this.miniMapElement.innerHTML = mapMarkup;
        this.miniMapElement.setAttribute(
          'aria-label',
          `${guideState.definition.reading} の ほしならび。あと${Math.max(0, guideState.definition.points.length - guideState.collectedCount)}こ。`,
        );
      } else {
        this.miniMapElement.innerHTML = '';
      }
    }

    this.renderPointer();
  }

  private ensureElement(): HTMLDivElement {
    if (this.element) {
      return this.element;
    }

    this.injectStyles();
    const root = document.getElementById('ui-overlay') ?? document.body;
    const element = document.createElement('div');
    element.setAttribute('data-constellation-hint', '');
    element.setAttribute('data-constellation-hint-overlay', '');
    element.setAttribute('aria-live', 'polite');
    element.style.cssText = `
      position: absolute;
      top: 0.75rem;
      left: 50%;
      transform: translateX(-50%);
      width: min(82vw, 22.5rem);
      max-width: min(82vw, 22.5rem);
      min-height: 6.25rem;
      padding: 0.7rem 0.8rem 0.8rem;
      border-radius: 1.45rem;
      display: none;
      flex-direction: column;
      gap: 0.55rem;
      pointer-events: none;
      z-index: 35;
      box-sizing: border-box;
      contain: layout style paint;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.24);
    `;

    const header = document.createElement('div');
    header.style.cssText = 'display:flex; align-items:flex-start; justify-content:space-between; gap:0.5rem;';

    const message = document.createElement('div');
    message.setAttribute('data-constellation-message-text', '');
    message.style.cssText = `
      flex: 1;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.35;
      letter-spacing: 0.01em;
      text-wrap: balance;
    `;

    const status = document.createElement('div');
    status.setAttribute('data-constellation-status', '');
    status.style.cssText = `
      min-width: 4.25rem;
      min-height: 2rem;
      padding: 0.28rem 0.7rem;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.88rem;
      font-weight: 800;
      justify-content: center;
      align-items: center;
      text-align: center;
      box-sizing: border-box;
      display: inline-flex;
      align-self: flex-start;
    `;

    const miniMap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    miniMap.setAttribute('data-constellation-minimap', '');
    miniMap.setAttribute('viewBox', '0 0 200 88');
    miniMap.setAttribute('width', '100%');
    miniMap.setAttribute('height', '88');
    miniMap.setAttribute('role', 'img');
    miniMap.style.cssText = 'display:block; width:100%; height:5.5rem; overflow:visible;';

    header.append(message, status);
    element.append(header, miniMap);
    root.appendChild(element);

    this.element = element;
    this.messageElement = message;
    this.statusElement = status;
    this.miniMapElement = miniMap;
    this.ensurePointerElement();
    this.applyTheme();
    return element;
  }

  private ensurePointerElement(): HTMLDivElement {
    if (this.pointerElement) {
      return this.pointerElement;
    }

    const root = document.getElementById('ui-overlay') ?? document.body;
    const pointer = document.createElement('div');
    pointer.setAttribute('data-constellation-pointer', '');
    pointer.style.cssText = `
      position: fixed;
      display: none;
      width: ${ConstellationHintOverlay.POINTER_SIZE}px;
      height: ${ConstellationHintOverlay.POINTER_SIZE}px;
      border-radius: 999px;
      pointer-events: none;
      z-index: 34;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.28);
      transform-origin: center;
    `;

    const arrow = document.createElement('div');
    arrow.setAttribute('data-constellation-pointer-arrow', '');
    arrow.textContent = '➜';
    arrow.style.cssText = `
      font-size: 1.5rem;
      font-weight: 900;
      line-height: 1;
      transform-origin: center;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    `;

    const label = document.createElement('div');
    label.textContent = 'つぎ';
    label.style.cssText = `
      position: absolute;
      bottom: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 2.8rem;
      min-height: 1.5rem;
      padding: 0.1rem 0.45rem;
      border-radius: 999px;
      font-family: 'Zen Maru Gothic', sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      text-align: center;
      box-sizing: border-box;
      white-space: nowrap;
    `;

    pointer.append(arrow, label);
    root.appendChild(pointer);

    this.pointerElement = pointer;
    this.pointerArrowElement = arrow;
    this.applyTheme();
    return pointer;
  }

  private renderPointer(): void {
    const pointer = this.ensurePointerElement();
    const arrow = this.pointerArrowElement;
    const guideState = this.guideState;
    const targetScreenPosition = this.targetScreenPosition;
    const shouldShow =
      this.mode === 'guide' &&
      guideState !== null &&
      guideState.collectedCount < guideState.definition.points.length &&
      targetScreenPosition !== null;

    if (!shouldShow || !arrow) {
      pointer.style.display = 'none';
      return;
    }

    const viewportWidth = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0, 1);
    const viewportHeight = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0, 1);
    const minX = ConstellationHintOverlay.POINTER_SAFE_MARGIN;
    const maxX = viewportWidth - ConstellationHintOverlay.POINTER_SAFE_MARGIN - ConstellationHintOverlay.POINTER_SIZE;
    const minY = ConstellationHintOverlay.POINTER_TOP_SAFE_AREA;
    const maxY = viewportHeight - ConstellationHintOverlay.POINTER_SAFE_MARGIN - ConstellationHintOverlay.POINTER_SIZE;

    const pointerCenterX = targetScreenPosition.visible
      ? targetScreenPosition.x
      : Math.min(Math.max(targetScreenPosition.x, minX + 28), maxX + 28);
    const pointerCenterY = targetScreenPosition.visible
      ? Math.max(targetScreenPosition.y - 56, minY + 28)
      : Math.min(Math.max(targetScreenPosition.y, minY + 28), maxY + 28);

    const left = Math.min(Math.max(pointerCenterX - ConstellationHintOverlay.POINTER_SIZE / 2, minX), maxX);
    const top = Math.min(Math.max(pointerCenterY - ConstellationHintOverlay.POINTER_SIZE / 2, minY), maxY);
    const deltaX = targetScreenPosition.x - (left + ConstellationHintOverlay.POINTER_SIZE / 2);
    const deltaY = targetScreenPosition.y - (top + ConstellationHintOverlay.POINTER_SIZE / 2);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    pointer.style.display = 'flex';
    pointer.style.left = `${left}px`;
    pointer.style.top = `${top}px`;
    arrow.style.transform = `rotate(${angle}deg)`;
  }

  private applyTheme(): void {
    const element = this.element;
    const pointer = this.pointerElement;
    const reducedMotion = this.isReducedMotion();

    if (element) {
      element.style.setProperty('--constellation-card-bg', this.highContrast ? 'rgba(255, 255, 255, 0.98)' : 'rgba(11, 24, 88, 0.9)');
      element.style.setProperty('--constellation-card-border', this.highContrast ? '#102040' : 'rgba(255, 255, 255, 0.3)');
      element.style.setProperty('--constellation-card-text', this.highContrast ? '#102040' : '#fff8c8');
      element.style.setProperty('--constellation-card-subtle', this.highContrast ? 'rgba(16, 32, 64, 0.12)' : 'rgba(255, 255, 255, 0.12)');
      element.style.setProperty('--constellation-status-bg', this.highContrast ? '#102040' : 'rgba(255, 255, 255, 0.15)');
      element.style.setProperty('--constellation-status-text', this.highContrast ? '#ffffff' : '#fffdf1');
      element.style.setProperty('--constellation-line-active', this.highContrast ? '#102040' : '#ffe27a');
      element.style.setProperty('--constellation-line-faint', this.highContrast ? '#7687a6' : 'rgba(255, 255, 255, 0.22)');
      element.style.setProperty('--constellation-star-collected', this.highContrast ? '#102040' : '#fff07b');
      element.style.setProperty('--constellation-star-next', this.highContrast ? '#102040' : '#ff7af6');
      element.style.setProperty('--constellation-star-pending', this.highContrast ? '#d4d9e2' : 'rgba(255, 255, 255, 0.32)');
      element.style.setProperty('--constellation-pulse-animation', reducedMotion ? 'none' : 'constellationHintPulse 1.6s ease-in-out infinite');
      element.style.background = 'var(--constellation-card-bg)';
      element.style.border = `2px solid var(--constellation-card-border)`;
      element.style.color = 'var(--constellation-card-text)';
    }

    if (this.messageElement) {
      this.messageElement.style.color = 'var(--constellation-card-text)';
    }
    if (this.statusElement) {
      this.statusElement.style.background = 'var(--constellation-status-bg)';
      this.statusElement.style.color = 'var(--constellation-status-text)';
      this.statusElement.style.border = this.highContrast ? '2px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)';
    }
    if (pointer) {
      pointer.style.background = this.highContrast
        ? 'linear-gradient(135deg, #ffffff 0%, #d6e4ff 100%)'
        : 'linear-gradient(135deg, #6ad7ff 0%, #9e8cff 33%, #ff7cc8 66%, #ffd86f 100%)';
      pointer.style.border = this.highContrast ? '3px solid #102040' : '3px solid rgba(255, 255, 255, 0.82)';
      pointer.style.color = this.highContrast ? '#102040' : '#102040';
      pointer.style.animation = reducedMotion ? 'none' : 'constellationPointerFloat 1.8s ease-in-out infinite';
      const label = pointer.lastElementChild as HTMLDivElement | null;
      if (label) {
        label.style.background = this.highContrast ? '#102040' : 'rgba(11, 24, 88, 0.94)';
        label.style.color = '#fffdf1';
        label.style.border = this.highContrast ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)';
      }
    }
  }

  private injectStyles(): void {
    if (document.getElementById(ConstellationHintOverlay.STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = ConstellationHintOverlay.STYLE_ID;
    style.textContent = `
      @keyframes constellationHintPulse {
        0%, 100% { opacity: 0.9; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.08); }
      }
      @keyframes constellationPointerFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      [data-constellation-minimap] .constellation-line-active {
        stroke: var(--constellation-line-active);
        stroke-width: 4;
        stroke-linecap: round;
      }
      [data-constellation-minimap] .constellation-line-faint {
        stroke: var(--constellation-line-faint);
        stroke-width: 3;
        stroke-dasharray: 6 8;
        stroke-linecap: round;
      }
      [data-constellation-minimap] .constellation-star-collected {
        fill: var(--constellation-star-collected);
        stroke: rgba(255, 255, 255, 0.95);
        stroke-width: 2;
      }
      [data-constellation-minimap] .constellation-star-next {
        fill: var(--constellation-star-next);
        stroke: rgba(255, 255, 255, 0.96);
        stroke-width: 2.5;
      }
      [data-constellation-minimap] .constellation-star-pending {
        fill: var(--constellation-star-pending);
        stroke: rgba(255, 255, 255, 0.4);
        stroke-width: 1.5;
      }
      [data-constellation-minimap] .constellation-star-ring {
        fill: none;
        stroke: var(--constellation-star-next);
        stroke-width: 4;
        animation: var(--constellation-pulse-animation);
        transform-origin: center;
      }
      [data-constellation-minimap] text {
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 10px;
        font-weight: 800;
        text-anchor: middle;
        dominant-baseline: central;
        fill: #102040;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  private buildGuideMessage(definition: ConstellationDefinition, collectedCount: number): string {
    const remaining = definition.points.length - collectedCount;
    if (collectedCount === 0) {
      return `${definition.reading} を つくろう！⭐`;
    }
    if (remaining <= 1) {
      return `${definition.reading} の さいごだよ！⭐`;
    }
    return `${definition.reading} の つぎは ここだよ！⭐`;
  }

  private buildGuideStatus(definition: ConstellationDefinition, collectedCount: number): string {
    const remaining = Math.max(0, definition.points.length - collectedCount);
    return remaining === 0 ? 'やったね！✨' : `あと${remaining}こ！`;
  }

  private buildMiniMapMarkup(definition: ConstellationDefinition, collectedCount: number): string {
    const points = definition.points;
    const width = 200;
    const height = 88;
    const paddingX = 22;
    const paddingY = 16;
    const xs = points.map((point) => point.x);
    const ys = points.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const scale = Math.min((width - paddingX * 2) / spanX, (height - paddingY * 2) / spanY);
    const usedWidth = spanX * scale;
    const usedHeight = spanY * scale;
    const offsetX = (width - usedWidth) / 2;
    const offsetY = (height - usedHeight) / 2;
    const mapPoint = (index: number): { x: number; y: number } => {
      const point = points[index];
      return {
        x: offsetX + (point.x - minX) * scale,
        y: height - (offsetY + (point.y - minY) * scale),
      };
    };

    const lineMarkup = points.slice(0, -1).map((_, index) => {
      const from = mapPoint(index);
      const to = mapPoint(index + 1);
      const className = index < collectedCount - 1 ? 'constellation-line-active' : 'constellation-line-faint';
      return `<line class="${className}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
    }).join('');

    const starMarkup = points.map((_, index) => {
      const point = mapPoint(index);
      const state = index < collectedCount
        ? 'collected'
        : index === collectedCount
          ? 'next'
          : 'pending';
      const starClass = `constellation-star-${state}`;
      const label = `${index + 1}`;
      const ring = state === 'next'
        ? `<circle data-constellation-next-star="" class="constellation-star-ring" cx="${point.x}" cy="${point.y}" r="14" />`
        : '';
      return `${ring}<circle data-constellation-star="${state}" class="${starClass}" cx="${point.x}" cy="${point.y}" r="7.5" /><text x="${point.x}" y="${point.y + 0.5}">${label}</text>`;
    }).join('');

    return `
      <rect x="3" y="3" width="194" height="82" rx="20" fill="var(--constellation-card-subtle)" />
      ${lineMarkup}
      ${starMarkup}
    `;
  }

  private isReducedMotion(): boolean {
    if (this.motionSensitivity === 'gentle' || this.motionSensitivity === 'minimal') {
      return true;
    }
    const mediaMatcher = globalThis.matchMedia;
    if (typeof mediaMatcher !== 'function') {
      return false;
    }
    try {
      return mediaMatcher('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  }
}
