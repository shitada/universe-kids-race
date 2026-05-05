export type BackupSceneType = 'title' | 'stage' | 'freePlay' | 'ending' | 'unknown';

export interface GameStateBackupSnapshot {
  sceneType: BackupSceneType;
  stagePlaying: boolean;
  userPaused: boolean;
  savedAt: number;
  reason: 'visibilitychange' | 'pagehide' | 'blur';
}

export interface GameStateBackupOptions {
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  key?: string;
  now?: () => number;
  maxAgeMs?: number;
}

const DEFAULT_STORAGE_KEY = 'universe-kids-race-interruption-backup';
const DEFAULT_MAX_AGE_MS = 10 * 60 * 1000;

function isBackupSceneType(value: unknown): value is BackupSceneType {
  return value === 'title' || value === 'stage' || value === 'freePlay' || value === 'ending' || value === 'unknown';
}

function sanitizeSnapshot(value: unknown): GameStateBackupSnapshot | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const raw = value as Partial<Record<keyof GameStateBackupSnapshot, unknown>>;
  if (
    !isBackupSceneType(raw.sceneType) ||
    typeof raw.stagePlaying !== 'boolean' ||
    typeof raw.userPaused !== 'boolean' ||
    typeof raw.savedAt !== 'number' ||
    !Number.isFinite(raw.savedAt) ||
    (raw.reason !== 'visibilitychange' && raw.reason !== 'pagehide' && raw.reason !== 'blur')
  ) {
    return null;
  }

  return {
    sceneType: raw.sceneType,
    stagePlaying: raw.stagePlaying,
    userPaused: raw.userPaused,
    savedAt: raw.savedAt,
    reason: raw.reason,
  };
}

export class GameStateBackup {
  private readonly storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  private readonly key: string;
  private readonly now: () => number;
  private readonly maxAgeMs: number;

  constructor(options: GameStateBackupOptions = {}) {
    this.storage = options.storage ?? globalThis.sessionStorage ?? null;
    this.key = options.key ?? DEFAULT_STORAGE_KEY;
    this.now = options.now ?? (() => Date.now());
    this.maxAgeMs = options.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
  }

  save(snapshot: Omit<GameStateBackupSnapshot, 'savedAt'> & { savedAt?: number }): GameStateBackupSnapshot | null {
    if (!this.storage) {
      return null;
    }

    const normalized: GameStateBackupSnapshot = {
      sceneType: snapshot.sceneType,
      stagePlaying: snapshot.stagePlaying,
      userPaused: snapshot.userPaused,
      savedAt: snapshot.savedAt ?? this.now(),
      reason: snapshot.reason,
    };

    try {
      this.storage.setItem(this.key, JSON.stringify(normalized));
      return normalized;
    } catch (error) {
      console.warn('GameStateBackup.save failed:', error);
      return null;
    }
  }

  load(): GameStateBackupSnapshot | null {
    if (!this.storage) {
      return null;
    }

    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) {
        return null;
      }

      const snapshot = sanitizeSnapshot(JSON.parse(raw));
      if (!snapshot) {
        this.clear();
        return null;
      }
      return snapshot;
    } catch (error) {
      console.warn('GameStateBackup.load failed:', error);
      return null;
    }
  }

  loadRecent(): GameStateBackupSnapshot | null {
    const snapshot = this.load();
    if (!snapshot) {
      return null;
    }

    const ageMs = this.now() - snapshot.savedAt;
    if (ageMs < 0 || ageMs > this.maxAgeMs) {
      this.clear();
      return null;
    }

    return snapshot;
  }

  clear(): void {
    if (!this.storage) {
      return;
    }

    try {
      this.storage.removeItem(this.key);
    } catch (error) {
      console.warn('GameStateBackup.clear failed:', error);
    }
  }
}
