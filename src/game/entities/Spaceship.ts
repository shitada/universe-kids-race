import * as THREE from 'three';
import type { SpeedState } from '../../types';

const BASE_SPEED = 50;
const LATERAL_SPEED = 15;
const SLOWDOWN_MULTIPLIER = 0.4;
const BOOST_MULTIPLIER = 2.0;
const SPEED_STATE_DURATION = 3.0;
const RECOVERY_DURATION = 1.0;

export class Spaceship {
  position = { x: 0, y: 0, z: 0 };
  speed = BASE_SPEED;
  speedState: SpeedState = 'NORMAL';
  speedStateTimer = 0;
  boundaryMin = -8;
  boundaryMax = 8;

  mesh: THREE.Group;
  private startZ = 0;

  constructor() {
    this.mesh = this.createMesh();
    this.startZ = this.position.z;
  }

  private createMesh(): THREE.Group {
    const group = new THREE.Group();

    // Body: cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.4, 0.6, 2, 8);
    const bodyMat = new THREE.MeshToonMaterial({ color: 0x4488ff });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Nose: cone
    const noseGeo = new THREE.ConeGeometry(0.4, 0.8, 8);
    const noseMat = new THREE.MeshToonMaterial({ color: 0xff6644 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -1.4;
    group.add(nose);

    // Wings
    const wingGeo = new THREE.BoxGeometry(2.4, 0.1, 0.8);
    const wingMat = new THREE.MeshToonMaterial({ color: 0x44aaff });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.z = 0.2;
    group.add(wings);

    return group;
  }

  moveLeft(deltaTime: number): void {
    this.position.x -= LATERAL_SPEED * deltaTime;
    this.position.x = Math.max(this.position.x, this.boundaryMin);
  }

  moveRight(deltaTime: number): void {
    this.position.x += LATERAL_SPEED * deltaTime;
    this.position.x = Math.min(this.position.x, this.boundaryMax);
  }

  getForwardSpeed(): number {
    switch (this.speedState) {
      case 'BOOST':
        return this.speed * BOOST_MULTIPLIER;
      case 'SLOWDOWN':
        return this.speed * SLOWDOWN_MULTIPLIER;
      case 'RECOVERING': {
        const progress = 1 - (this.speedStateTimer / RECOVERY_DURATION);
        const eased = 1 - (1 - progress) * (1 - progress);
        const multiplier = SLOWDOWN_MULTIPLIER + (1 - SLOWDOWN_MULTIPLIER) * eased;
        return this.speed * multiplier;
      }
      default:
        return this.speed;
    }
  }

  update(deltaTime: number): void {
    // Auto forward (negative z = into screen)
    this.position.z -= this.getForwardSpeed() * deltaTime;

    // Speed state timer
    if (this.speedState !== 'NORMAL') {
      this.speedStateTimer -= deltaTime;
      if (this.speedStateTimer <= 0) {
        if (this.speedState === 'SLOWDOWN') {
          this.speedState = 'RECOVERING';
          this.speedStateTimer = RECOVERY_DURATION;
        } else {
          this.speedState = 'NORMAL';
          this.speedStateTimer = 0;
        }
      }
    }

    // Sync mesh
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  onMeteoriteHit(): void {
    if (this.speedState === 'SLOWDOWN') return; // invincible during slowdown
    this.speedState = 'SLOWDOWN';
    this.speedStateTimer = SPEED_STATE_DURATION;
  }

  activateBoost(): void {
    this.speedState = 'BOOST';
    this.speedStateTimer = SPEED_STATE_DURATION;
  }

  cancelBoost(): void {
    if (this.speedState === 'BOOST') {
      this.speedState = 'SLOWDOWN';
      this.speedStateTimer = SPEED_STATE_DURATION;
    }
  }

  getProgress(stageLength: number): number {
    const distanceTraveled = Math.abs(this.position.z - this.startZ);
    return Math.min(distanceTraveled / stageLength, 1);
  }

  reset(): void {
    this.position = { x: 0, y: 0, z: 0 };
    this.startZ = 0;
    this.speedState = 'NORMAL';
    this.speedStateTimer = 0;
    this.mesh.position.set(0, 0, 0);
  }
}
