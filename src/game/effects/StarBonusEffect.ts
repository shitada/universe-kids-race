import * as THREE from 'three';
import type { BonusStarState } from '../../types';

const SHARED_GEOMETRY = new THREE.IcosahedronGeometry(0.48, 0);
const SHARED_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xffef85,
  emissive: 0xffd24d,
  emissiveIntensity: 0.55,
});

export class StarBonusEffect {
  private static readonly MAX_STARS = 12;
  private static readonly SPAWN_INTERVAL = 0.4;

  private scene: THREE.Scene | null = null;
  private stars: BonusStarState[] = [];
  private spawnTimer = 0;
  private anchorZ = -6;
  private active = false;

  init(scene: THREE.Scene): void {
    this.scene = scene;
  }

  start(anchorZ: number): void {
    this.clear();
    this.anchorZ = anchorZ - 6;
    this.spawnTimer = 0;
    this.active = true;

    for (let i = 0; i < 4; i++) {
      this.spawnStar();
    }
  }

  update(deltaTime: number, shipZ: number): void {
    if (!this.active) {
      return;
    }

    this.anchorZ = shipZ - 6;
    this.spawnTimer += deltaTime;
    while (this.spawnTimer >= StarBonusEffect.SPAWN_INTERVAL && this.stars.length < StarBonusEffect.MAX_STARS) {
      this.spawnTimer -= StarBonusEffect.SPAWN_INTERVAL;
      this.spawnStar();
    }

    const retained: BonusStarState[] = [];
    for (const star of this.stars) {
      if (star.isCollected) {
        this.removeStarMesh(star);
        continue;
      }

      star.position.y -= star.velocityY * deltaTime;
      star.position.z = this.anchorZ;
      star.position.x += Math.sin((performance.now() / 1000) * 1.8 + star.driftPhase) * 0.12 * deltaTime;
      star.mesh.rotation.x += star.rotationSpeed * deltaTime;
      star.mesh.rotation.y += star.rotationSpeed * 1.3 * deltaTime;

      if (star.position.y < -4.8) {
        this.removeStarMesh(star);
        continue;
      }

      retained.push(star);
    }

    this.stars = retained;
  }

  getStars(): readonly BonusStarState[] {
    return this.stars;
  }

  consumeCollectedStars(collectedStars: readonly BonusStarState[]): void {
    if (collectedStars.length === 0) {
      return;
    }

    const collectedSet = new Set(collectedStars);
    this.stars = this.stars.filter((star) => {
      if (!collectedSet.has(star)) {
        return true;
      }
      this.removeStarMesh(star);
      return false;
    });
  }

  clear(): void {
    for (const star of this.stars) {
      this.removeStarMesh(star);
    }
    this.stars = [];
    this.spawnTimer = 0;
    this.active = false;
  }

  private spawnStar(): void {
    if (!this.scene || this.stars.length >= StarBonusEffect.MAX_STARS) {
      return;
    }

    const mesh = new THREE.Mesh(SHARED_GEOMETRY, SHARED_MATERIAL);
    mesh.position.set(
      (Math.random() * 14) - 7,
      3.8 + Math.random() * 3.6,
      this.anchorZ,
    );
    mesh.scale.setScalar(0.92 + Math.random() * 0.4);

    const star: BonusStarState = {
      mesh,
      position: mesh.position,
      velocityY: 0.95 + Math.random() * 0.55,
      driftPhase: Math.random() * Math.PI * 2,
      rotationSpeed: 1.8 + Math.random() * 1.2,
      isCollected: false,
    };

    this.stars.push(star);
    this.scene.add(mesh);
  }

  private removeStarMesh(star: BonusStarState): void {
    star.mesh.parent?.remove(star.mesh);
  }
}
