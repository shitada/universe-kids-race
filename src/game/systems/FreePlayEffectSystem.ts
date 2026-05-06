import * as THREE from 'three';
import type { SpaceWeatherEventConfig, SpaceWeatherEventId } from '../../types';
import { SPACE_WEATHER_EVENT_CONFIGS } from '../config/SpaceWeatherEventConfig';
import { STAGE_SPECIAL_EVENT_CONFIGS } from '../config/StageSpecialEvents';
import { MeteoShowerEffect } from '../effects/MeteoShowerEffect';
import { RainbowTrailEffect } from '../effects/RainbowTrailEffect';
import { SpaceWeatherEffect } from '../effects/SpaceWeatherEffect';
import { StageSpecialEffects } from '../effects/StageSpecialEffects';

export interface FreePlayEffectState {
  meteorShowerActive: boolean;
  activeWeatherId: SpaceWeatherEventId | null;
  activeSpecialEventId: string | null;
  rainbowTrailActive: boolean;
}

interface FreePlayEffectSystemOptions {
  randomProvider?: () => number;
}

export class FreePlayEffectSystem {
  private static readonly METEOR_DELAY_MIN = 8;
  private static readonly METEOR_DELAY_RANGE = 6;
  private static readonly METEOR_DURATION = 4.5;
  private static readonly WEATHER_DELAY_MIN = 11;
  private static readonly WEATHER_DELAY_RANGE = 7;
  private static readonly SPECIAL_DELAY_MIN = 9;
  private static readonly SPECIAL_DELAY_RANGE = 6;
  private static readonly RAINBOW_DELAY_MIN = 6;
  private static readonly RAINBOW_DELAY_RANGE = 6;

  private readonly meteoShowerEffect = new MeteoShowerEffect();
  private readonly spaceWeatherEffect = new SpaceWeatherEffect();
  private readonly stageSpecialEffects = new StageSpecialEffects();
  private readonly rainbowTrailEffect = new RainbowTrailEffect();
  private readonly randomProvider: () => number;
  private scene: THREE.Scene | null = null;
  private currentStageNumber = 1;
  private meteorTimeRemaining = 0;
  private weatherTimeRemaining = 0;
  private specialTimeRemaining = 0;
  private nextMeteorDelay = 0;
  private nextWeatherDelay = 0;
  private nextSpecialDelay = 0;
  private nextRainbowDelay = 0;
  private activeWeather: SpaceWeatherEventConfig | null = null;
  private activeSpecialEventId: string | null = null;

  constructor(options: FreePlayEffectSystemOptions = {}) {
    this.randomProvider = options.randomProvider ?? Math.random;
    this.resetTimers();
  }

  init(scene: THREE.Scene): void {
    if (this.scene === scene) {
      return;
    }
    this.scene = scene;
    this.meteoShowerEffect.init(scene);
    this.spaceWeatherEffect.init(scene);
    this.stageSpecialEffects.init(scene);
    scene.add(this.rainbowTrailEffect.group);
  }

  setCurrentStage(stageNumber: number): void {
    this.currentStageNumber = stageNumber;
  }

  update(deltaTime: number, shipPosition: THREE.Vector3Like): FreePlayEffectState {
    const safeDelta = Math.max(0, deltaTime);

    this.updateMeteorShower(safeDelta);
    this.updateSpaceWeather(safeDelta);
    this.updateStageSpecial(safeDelta);
    this.updateRainbowTrail(safeDelta, shipPosition);

    this.meteoShowerEffect.update(this.meteorTimeRemaining > 0, safeDelta, shipPosition.x, shipPosition.z);
    this.spaceWeatherEffect.update(this.activeWeather !== null, safeDelta, shipPosition.x, shipPosition.z);
    this.stageSpecialEffects.update(this.activeSpecialEventId !== null, safeDelta, shipPosition.x, shipPosition.z);

    return this.getState();
  }

  getState(): FreePlayEffectState {
    return {
      meteorShowerActive: this.meteorTimeRemaining > 0,
      activeWeatherId: this.activeWeather?.id ?? null,
      activeSpecialEventId: this.activeSpecialEventId,
      rainbowTrailActive: this.rainbowTrailEffect.isActive(),
    };
  }

  clear(): void {
    this.meteorTimeRemaining = 0;
    this.weatherTimeRemaining = 0;
    this.specialTimeRemaining = 0;
    this.activeWeather = null;
    this.activeSpecialEventId = null;
    this.meteoShowerEffect.clear();
    this.spaceWeatherEffect.clear();
    this.stageSpecialEffects.clear();
    this.rainbowTrailEffect.clear();
    this.resetTimers();
  }

  dispose(): void {
    this.clear();
    this.meteoShowerEffect.dispose();
    this.rainbowTrailEffect.dispose();
  }

