import type { VibrationPattern } from '../../types';

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

export class VibrationSystem {
  private enabled = true;
  private lastTriggeredAt = -Infinity;
  private lastPriority = 0;

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
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  trigger(event: VibrationEvent): boolean {
    const config = VIBRATION_EVENT_CONFIGS[event];
    return this.vibrate(config.pattern, config.priority);
  }

  vibrate(pattern: VibrationPattern, priority = 0): boolean {
    if (!this.enabled || !this.isSupported()) {
      return false;
    }

    const now = this.now();
    if (now - this.lastTriggeredAt < this.minIntervalMs && priority <= this.lastPriority) {
      return false;
    }

    this.lastTriggeredAt = now;
    this.lastPriority = priority;
    return this.navigatorRef!.vibrate(pattern);
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

export function __setSharedVibrationSystemForTest(system: VibrationSystem | null): void {
  sharedVibrationSystem = system;
}
