import * as THREE from 'three';
import type { SpeedState } from '../../types';
import { disposeObject3D } from '../utils/disposeObject3D';

const BASE_SPEED = 50;
const LATERAL_SPEED = 15;
const SLOWDOWN_MULTIPLIER = 0.4;
const BOOST_MULTIPLIER = 2.0;
const SPEED_STATE_DURATION = 3.0;
const RECOVERY_DURATION = 1.0;

const MAX_BANK = 0.35;
const BANK_SMOOTHING = 8;
const BANK_YAW_RATIO = 0.3;
const BANK_BOOST_SCALE = 1.2;
const BANK_SLOWDOWN_SCALE = 0.5;

export class Spaceship {
  position = { x: 0, y: 0, z: 0 };
  speed = BASE_SPEED;
  speedState: SpeedState = 'NORMAL';
  speedStateTimer = 0;
  boundaryMin = -8;
  boundaryMax = 8;

  mesh: THREE.Group;
  bankAngle = 0;
  bankTarget = 0;
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
    this.bankTarget = -this.getMaxBankForState();
  }

  moveRight(deltaTime: number): void {
    this.position.x += LATERAL_SPEED * deltaTime;
    this.position.x = Math.min(this.position.x, this.boundaryMax);
    this.bankTarget = this.getMaxBankForState();
  }

  private getMaxBankForState(): number {
    switch (this.speedState) {
      case 'BOOST':
        return MAX_BANK * BANK_BOOST_SCALE;
      case 'SLOWDOWN':
        return MAX_BANK * BANK_SLOWDOWN_SCALE;
      default:
        return MAX_BANK;
    }
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

    // Bank animation: smoothly approach target, then reset target so that
    // a frame without left/right input naturally decays back to level.
    const t = 1 - Math.exp(-deltaTime * BANK_SMOOTHING);
    this.bankAngle += (this.bankTarget - this.bankAngle) * t;
    this.bankTarget = 0;

    // Sync mesh
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.z = this.bankAngle;
    this.mesh.rotation.y = this.bankAngle * BANK_YAW_RATIO;
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

  /**
   * Returns the remaining ratio (0..1) of the current speed-state timer.
   * BOOST/SLOWDOWN are normalized by SPEED_STATE_DURATION, RECOVERING by
   * RECOVERY_DURATION. NORMAL returns 0. Used by visual effects (e.g. the
   * invincibility shield) that need to fade out as the state progresses.
   */
  getSpeedStateRemainingRatio(): number {
    let duration = 0;
    switch (this.speedState) {
      case 'BOOST':
      case 'SLOWDOWN':
        duration = SPEED_STATE_DURATION;
        break;
      case 'RECOVERING':
        duration = RECOVERY_DURATION;
        break;
      default:
        return 0;
    }
    if (duration <= 0) return 0;
    const ratio = this.speedStateTimer / duration;
    return Math.max(0, Math.min(1, ratio));
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
    this.bankAngle = 0;
    this.bankTarget = 0;
    this.mesh.position.set(0, 0, 0);
    this.mesh.rotation.set(0, 0, 0);
  }

  dispose(): void {
    disposeObject3D(this.mesh);
  }
}
