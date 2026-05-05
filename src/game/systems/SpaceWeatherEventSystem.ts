import type { SpaceWeatherEventConfig, SpaceWeatherEventState } from '../../types';
import { SPACE_WEATHER_EVENT_CONFIGS } from '../config/SpaceWeatherEventConfig';

export class SpaceWeatherEventSystem {
  private static readonly MIN_DELAY = 18;
  private static readonly DELAY_RANGE = 16;

  private timeUntilNextEvent: number;
  private activeTimeRemaining = 0;
  private activeEvent: SpaceWeatherEventConfig | null = null;

  constructor(private readonly randomProvider: () => number = Math.random) {
    this.timeUntilNextEvent = this.sampleDelay();
  }

  update(deltaTime: number): SpaceWeatherEventState {
    let started = false;
    let ended = false;
    let remainingDelta = Math.max(0, deltaTime);

    if (this.activeTimeRemaining > 0 && this.activeEvent) {
      this.activeTimeRemaining -= remainingDelta;
      if (this.activeTimeRemaining <= 0) {
        ended = true;
        this.activeTimeRemaining = 0;
        this.activeEvent = null;
        this.timeUntilNextEvent = this.sampleDelay();
      }
      return this.buildState(started, ended);
    }

    this.timeUntilNextEvent -= remainingDelta;
    if (this.timeUntilNextEvent <= 0) {
      started = true;
      remainingDelta = -this.timeUntilNextEvent;
      this.activeEvent = this.sampleEvent();
      this.activeTimeRemaining = this.activeEvent.duration - remainingDelta;
      if (this.activeTimeRemaining <= 0) {
        ended = true;
        this.activeTimeRemaining = 0;
        this.activeEvent = null;
        this.timeUntilNextEvent = this.sampleDelay();
      } else {
        this.timeUntilNextEvent = 0;
      }
    }

    return this.buildState(started, ended);
  }

  reset(): void {
    this.activeTimeRemaining = 0;
    this.activeEvent = null;
    this.timeUntilNextEvent = this.sampleDelay();
  }

  isActive(): boolean {
    return this.activeTimeRemaining > 0 && this.activeEvent !== null;
  }

  getActiveEvent(): SpaceWeatherEventConfig | null {
    return this.activeEvent;
  }

  private buildState(started: boolean, ended: boolean): SpaceWeatherEventState {
    return {
      active: this.isActive(),
      started,
      ended,
      timeRemaining: this.activeTimeRemaining,
      event: this.activeEvent,
    };
  }

  private sampleDelay(): number {
    return SpaceWeatherEventSystem.MIN_DELAY + this.randomProvider() * SpaceWeatherEventSystem.DELAY_RANGE;
  }

  private sampleEvent(): SpaceWeatherEventConfig {
    const index = Math.min(
      SPACE_WEATHER_EVENT_CONFIGS.length - 1,
      Math.floor(this.randomProvider() * SPACE_WEATHER_EVENT_CONFIGS.length),
    );
    return SPACE_WEATHER_EVENT_CONFIGS[index];
  }
}
