import type { StageConfig } from '../../types';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';

export interface SpawnResult {
  newStars: Star[];
  newMeteorites: Meteorite[];
}

export class SpawnSystem {
  private lastStarSpawnZ = 0;
  private meteoriteTimer = 0;
  private spawnAheadDistance = 80;

  update(deltaTime: number, spaceshipZ: number, config: StageConfig): SpawnResult {
    const result: SpawnResult = { newStars: [], newMeteorites: [] };

    // Spawn stars ahead based on density
    const starSpacing = 100 / config.starDensity;
    const targetZ = spaceshipZ - this.spawnAheadDistance;

    while (this.lastStarSpawnZ > targetZ) {
      this.lastStarSpawnZ -= starSpacing;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 4;
      const isRainbow = Math.random() < 0.1;
      const star = new Star(x, y, this.lastStarSpawnZ, isRainbow ? 'RAINBOW' : 'NORMAL');
      result.newStars.push(star);
    }

    // Spawn meteorites based on interval
    this.meteoriteTimer += deltaTime;
    if (this.meteoriteTimer >= config.meteoriteInterval) {
      this.meteoriteTimer -= config.meteoriteInterval;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 3;
      const z = spaceshipZ - this.spawnAheadDistance - Math.random() * 20;
      const met = new Meteorite(x, y, z);
      result.newMeteorites.push(met);
    }

    return result;
  }

  reset(): void {
    this.lastStarSpawnZ = 0;
    this.meteoriteTimer = 0;
  }
}
