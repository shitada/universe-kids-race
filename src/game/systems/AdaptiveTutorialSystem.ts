export type AdaptiveTutorialHintType = 'meteorite' | 'stars' | 'boost';

export interface AdaptiveTutorialMeteoriteSnapshot {
  position: {
    x: number;
    z: number;
  };
  isActive: boolean;
}

export interface AdaptiveTutorialFrame {
  deltaTime: number;
  moveDirection: -1 | 0 | 1;
  shipX: number;
  shipZ: number;
  boostAvailable: boolean;
  boostActive: boolean;
  meteorites: ReadonlyArray<AdaptiveTutorialMeteoriteSnapshot>;
}

export interface AdaptiveTutorialEvent {
  type: AdaptiveTutorialHintType;
  message: string;
}

export class AdaptiveTutorialSystem {
  static readonly MAX_HINTS_PER_TYPE = 3;
  static readonly METEORITE_HINT_MESSAGE = 'ひだりみぎで よけよう！';
  static readonly STAR_HINT_MESSAGE = 'きらきら あつめよう⭐';
  static readonly BOOST_HINT_MESSAGE = 'ブーストを つかってみよう！';

  private static readonly GLOBAL_HINT_COOLDOWN = 8;
  private static readonly METEORITE_IDLE_THRESHOLD = 3;
  private static readonly METEORITE_LOOKAHEAD = 180;
  private static readonly METEORITE_LATERAL_RANGE = 2.8;
  private static readonly MISSED_STAR_THRESHOLD = 5;
  private static readonly BOOST_IDLE_THRESHOLD = 30;

  private hintCounts: Record<AdaptiveTutorialHintType, number> = {
    meteorite: 0,
    stars: 0,
    boost: 0,
  };
  private globalHintCooldown = 0;
  private meteoriteIdleTimer = 0;
  private waitingForMeteoriteReset = false;
  private missedStars = 0;
  private boostReadyTimer = 0;

  reset(): void {
    this.hintCounts = {
      meteorite: 0,
      stars: 0,
      boost: 0,
    };
    this.globalHintCooldown = 0;
    this.meteoriteIdleTimer = 0;
    this.waitingForMeteoriteReset = false;
    this.missedStars = 0;
    this.boostReadyTimer = 0;
  }

  update(frame: AdaptiveTutorialFrame): AdaptiveTutorialEvent | null {
    this.globalHintCooldown = Math.max(0, this.globalHintCooldown - frame.deltaTime);

    const meteoriteHint = this.updateMeteoriteHint(frame);
    if (meteoriteHint) {
      return meteoriteHint;
    }

    if (this.missedStars >= AdaptiveTutorialSystem.MISSED_STAR_THRESHOLD) {
      const starHint = this.emitHint('stars', AdaptiveTutorialSystem.STAR_HINT_MESSAGE);
      if (starHint) {
        this.missedStars = 0;
        return starHint;
      }
    }

    return this.updateBoostHint(frame);
  }

  recordMissedStars(count = 1): void {
    if (count <= 0) {
      return;
    }
    this.missedStars += count;
  }

  recordBoostUsed(): void {
    this.boostReadyTimer = 0;
  }

  getHintCount(type: AdaptiveTutorialHintType): number {
    return this.hintCounts[type];
  }

  private updateMeteoriteHint(frame: AdaptiveTutorialFrame): AdaptiveTutorialEvent | null {
    const hasThreat = frame.meteorites.some((meteorite) =>
      this.isMeteoriteThreat(meteorite, frame.shipX, frame.shipZ),
    );

    if (!hasThreat) {
      this.meteoriteIdleTimer = 0;
      this.waitingForMeteoriteReset = false;
      return null;
    }

    if (this.waitingForMeteoriteReset) {
      return null;
    }

    if (frame.moveDirection !== 0) {
      this.meteoriteIdleTimer = 0;
      return null;
    }

    this.meteoriteIdleTimer += frame.deltaTime;
    if (this.meteoriteIdleTimer < AdaptiveTutorialSystem.METEORITE_IDLE_THRESHOLD) {
      return null;
    }

    const event = this.emitHint('meteorite', AdaptiveTutorialSystem.METEORITE_HINT_MESSAGE);
    if (event) {
      this.meteoriteIdleTimer = 0;
      this.waitingForMeteoriteReset = true;
    }
    return event;
  }

  private updateBoostHint(frame: AdaptiveTutorialFrame): AdaptiveTutorialEvent | null {
    if (!frame.boostAvailable || frame.boostActive) {
      this.boostReadyTimer = 0;
      return null;
    }

    this.boostReadyTimer += frame.deltaTime;
    if (this.boostReadyTimer < AdaptiveTutorialSystem.BOOST_IDLE_THRESHOLD) {
      return null;
    }

    const event = this.emitHint('boost', AdaptiveTutorialSystem.BOOST_HINT_MESSAGE);
    if (event) {
      this.boostReadyTimer = 0;
    }
    return event;
  }

  private emitHint(type: AdaptiveTutorialHintType, message: string): AdaptiveTutorialEvent | null {
    if (this.globalHintCooldown > 0) {
      return null;
    }
    if (this.hintCounts[type] >= AdaptiveTutorialSystem.MAX_HINTS_PER_TYPE) {
      return null;
    }

    this.hintCounts[type] += 1;
    this.globalHintCooldown = AdaptiveTutorialSystem.GLOBAL_HINT_COOLDOWN;
    return { type, message };
  }

  private isMeteoriteThreat(
    meteorite: AdaptiveTutorialMeteoriteSnapshot,
    shipX: number,
    shipZ: number,
  ): boolean {
    if (!meteorite.isActive) {
      return false;
    }

    const aheadDistance = shipZ - meteorite.position.z;
    if (
      aheadDistance < 0 ||
      aheadDistance > AdaptiveTutorialSystem.METEORITE_LOOKAHEAD
    ) {
      return false;
    }

    return Math.abs(shipX - meteorite.position.x) <= AdaptiveTutorialSystem.METEORITE_LATERAL_RANGE;
  }
}
