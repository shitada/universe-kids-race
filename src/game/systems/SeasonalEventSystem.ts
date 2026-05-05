import type { SeasonalEventConfig } from '../../types';
import { getSeasonalEventConfigForDate } from '../config/SeasonalEventConfig';

export class SeasonalEventSystem {
  private activeEvent: SeasonalEventConfig | null = null;

  constructor(private readonly dateProvider: () => Date = () => new Date()) {}

  refresh(date: Date = this.dateProvider()): SeasonalEventConfig | null {
    this.activeEvent = getSeasonalEventConfigForDate(date);
    return this.activeEvent;
  }

  getActiveEvent(): SeasonalEventConfig | null {
    return this.activeEvent;
  }

  isActive(): boolean {
    return this.activeEvent !== null;
  }

  clear(): void {
    this.activeEvent = null;
  }
}
