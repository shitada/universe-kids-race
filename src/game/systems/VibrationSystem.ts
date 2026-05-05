import type { VibrationIntensity, VibrationPattern } from '../../types';

export type VibrationEvent =
  | 'starCollect'
  | 'rainbowCollect'
  | 'meteoriteHit'
  | 'boost'
  | 'stageClear';

interface VibrationEventConfig {
  pattern: VibrationPattern;
  priority: number;
}

const VIBRATION_EVENT_CONFIGS: Record<VibrationEvent, VibrationEventConfig> = {
  starCollect: { pattern: 50, priority: 1 },
  rainbowCollect: { pattern: 100, priority: 2 },
  meteoriteHit: { pattern: 200, priority: 3 },
  boost: { pattern: [100, 50, 100], priority: 2 },
  stageClear: { pattern: [100, 50, 100, 50, 150], priority: 4 },
};

type VibrationNavigator = Pick<Navigator, 'vibrate'> | null | undefined;
type VibrationFallbackHandler = ((event: VibrationEvent) => void) | null;

const VIBRATION_INTENSITY_MULTIPLIERS: Record<Exclude<VibrationIntensity, 'off'>, number> = {
  weak: 0.45,
  medium: 0.75,
  strong: 1,
};

function scalePattern(pattern: VibrationPattern, intensity: VibrationIntensity): VibrationPattern {
  if (intensity === 'off') {
    return 0;
  }
  const multiplier = VIBRATION_INTENSITY_MULTIPLIERS[intensity];
  const scaleValue = (value: number): number => Math.max(1, Math.round(value * multiplier));
  return Array.isArray(pattern) ? pattern.map(scaleValue) : scaleValue(pattern);
}

export class VibrationSystem {
  private enabled = true;
  private intensity: VibrationIntensity = 'strong';
  private lastTriggeredAt = -Infinity;
  private lastPriority = 0;
  private fallbackHandler: VibrationFallbackHandler = null;

  constructor(
    private readonly navigatorRef: VibrationNavigator = globalThis.navigator,
    private readonly now: () => number = () => {
      const performanceApi = globalThis.performance;
      return typeof performanceApi?.now === 'function' ? performanceApi.now() : Date.now();
    },
    private readonly minIntervalMs = 75,
  ) {}

  static getPattern(event: VibrationEvent): VibrationPattern {
    return VIBRATION_EVENT_CONFIGS[event].pattern;
  }

  isSupported(): boolean {
    return typeof this.navigatorRef?.vibrate === 'function';
  }

  isEnabled(): boolean {
    return this.enabled && this.intensity !== 'off';
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  getIntensity(): VibrationIntensity {
    return this.intensity;
  }

  setIntensity(intensity: VibrationIntensity): void {
    this.intensity = intensity;
    this.enabled = intensity !== 'off';
    if (intensity === 'off') {
      this.lastPriority = 0;
    }
  }

  setFallbackHandler(handler: VibrationFallbackHandler): void {
    this.fallbackHandler = handler;
  }

  trigger(event: VibrationEvent): boolean {
    const config = VIBRATION_EVENT_CONFIGS[event];
    return this.vibrate(config.pattern, config.priority, event);
  }

  vibrate(pattern: VibrationPattern, priority = 0, event?: VibrationEvent): boolean {
    if (!this.enabled || this.intensity === 'off') {
      return false;
    }

    const now = this.now();
    if (now - this.lastTriggeredAt < this.minIntervalMs && priority <= this.lastPriority) {
      return false;
    }

    const commitTrigger = (): void => {
      this.lastTriggeredAt = now;
      this.lastPriority = priority;
    };

    if (!this.isSupported()) {
      if (event && this.fallbackHandler) {
        commitTrigger();
        this.fallbackHandler(event);
        return true;
      }
      return false;
    }

    const didVibrate = this.navigatorRef!.vibrate(scalePattern(pattern, this.intensity));
    if (didVibrate) {
      commitTrigger();
      return true;
    }

    if (event && this.fallbackHandler) {
      commitTrigger();
      this.fallbackHandler(event);
      return true;
    }

    return false;
  }

  cancel(): boolean {
    if (!this.isSupported()) {
      return false;
    }

    this.lastPriority = 0;
    return this.navigatorRef!.vibrate(0);
  }
}

let sharedVibrationSystem: VibrationSystem | null = null;

export function getSharedVibrationSystem(): VibrationSystem {
  if (!sharedVibrationSystem) {
    sharedVibrationSystem = new VibrationSystem();
  }
  return sharedVibrationSystem;
}

export function triggerSharedVibration(event: VibrationEvent): boolean {
  return getSharedVibrationSystem().trigger(event);
}

export function setSharedVibrationEnabled(enabled: boolean): void {
  getSharedVibrationSystem().setEnabled(enabled);
}

export function setSharedVibrationIntensity(intensity: VibrationIntensity): void {
  getSharedVibrationSystem().setIntensity(intensity);
}

export function setSharedVibrationFallbackHandler(handler: VibrationFallbackHandler): void {
  getSharedVibrationSystem().setFallbackHandler(handler);
}

export function __setSharedVibrationSystemForTest(system: VibrationSystem | null): void {
  sharedVibrationSystem = system;
}
