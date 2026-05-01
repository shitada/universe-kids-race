import type { SaveData } from '../../types';
import { TOTAL_STAGES } from '../config/StageConfig';

const STORAGE_KEY = 'universe-kids-race-save';
const SESSION_KEY = 'universe-kids-race-session';
const DEFAULT_DATA: SaveData = { clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} };

function defaults(): SaveData {
  return { ...DEFAULT_DATA, unlockedPlanets: [], bestStageStars: {} };
}

// Returns a deep copy of SaveData. Uses structuredClone when available
// (modern iPad Safari, Node 17+, jsdom v22+), falling back to JSON round-trip
// for older test runners. Used to ensure callers can never mutate the
// in-memory cache held by SaveManager.
function cloneSaveData(src: SaveData): SaveData {
  const sc = (globalThis as { structuredClone?: (v: unknown) => unknown }).structuredClone;
  if (typeof sc === 'function') {
    return sc(src) as SaveData;
  }
  return JSON.parse(JSON.stringify(src)) as SaveData;
}

export class SaveManager {
  // In-memory cache of the validated SaveData. Populated lazily on the first
  // load() call and invalidated on save()/clear()/reset paths. This avoids
  // the per-call cost of localStorage.getItem + JSON.parse + full revalidation
  // (Constitution IV: 60fps on iPad Safari). Single-tab game; cross-tab
  // storage events are out of scope (YAGNI).
  private cached: SaveData | null = null;

  private loadFromStorage(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      const data = JSON.parse(raw) as SaveData;
      if (typeof data.clearedStage !== 'number' || data.clearedStage < 0 || data.clearedStage > TOTAL_STAGES) {
        return defaults();
      }

      // Validate unlockedPlanets
      if (!Array.isArray(data.unlockedPlanets)) {
        data.unlockedPlanets = [];
      } else {
        data.unlockedPlanets = [...new Set(
          data.unlockedPlanets.filter(
            (v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= TOTAL_STAGES,
          ),
        )];
      }

      // Validate muted (default false; backward compatible with saves missing the field)
      data.muted = data.muted === true;

      // Validate bestStageStars (backward compatible; missing or malformed → {})
      const rawBest = (data as { bestStageStars?: unknown }).bestStageStars;
      const validatedBest: Record<number, number> = {};
      if (rawBest && typeof rawBest === 'object' && !Array.isArray(rawBest)) {
        for (const [k, v] of Object.entries(rawBest as Record<string, unknown>)) {
          const stage = Number(k);
          if (
            Number.isInteger(stage) &&
            stage >= 1 &&
            stage <= TOTAL_STAGES &&
            String(stage) === k &&
            typeof v === 'number' &&
            Number.isInteger(v) &&
            v >= 0
          ) {
            validatedBest[stage] = v;
          }
        }
      }
      data.bestStageStars = validatedBest;

      // Validate lastStablePixelTier (backward compatible; missing/invalid → undefined).
      // No upper bound check here because MAX_TIER is a runtime concept derived
      // from devicePixelRatio in main.ts; callers clamp on read.
      const rawTier = (data as { lastStablePixelTier?: unknown }).lastStablePixelTier;
      if (
        typeof rawTier === 'number' &&
        Number.isInteger(rawTier) &&
        rawTier >= 0
      ) {
        data.lastStablePixelTier = rawTier;
      } else {
        delete (data as { lastStablePixelTier?: unknown }).lastStablePixelTier;
      }

      return data;
    } catch {
      return defaults();
    }
  }

  load(): SaveData {
    if (this.cached === null) {
      this.cached = this.loadFromStorage();
    }
    return cloneSaveData(this.cached);
  }

  save(data: SaveData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.cached = cloneSaveData(data);
    } catch (e) {
      // On failure, conservatively invalidate the cache so the next load()
      // re-reads from storage and reflects whatever actually persisted.
      this.cached = null;
      console.warn('SaveManager.save failed:', e);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.cached = null;
    } catch (e) {
      console.warn('SaveManager.clear failed:', e);
    }
  }

  // Resets progress data (clearedStage, unlockedPlanets) but preserves the
  // user's mute preference. Used on Safari new-session detection so that
  // parents' silent-environment setting survives swipe-to-close.
  resetSessionDataPreservingMuted(): void {
    try {
      const prev = this.load();
      const muted = prev.muted === true;
      const lastStablePixelTier = prev.lastStablePixelTier;
      this.clear();
      const next: SaveData = { clearedStage: 0, unlockedPlanets: [], muted, bestStageStars: {} };
      if (typeof lastStablePixelTier === 'number') {
        next.lastStablePixelTier = lastStablePixelTier;
      }
      this.save(next);
      // save() already updates this.cached, but explicitly reaffirm the
      // contract: after this call the cache must reflect the reset state.
      this.cached = cloneSaveData(next);
    } catch (e) {
      // Conservatively drop the cache so the next load() re-reads from
      // storage (which may be in an unknown intermediate state).
      this.cached = null;
      console.warn('SaveManager.resetSessionDataPreservingMuted failed:', e);
    }
  }

  // Updates the best (highest) star count for the given stage. Only persists
  // if the new count exceeds the previously stored value, so replays that
  // earn fewer stars never overwrite a child's best record.
  updateBestStageStars(stageNumber: number, starCount: number): void {
    if (
      !Number.isInteger(stageNumber) ||
      stageNumber < 1 ||
      stageNumber > TOTAL_STAGES ||
      !Number.isInteger(starCount) ||
      starCount < 0
    ) {
      return;
    }
    try {
      const data = this.load();
      const best = data.bestStageStars ?? {};
      const current = best[stageNumber] ?? 0;
      if (starCount > current) {
        best[stageNumber] = starCount;
        data.bestStageStars = best;
        this.save(data);
      }
    } catch (e) {
      console.warn('SaveManager.updateBestStageStars failed:', e);
    }
  }

  // Persists the last observed stable adaptive pixel-ratio tier so the next
  // launch can start at this level instead of MAX_TIER, avoiding the initial
  // downscale hitch on slower iPads (Constitution IV: 60fps on iPad Safari).
  // Validates the value (non-negative integer); negative / non-integer inputs
  // are ignored. The controller (caller) is responsible for upper-bound
  // clamping via its own maxTier knowledge.
  saveLastStablePixelTier(tier: number): void {
    if (!Number.isInteger(tier) || tier < 0) {
      return;
    }
    try {
      const data = this.load();
      if (data.lastStablePixelTier === tier) {
        return;
      }
      data.lastStablePixelTier = tier;
      this.save(data);
    } catch (e) {
      console.warn('SaveManager.saveLastStablePixelTier failed:', e);
    }
  }

  // Returns true if this is a fresh session (no session flag yet).
  // Safe against sessionStorage exceptions (iPad Safari private mode etc.).
  // Also marks the session as active as a side-effect.
  isFreshSession(): boolean {
    try {
      const fresh = !sessionStorage.getItem(SESSION_KEY);
      try {
        sessionStorage.setItem(SESSION_KEY, 'active');
      } catch (e) {
        console.warn('SaveManager.isFreshSession setItem failed:', e);
      }
      return fresh;
    } catch (e) {
      console.warn('SaveManager.isFreshSession getItem failed:', e);
      return false;
    }
  }
}
