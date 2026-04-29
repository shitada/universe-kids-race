import type { SaveData } from '../../types';
import { TOTAL_STAGES } from '../config/StageConfig';

const STORAGE_KEY = 'universe-kids-race-save';
const SESSION_KEY = 'universe-kids-race-session';
const DEFAULT_DATA: SaveData = { clearedStage: 0, unlockedPlanets: [] };

export class SaveManager {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA, unlockedPlanets: [] };
      const data = JSON.parse(raw) as SaveData;
      if (typeof data.clearedStage !== 'number' || data.clearedStage < 0 || data.clearedStage > TOTAL_STAGES) {
        return { ...DEFAULT_DATA, unlockedPlanets: [] };
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

      return data;
    } catch {
      return { ...DEFAULT_DATA, unlockedPlanets: [] };
    }
  }

  save(data: SaveData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('SaveManager.save failed:', e);
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('SaveManager.clear failed:', e);
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
