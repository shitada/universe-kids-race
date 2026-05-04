import {
  DEFAULT_SPACESHIP_CUSTOMIZATION,
  SPACESHIP_COLOR_KEYS,
  type SaveData,
  type SpaceshipColorKey,
  type SpaceshipCustomization,
} from '../../types';
import { TOTAL_STAGES } from '../config/StageConfig';

const STORAGE_KEY = 'universe-kids-race-save';
const SESSION_KEY = 'universe-kids-race-session';
const DEFAULT_DATA: SaveData = {
  clearedStage: 0,
  unlockedPlanets: [],
  muted: false,
  bestStageStars: {},
  tutorialShown: false,
  spaceshipCustomization: { ...DEFAULT_SPACESHIP_CUSTOMIZATION },
};

export type SessionState = 'fresh' | 'existing' | 'unavailable';

function defaults(): SaveData {
  return {
    ...DEFAULT_DATA,
    unlockedPlanets: [],
    bestStageStars: {},
    tutorialShown: false,
    spaceshipCustomization: { ...DEFAULT_SPACESHIP_CUSTOMIZATION },
  };
}

function cloneSaveData(src: SaveData): SaveData {
  const sc = (globalThis as { structuredClone?: (v: unknown) => unknown }).structuredClone;
  if (typeof sc === 'function') {
    return sc(src) as SaveData;
  }
  return JSON.parse(JSON.stringify(src)) as SaveData;
}

function isSpaceshipColorKey(value: unknown): value is SpaceshipColorKey {
  return typeof value === 'string' && (SPACESHIP_COLOR_KEYS as readonly string[]).includes(value);
}

function normalizeSpaceshipCustomization(value: unknown): SpaceshipCustomization {
  const customization = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Partial<Record<keyof SpaceshipCustomization, unknown>>
    : {};

  return {
    bodyColor: isSpaceshipColorKey(customization.bodyColor)
      ? customization.bodyColor
      : DEFAULT_SPACESHIP_CUSTOMIZATION.bodyColor,
    noseColor: isSpaceshipColorKey(customization.noseColor)
      ? customization.noseColor
      : DEFAULT_SPACESHIP_CUSTOMIZATION.noseColor,
    wingColor: isSpaceshipColorKey(customization.wingColor)
      ? customization.wingColor
      : DEFAULT_SPACESHIP_CUSTOMIZATION.wingColor,
  };
}

function sameCustomization(a: SpaceshipCustomization, b: SpaceshipCustomization): boolean {
  return a.bodyColor === b.bodyColor && a.noseColor === b.noseColor && a.wingColor === b.wingColor;
}

function sanitizeSaveData(data: SaveData): SaveData {
  const sanitized: SaveData = {
    clearedStage: Number.isInteger(data.clearedStage) && data.clearedStage >= 0 && data.clearedStage <= TOTAL_STAGES
      ? data.clearedStage
      : 0,
    unlockedPlanets: Array.isArray(data.unlockedPlanets)
      ? [...new Set(data.unlockedPlanets.filter(
        (value): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= TOTAL_STAGES,
      ))]
      : [],
    muted: data.muted === true,
    bestStageStars: {},
    tutorialShown: data.tutorialShown === true,
    spaceshipCustomization: normalizeSpaceshipCustomization(data.spaceshipCustomization),
  };

  if (data.colorAccessibility?.highContrast === true) {
    sanitized.colorAccessibility = { highContrast: true };
  }

  if (data.bestStageStars && typeof data.bestStageStars === 'object') {
    for (const [key, value] of Object.entries(data.bestStageStars)) {
      const stage = Number(key);
      if (Number.isInteger(stage) && stage >= 1 && stage <= TOTAL_STAGES && Number.isInteger(value) && value >= 0) {
        (sanitized.bestStageStars as Record<number, number>)[stage] = value;
      }
    }
  }

  if (typeof data.lastStablePixelTier === 'number' && Number.isInteger(data.lastStablePixelTier) && data.lastStablePixelTier >= 0) {
    sanitized.lastStablePixelTier = data.lastStablePixelTier;
  }

  return sanitized;
}

export class SaveManager {
  private cached: SaveData | null = null;