  private updateMeteorShower(deltaTime: number): void {
    if (this.meteorTimeRemaining > 0) {
      this.meteorTimeRemaining = Math.max(0, this.meteorTimeRemaining - deltaTime);
      return;
    }

    this.nextMeteorDelay -= deltaTime;
    if (this.nextMeteorDelay > 0) {
      return;
    }

    this.meteorTimeRemaining = FreePlayEffectSystem.METEOR_DURATION;
    this.nextMeteorDelay = this.sampleDelay(
      FreePlayEffectSystem.METEOR_DELAY_MIN,
      FreePlayEffectSystem.METEOR_DELAY_RANGE,
    );
    this.meteoShowerEffect.start();
  }

  private updateSpaceWeather(deltaTime: number): void {
    if (this.weatherTimeRemaining > 0 && this.activeWeather) {
      this.weatherTimeRemaining = Math.max(0, this.weatherTimeRemaining - deltaTime);
      if (this.weatherTimeRemaining === 0) {
        this.activeWeather = null;
      }
      return;
    }

    this.nextWeatherDelay -= deltaTime;
    if (this.nextWeatherDelay > 0) {
      return;
    }

    this.activeWeather = this.pickSpaceWeatherEvent();
    this.weatherTimeRemaining = this.activeWeather.duration;
    this.nextWeatherDelay = this.sampleDelay(
      FreePlayEffectSystem.WEATHER_DELAY_MIN,
      FreePlayEffectSystem.WEATHER_DELAY_RANGE,
    );
    this.spaceWeatherEffect.start(this.activeWeather);
  }

  private updateStageSpecial(deltaTime: number): void {
    if (this.specialTimeRemaining > 0 && this.activeSpecialEventId) {
      this.specialTimeRemaining = Math.max(0, this.specialTimeRemaining - deltaTime);
      if (this.specialTimeRemaining === 0) {
        this.activeSpecialEventId = null;
      }
      return;
    }

    this.nextSpecialDelay -= deltaTime;
    if (this.nextSpecialDelay > 0) {
      return;
    }

    const event = this.pickStageSpecialEvent();
    this.activeSpecialEventId = event.id;
    this.specialTimeRemaining = event.duration;
    this.nextSpecialDelay = this.sampleDelay(
      FreePlayEffectSystem.SPECIAL_DELAY_MIN,
      FreePlayEffectSystem.SPECIAL_DELAY_RANGE,
    );
    this.stageSpecialEffects.start(event);
  }

  private updateRainbowTrail(deltaTime: number, shipPosition: THREE.Vector3Like): void {
    let startedThisFrame = false;
    if (!this.rainbowTrailEffect.isActive()) {
      this.nextRainbowDelay -= deltaTime;
      if (this.nextRainbowDelay <= 0) {
        this.nextRainbowDelay = this.sampleDelay(
          FreePlayEffectSystem.RAINBOW_DELAY_MIN,
          FreePlayEffectSystem.RAINBOW_DELAY_RANGE,
        );
        this.rainbowTrailEffect.start(shipPosition);
        startedThisFrame = true;
      }
    }

    this.rainbowTrailEffect.update(startedThisFrame ? 0 : deltaTime, shipPosition);
  }

  private pickSpaceWeatherEvent(): SpaceWeatherEventConfig {
    const index = Math.min(
      SPACE_WEATHER_EVENT_CONFIGS.length - 1,
      Math.floor(this.randomProvider() * SPACE_WEATHER_EVENT_CONFIGS.length),
    );
    return SPACE_WEATHER_EVENT_CONFIGS[index];
  }

  private pickStageSpecialEvent() {
    const candidates = STAGE_SPECIAL_EVENT_CONFIGS.filter(
      (config) => config.stageNumber === this.currentStageNumber,
    );
    const pool = candidates.length > 0 ? candidates : STAGE_SPECIAL_EVENT_CONFIGS;
    const index = Math.min(pool.length - 1, Math.floor(this.randomProvider() * pool.length));
    return pool[index];
  }

  private resetTimers(): void {
    this.nextMeteorDelay = this.sampleDelay(
      FreePlayEffectSystem.METEOR_DELAY_MIN,
      FreePlayEffectSystem.METEOR_DELAY_RANGE,
    );
    this.nextWeatherDelay = this.sampleDelay(
      FreePlayEffectSystem.WEATHER_DELAY_MIN,
      FreePlayEffectSystem.WEATHER_DELAY_RANGE,
    );
    this.nextSpecialDelay = this.sampleDelay(
      FreePlayEffectSystem.SPECIAL_DELAY_MIN,
      FreePlayEffectSystem.SPECIAL_DELAY_RANGE,
    );
    this.nextRainbowDelay = this.sampleDelay(
      FreePlayEffectSystem.RAINBOW_DELAY_MIN,
      FreePlayEffectSystem.RAINBOW_DELAY_RANGE,
    );
  }

  private sampleDelay(min: number, range: number): number {
    return min + this.randomProvider() * range;
  }
}
