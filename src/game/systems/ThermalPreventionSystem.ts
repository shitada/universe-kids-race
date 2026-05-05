import {
  REST_REMINDER_STORAGE_KEY,
  REST_REMINDER_THRESHOLDS_MS,
} from '../config/RestReminderConfig';

export interface ThermalPreventionMilestone {
  level: number;
  thresholdMinutes: number;
  totalPlayTimeMs: number;
}

export interface ThermalPreventionSystemOptions {
  storage?: Pick<Storage, 'getItem' | 'setItem'> | null;
  storageKey?: string;
  thresholdsMs?: readonly number[];
  persistIntervalMs?: number;
  onMilestoneReached?: (milestone: ThermalPreventionMilestone) => void;
}

interface PersistedThermalPreventionState {
  totalPlayTimeMs: number;
  shownMilestoneLevels: number[];
}

const DEFAULT_PERSIST_INTERVAL_MS = 15 * 1000;

function sanitizePersistedState(value: unknown): PersistedThermalPreventionState | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const raw = value as Partial<PersistedThermalPreventionState>;
  if (
    typeof raw.totalPlayTimeMs !== 'number' ||
    !Number.isFinite(raw.totalPlayTimeMs) ||
    raw.totalPlayTimeMs < 0 ||
    !Array.isArray(raw.shownMilestoneLevels) ||
    raw.shownMilestoneLevels.some((level) => typeof level !== 'number' || !Number.isFinite(level) || level < 1)
  ) {
    return null;
  }

  return {
    totalPlayTimeMs: raw.totalPlayTimeMs,
    shownMilestoneLevels: Array.from(new Set(raw.shownMilestoneLevels.map((level) => Math.floor(level)))).sort((a, b) => a - b),
  };
}

export class ThermalPreventionSystem {
  private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null;
  private readonly storageKey: string;
  private readonly thresholdsMs: readonly number[];
  private readonly persistIntervalMs: number;
  private readonly onMilestoneReached: ((milestone: ThermalPreventionMilestone) => void) | null;
  private readonly shownMilestoneLevels = new Set<number>();

  private totalPlayTimeMs = 0;
  private unsavedPlayTimeMs = 0;

  constructor(options: ThermalPreventionSystemOptions = {}) {
    this.storage = options.storage ?? globalThis.sessionStorage ?? null;
    this.storageKey = options.storageKey ?? REST_REMINDER_STORAGE_KEY;
    this.thresholdsMs = (options.thresholdsMs ?? REST_REMINDER_THRESHOLDS_MS)
      .map((threshold) => Math.max(0, Math.floor(threshold)))
      .filter((threshold, index, list) => threshold > 0 && list.indexOf(threshold) === index)
      .sort((a, b) => a - b);
    this.persistIntervalMs = Math.max(1_000, Math.floor(options.persistIntervalMs ?? DEFAULT_PERSIST_INTERVAL_MS));
    this.onMilestoneReached = options.onMilestoneReached ?? null;

    const persistedState = this.loadPersistedState();
    if (persistedState) {
      this.totalPlayTimeMs = persistedState.totalPlayTimeMs;
      for (const level of persistedState.shownMilestoneLevels) {
        this.shownMilestoneLevels.add(level);
      }
    }
  }

  updateActivePlay(deltaSeconds: number): void {
    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
      return;
    }

    const deltaMs = deltaSeconds * 1000;
    this.totalPlayTimeMs += deltaMs;
    this.unsavedPlayTimeMs += deltaMs;

    const milestones: ThermalPreventionMilestone[] = [];
    for (let index = 0; index < this.thresholdsMs.length; index += 1) {
      const thresholdMs = this.thresholdsMs[index];
      const level = index + 1;
      if (this.totalPlayTimeMs < thresholdMs || this.shownMilestoneLevels.has(level)) {
        continue;
      }
      this.shownMilestoneLevels.add(level);
      milestones.push({
        level,
        thresholdMinutes: Math.round(thresholdMs / 60_000),
        totalPlayTimeMs: Math.max(thresholdMs, this.totalPlayTimeMs),
      });
    }

    if (milestones.length > 0 || this.unsavedPlayTimeMs >= this.persistIntervalMs) {
      this.persist();
    }

    for (const milestone of milestones) {
      this.onMilestoneReached?.(milestone);
    }
  }

  getPreventiveLevel(): number {
    let level = 0;
    for (const thresholdMs of this.thresholdsMs) {
      if (this.totalPlayTimeMs >= thresholdMs) {
        level += 1;
      }
    }
    return level;
  }

  getTotalPlayTimeMs(): number {
    return this.totalPlayTimeMs;
  }

  flush(): void {
    if (this.unsavedPlayTimeMs > 0) {
      this.persist();
    }
  }

  private loadPersistedState(): PersistedThermalPreventionState | null {
    if (!this.storage) {
      return null;
    }

    try {
      const raw = this.storage.getItem(this.storageKey);
      if (!raw) {
        return null;
      }
      return sanitizePersistedState(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  private persist(): void {
    if (!this.storage) {
      this.unsavedPlayTimeMs = 0;
      return;
    }

    try {
      this.storage.setItem(this.storageKey, JSON.stringify({
        totalPlayTimeMs: this.totalPlayTimeMs,
        shownMilestoneLevels: Array.from(this.shownMilestoneLevels).sort((a, b) => a - b),
      } satisfies PersistedThermalPreventionState));
      this.unsavedPlayTimeMs = 0;
    } catch {
      this.unsavedPlayTimeMs = 0;
    }
  }
}
