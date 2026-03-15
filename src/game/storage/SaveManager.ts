import type { SaveData } from '../../types';

const STORAGE_KEY = 'universe-kids-race-save';
const DEFAULT_DATA: SaveData = { clearedStage: 0 };

export class SaveManager {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA };
      const data = JSON.parse(raw) as SaveData;
      if (typeof data.clearedStage !== 'number' || data.clearedStage < 0 || data.clearedStage > 3) {
        return { ...DEFAULT_DATA };
      }
      return data;
    } catch {
      return { ...DEFAULT_DATA };
    }
  }

  save(data: SaveData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
