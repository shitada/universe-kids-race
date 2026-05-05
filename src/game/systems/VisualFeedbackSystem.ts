import type { VisualFeedbackIntensity } from '../../types';

export type VisualFeedbackEvent =
  | 'starCollect'
  | 'rainbowCollect'
  | 'constellationCelebrate'
  | 'meteoriteHit'
  | 'boost'
  | 'stageClear';

export interface VisualFeedbackEffect {
  event: VisualFeedbackEvent;
  durationMs: number;
  priority: number;
  overlayBackground: string;
  overlayOpacity: number;
  spaceshipScale: number;
}

interface VisualFeedbackConfig {
  durationMs: number;
  priority: number;
  overlayBackground: string;
  overlayOpacity: number;
  spaceshipScale: number;
}

export type VisualFeedbackHandler = ((effect: VisualFeedbackEffect) => void) | null;

const VISUAL_FEEDBACK_CONFIGS: Record<VisualFeedbackEvent, VisualFeedbackConfig> = {
  starCollect: {
    durationMs: 100,
    priority: 1,
    overlayBackground: 'linear-gradient(135deg, #ffffff, #fff7b0)',
    overlayOpacity: 0.28,
    spaceshipScale: 1.2,
  },
  rainbowCollect: {
    durationMs: 120,
    priority: 2,
    overlayBackground: 'linear-gradient(135deg, #ffffff, #ffd76f)',
    overlayOpacity: 0.34,
    spaceshipScale: 1.24,
  },
  constellationCelebrate: {
    durationMs: 180,
    priority: 4,
    overlayBackground: 'linear-gradient(135deg, #fff1a8, #8fe7ff)',
    overlayOpacity: 0.36,
    spaceshipScale: 1.18,
  },
  meteoriteHit: {
    durationMs: 200,
    priority: 3,
    overlayBackground: 'linear-gradient(135deg, #ff7b7b, #ff3d68)',
    overlayOpacity: 0.42,
    spaceshipScale: 1,
  },
  boost: {
    durationMs: 300,
    priority: 2,
    overlayBackground: 'linear-gradient(135deg, #63c7ff, #7b7dff)',
    overlayOpacity: 0.32,
    spaceshipScale: 1.16,
  },
  stageClear: {
    durationMs: 320,
    priority: 5,
    overlayBackground: 'linear-gradient(135deg, #fff27a, #76f0ff)',
    overlayOpacity: 0.36,
    spaceshipScale: 1.22,
  },
};

const INTENSITY_MULTIPLIERS: Record<Exclude<VisualFeedbackIntensity, 'off'>, number> = {
  weak: 0.45,
  medium: 0.75,
  strong: 1,
};

function resolveScale(baseScale: number, multiplier: number): number {
  return 1 + ((baseScale - 1) * multiplier);
}

export function getResolvedVisualFeedbackEffect(
  event: VisualFeedbackEvent,
  intensity: VisualFeedbackIntensity = 'strong',
): VisualFeedbackEffect {
  const config = VISUAL_FEEDBACK_CONFIGS[event];
  const multiplier = intensity === 'off' ? 0 : INTENSITY_MULTIPLIERS[intensity];
  return {
    event,
    durationMs: config.durationMs,
    priority: config.priority,
    overlayBackground: config.overlayBackground,
    overlayOpacity: Number((config.overlayOpacity * multiplier).toFixed(3)),
    spaceshipScale: Number(resolveScale(config.spaceshipScale, multiplier).toFixed(3)),
  };
}

export class VisualFeedbackSystem {
  private enabled = true;
  private intensity: VisualFeedbackIntensity = 'medium';
  private lastTriggeredAt = -Infinity;
  private lastPriority = 0;
  private handler: VisualFeedbackHandler = null;

  constructor(
    private readonly now: () => number = () => {
      const performanceApi = globalThis.performance;
      return typeof performanceApi?.now === 'function' ? performanceApi.now() : Date.now();
    },
    private readonly minIntervalMs = 75,
  ) {}

  static getEffect(
    event: VisualFeedbackEvent,
    intensity: VisualFeedbackIntensity = 'strong',
  ): VisualFeedbackEffect {
    return getResolvedVisualFeedbackEffect(event, intensity);
  }

  isEnabled(): boolean {
    return this.enabled && this.intensity !== 'off';
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  getIntensity(): VisualFeedbackIntensity {
    return this.intensity;
  }

  setIntensity(intensity: VisualFeedbackIntensity): void {
    this.intensity = intensity;
    this.enabled = intensity !== 'off';
    if (intensity === 'off') {
      this.lastPriority = 0;
    }
  }

  setHandler(handler: VisualFeedbackHandler): void {
    this.handler = handler;
  }

  trigger(event: VisualFeedbackEvent): boolean {
    if (!this.enabled || this.intensity === 'off' || !this.handler) {
      return false;
    }

    const effect = getResolvedVisualFeedbackEffect(event, this.intensity);
    const now = this.now();
    if (now - this.lastTriggeredAt < this.minIntervalMs && effect.priority <= this.lastPriority) {
      return false;
    }

    this.lastTriggeredAt = now;
    this.lastPriority = effect.priority;
    this.handler(effect);
    return true;
  }
}

let sharedVisualFeedbackSystem: VisualFeedbackSystem | null = null;

export function getSharedVisualFeedbackSystem(): VisualFeedbackSystem {
  if (!sharedVisualFeedbackSystem) {
    sharedVisualFeedbackSystem = new VisualFeedbackSystem();
  }
  return sharedVisualFeedbackSystem;
}

export function triggerSharedVisualFeedback(event: VisualFeedbackEvent): boolean {
  return getSharedVisualFeedbackSystem().trigger(event);
}

export function setSharedVisualFeedbackEnabled(enabled: boolean): void {
  getSharedVisualFeedbackSystem().setEnabled(enabled);
}

export function setSharedVisualFeedbackIntensity(intensity: VisualFeedbackIntensity): void {
  getSharedVisualFeedbackSystem().setIntensity(intensity);
}

export function setSharedVisualFeedbackHandler(handler: VisualFeedbackHandler): void {
  getSharedVisualFeedbackSystem().setHandler(handler);
}

export function __setSharedVisualFeedbackSystemForTest(system: VisualFeedbackSystem | null): void {
  sharedVisualFeedbackSystem = system;
}
