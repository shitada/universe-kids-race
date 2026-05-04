import type {
  StageSpecialEventConfig,
  StageSpecialEventState,
} from '../../types';

export class StageSpecialEventSystem {
  private stageEvent: StageSpecialEventConfig | null = null;
  private activeTimeRemaining = 0;
  private hasTriggered = false;

  setStage(stageEvent: StageSpecialEventConfig | null): void {
    this.stageEvent = stageEvent;
    this.reset();
  }

  update(progress: number, deltaTime: number): StageSpecialEventState {
    const event = this.stageEvent;
    if (!event) {
      return this.buildState(false, false, null);
    }

    const safeDelta = Math.max(0, deltaTime);
    const safeProgress = Math.max(0, Math.min(1, progress));

    let started = false;
    let ended = false;

    if (this.activeTimeRemaining > 0) {
      this.activeTimeRemaining = Math.max(0, this.activeTimeRemaining - safeDelta);
      if (this.activeTimeRemaining === 0) {
        ended = true;
      }
      return this.buildState(started, ended, event);
    }

    if (!this.hasTriggered && safeProgress >= event.startProgress) {
      this.hasTriggered = true;
      this.activeTimeRemaining = event.duration;
      started = true;
    }

    return this.buildState(started, ended, started ? event : null);
  }

  reset(): void {
    this.activeTimeRemaining = 0;
    this.hasTriggered = false;
  }

  isActive(): boolean {
    return this.activeTimeRemaining > 0;
  }

  private buildState(
    started: boolean,
    ended: boolean,
    event: StageSpecialEventConfig | null,
  ): StageSpecialEventState {
    return {
      active: this.activeTimeRemaining > 0,
      started,
      ended,
      timeRemaining: this.activeTimeRemaining,
      event,
    };
  }
}