  private loadFromStorage(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      const data = JSON.parse(raw) as SaveData;
      if (typeof data.clearedStage !== 'number' || data.clearedStage < 0 || data.clearedStage > TOTAL_STAGES) {
        return defaults();
      }

      if (!Array.isArray(data.unlockedPlanets)) {
        data.unlockedPlanets = [];
      } else {
        data.unlockedPlanets = [...new Set(
          data.unlockedPlanets.filter(
            (v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= TOTAL_STAGES,
          ),
        )];
      }

      data.muted = data.muted === true;
      data.tutorialShown = data.tutorialShown === true;

      const rawColorAccessibility = (data as { colorAccessibility?: unknown }).colorAccessibility;
      if (rawColorAccessibility && typeof rawColorAccessibility === 'object' && !Array.isArray(rawColorAccessibility)) {
        const highContrast = (rawColorAccessibility as { highContrast?: unknown }).highContrast === true;
        if (highContrast) {
          data.colorAccessibility = { highContrast: true };
        } else {
          delete (data as { colorAccessibility?: unknown }).colorAccessibility;
        }
      } else {
        delete (data as { colorAccessibility?: unknown }).colorAccessibility;
      }

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

      data.spaceshipCustomization = normalizeSpaceshipCustomization(
        (data as { spaceshipCustomization?: unknown }).spaceshipCustomization,
      );

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
      const sanitized = sanitizeSaveData(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      this.cached = cloneSaveData(sanitized);
    } catch (e) {
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

  resetProgressPreservingSettings(): void {
    try {
      const prev = this.load();
      const muted = prev.muted === true;
      const lastStablePixelTier = prev.lastStablePixelTier;
      const tutorialShown = prev.tutorialShown === true;
      const colorAccessibility = prev.colorAccessibility?.highContrast === true
        ? { highContrast: true as const }
        : undefined;
      const spaceshipCustomization = normalizeSpaceshipCustomization(prev.spaceshipCustomization);
      this.clear();
      const next: SaveData = {
        clearedStage: 0,
        unlockedPlanets: [],
        muted,
        bestStageStars: {},
        tutorialShown,
        spaceshipCustomization,
      };
      if (colorAccessibility) {
        next.colorAccessibility = colorAccessibility;
      }
      if (typeof lastStablePixelTier === 'number') {
        next.lastStablePixelTier = lastStablePixelTier;
      }
      this.save(next);
      this.cached = cloneSaveData(next);
    } catch (e) {
      this.cached = null;
      console.warn('SaveManager.resetProgressPreservingSettings failed:', e);
    }
  }

  resetSessionDataPreservingMuted(): void {
    try {
      const prev = this.load();
      const muted = prev.muted === true;
      const lastStablePixelTier = prev.lastStablePixelTier;
      const colorAccessibility = prev.colorAccessibility?.highContrast === true
        ? { highContrast: true as const }
        : undefined;
      const spaceshipCustomization = normalizeSpaceshipCustomization(prev.spaceshipCustomization);
      this.clear();
      const next: SaveData = {
        clearedStage: 0,
        unlockedPlanets: [],
        muted,
        bestStageStars: {},
        tutorialShown: false,
        spaceshipCustomization,
      };
      if (colorAccessibility) {
        next.colorAccessibility = colorAccessibility;
      }
      if (typeof lastStablePixelTier === 'number') {
        next.lastStablePixelTier = lastStablePixelTier;
      }
      this.save(next);
      this.cached = cloneSaveData(next);
    } catch (e) {
      this.cached = null;
      console.warn('SaveManager.resetSessionDataPreservingMuted failed:', e);
    }
  }

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

  markStageCleared(stageNumber: number): boolean {
    if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > TOTAL_STAGES) {
      return false;
    }
    try {
      const data = this.load();
      const wasUnlocked = data.unlockedPlanets.includes(stageNumber);
      const nextClearedStage = Math.max(data.clearedStage, stageNumber);
      if (data.clearedStage === nextClearedStage && wasUnlocked) {
        return false;
      }
      data.clearedStage = nextClearedStage;
      if (!wasUnlocked) {
        data.unlockedPlanets.push(stageNumber);
      }
      this.save(data);
      return !wasUnlocked;
    } catch (e) {
      console.warn('SaveManager.markStageCleared failed:', e);
      return false;
    }
  }

  markTutorialShown(): void {
    try {
      const data = this.load();
      if (data.tutorialShown === true) {
        return;
      }
      data.tutorialShown = true;
      this.save(data);
    } catch (e) {
      console.warn('SaveManager.markTutorialShown failed:', e);
    }
  }

  saveSpaceshipCustomization(customization: SpaceshipCustomization): void {
    try {
      const data = this.load();
      const normalized = normalizeSpaceshipCustomization(customization);
      const current = normalizeSpaceshipCustomization(data.spaceshipCustomization);
      if (sameCustomization(current, normalized)) {
        return;
      }
      data.spaceshipCustomization = normalized;
      this.save(data);
    } catch (e) {
      console.warn('SaveManager.saveSpaceshipCustomization failed:', e);
    }
  }

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

  getSessionState(): SessionState {
    try {
      const fresh = !sessionStorage.getItem(SESSION_KEY);
      try {
        sessionStorage.setItem(SESSION_KEY, 'active');
      } catch (e) {
        console.warn('SaveManager.getSessionState setItem failed:', e);
        return 'unavailable';
      }
      return fresh ? 'fresh' : 'existing';
    } catch (e) {
      console.warn('SaveManager.getSessionState getItem failed:', e);
      return 'unavailable';
    }
  }
}
