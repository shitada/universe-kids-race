export interface MeteoShowerEventState {
  active: boolean;
  started: boolean;
  ended: boolean;
  timeRemaining: number;
}

export class MeteoShowerEventSystem {
  private static readonly MIN_DELAY = 22;
  private static readonly DELAY_RANGE = 18;
  private static readonly DURATION = 4.5;

  private timeUntilNextEvent = MeteoShowerEventSystem.sampleDelay();
  private activeTimeRemaining = 0;

  update(deltaTime: number): MeteoShowerEventState {
    let started = false;
    let ended = false;
    let remainingDelta = Math.max(0, deltaTime);

    if (this.activeTimeRemaining > 0) {
      this.activeTimeRemaining -= remainingDelta;
      if (this.activeTimeRemaining <= 0) {
        ended = true;
        this.activeTimeRemaining = 0;
        this.timeUntilNextEvent = MeteoShowerEventSystem.sampleDelay();
      }
      return this.buildState(started, ended);
    }

    this.timeUntilNextEvent -= remainingDelta;
    if (this.timeUntilNextEvent <= 0) {
      started = true;
      remainingDelta = -this.timeUntilNextEvent;
      this.activeTimeRemaining = MeteoShowerEventSystem.DURATION - remainingDelta;
      if (this.activeTimeRemaining <= 0) {
        ended = true;
        this.activeTimeRemaining = 0;
        this.timeUntilNextEvent = MeteoShowerEventSystem.sampleDelay();
      } else {
        this.timeUntilNextEvent = 0;
      }
    }

    return this.buildState(started, ended);
  }

  reset(): void {
    this.activeTimeRemaining = 0;
    this.timeUntilNextEvent = MeteoShowerEventSystem.sampleDelay();
  }

  isActive(): boolean {
    return this.activeTimeRemaining > 0;
  }

  private buildState(started: boolean, ended: boolean): MeteoShowerEventState {
    return {
      active: this.activeTimeRemaining > 0,
      started,
      ended,
      timeRemaining: this.activeTimeRemaining,
    };
  }

  private static sampleDelay(): number {
    return MeteoShowerEventSystem.MIN_DELAY + Math.random() * MeteoShowerEventSystem.DELAY_RANGE;
  }
}
