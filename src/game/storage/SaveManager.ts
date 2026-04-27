import type { SaveData } from '../../types';

const STORAGE_KEY = 'universe-kids-race-save';
const DEFAULT_DATA: SaveData = { clearedStage: 0, unlockedPlanets: [] };

export class SaveManager {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA, unlockedPlanets: [] };
      const data = JSON.parse(raw) as SaveData;
      if (typeof data.clearedStage !== 'number' || data.clearedStage < 0 || data.clearedStage > 11) {
        return { ...DEFAULT_DATA, unlockedPlanets: [] };
      }

      // Validate unlockedPlanets
      if (!Array.isArray(data.unlockedPlanets)) {
        data.unlockedPlanets = [];
      } else {
        data.unlockedPlanets = [...new Set(
          data.unlockedPlanets.filter(
            (v): v is number => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 11,
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
    } catch {
      /* ignore */
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
