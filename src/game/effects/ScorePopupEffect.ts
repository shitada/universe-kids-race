import * as THREE from 'three';

type WorldPosition = Readonly<{ x: number; y: number; z: number }>;

interface SparkleBurst {
  readonly points: THREE.Points;
  readonly geometry: THREE.BufferGeometry;
  readonly material: THREE.PointsMaterial;
  readonly positions: Float32Array;
  readonly velocities: Float32Array;
  readonly positionAttr: THREE.BufferAttribute;
  active: boolean;
  elapsed: number;
  duration: number;
}

export class ScorePopupEffect {
  private static readonly MAX_PARTICLES = 20;
  private static readonly POOL_SIZE = 6;
  private static readonly DURATION_SECONDS = 1;
  private static readonly DEFAULT_COLOR = 0xfff4b3;
  private static readonly BONUS_COLOR = 0xff9cf7;

  private scene: THREE.Scene | null = null;
  private readonly pool: SparkleBurst[] = [];

  init(scene: THREE.Scene): void {
    if (this.scene === scene && this.pool.length > 0) {
      return;
    }
    if (this.scene && this.scene !== scene) {
      this.dispose();
    }
    this.scene = scene;
    if (this.pool.length > 0) {
      for (const burst of this.pool) {
        scene.add(burst.points);
      }
      return;
    }
    for (let i = 0; i < ScorePopupEffect.POOL_SIZE; i++) {
      const positions = new Float32Array(ScorePopupEffect.MAX_PARTICLES * 3);
      const velocities = new Float32Array(ScorePopupEffect.MAX_PARTICLES * 3);
      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('position', positionAttr);
      geometry.setDrawRange(0, 0);
      const material = new THREE.PointsMaterial({
        color: ScorePopupEffect.DEFAULT_COLOR,
        size: 0.34,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      points.visible = false;
      scene.add(points);
      this.pool.push({
        points,
        geometry,
        material,
        positions,
        velocities,
        positionAttr,
        active: false,
        elapsed: 0,
        duration: ScorePopupEffect.DURATION_SECONDS,
      });
    }
  }

  emit(worldPosition: WorldPosition, score: number): void {
    if (!this.scene) {
      return;
    }
    const burst = this.acquireBurst();
    const particleCount = Math.min(
      ScorePopupEffect.MAX_PARTICLES,
      Math.max(10, Math.round(score >= 500 ? 20 : 14)),
    );
    const tint = score >= 500 ? ScorePopupEffect.BONUS_COLOR : ScorePopupEffect.DEFAULT_COLOR;

    burst.elapsed = 0;
    burst.duration = ScorePopupEffect.DURATION_SECONDS;
    burst.active = true;
    burst.material.color.setHex(tint);
    burst.material.opacity = 1;
    burst.material.size = score >= 500 ? 0.42 : 0.34;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      burst.positions[i3] = worldPosition.x;
      burst.positions[i3 + 1] = worldPosition.y;
      burst.positions[i3 + 2] = worldPosition.z;

      const theta = (Math.PI * 2 * i) / particleCount + Math.random() * 0.28;
      const speed = 1.6 + Math.random() * (score >= 500 ? 2.1 : 1.2);
      burst.velocities[i3] = Math.cos(theta) * speed * 0.7;
      burst.velocities[i3 + 1] = 1.8 + Math.random() * 1.6;
      burst.velocities[i3 + 2] = Math.sin(theta) * speed;
    }
    burst.geometry.setDrawRange(0, particleCount);
    burst.positionAttr.clearUpdateRanges();
    burst.positionAttr.addUpdateRange(0, particleCount * 3);
    burst.positionAttr.needsUpdate = true;
    burst.points.visible = true;
  }

  update(deltaTime: number): void {
    for (const burst of this.pool) {
      if (!burst.active) {
        continue;
      }
      burst.elapsed += deltaTime;
      if (burst.elapsed >= burst.duration) {
        this.deactivateBurst(burst);
        continue;
      }

      const count = burst.geometry.drawRange.count;
      const progress = burst.elapsed / burst.duration;
      const lift = 0.8 * deltaTime;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        burst.positions[i3] += burst.velocities[i3] * deltaTime;
        burst.positions[i3 + 1] += burst.velocities[i3 + 1] * deltaTime + lift;
        burst.positions[i3 + 2] += burst.velocities[i3 + 2] * deltaTime;
        burst.velocities[i3] *= 0.92;
        burst.velocities[i3 + 1] *= 0.9;
        burst.velocities[i3 + 2] *= 0.92;
      }
      burst.positionAttr.clearUpdateRanges();
      burst.positionAttr.addUpdateRange(0, count * 3);
      burst.positionAttr.needsUpdate = true;
      burst.material.opacity = 1 - progress;
      burst.material.size = 0.28 + (1 - progress) * 0.18;
    }
  }

  clear(): void {
    for (const burst of this.pool) {
      this.deactivateBurst(burst);
    }
  }

  dispose(): void {
    if (!this.scene) {
      return;
    }
    for (const burst of this.pool) {
      this.scene.remove(burst.points);
      burst.geometry.dispose();
      burst.material.dispose();
    }
    this.pool.length = 0;
    this.scene = null;
  }

  getActiveCount(): number {
    return this.pool.filter((burst) => burst.active).length;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  private acquireBurst(): SparkleBurst {
    const available = this.pool.find((burst) => !burst.active);
    if (available) {
      return available;
    }
    let best = this.pool[0];
    for (let i = 1; i < this.pool.length; i++) {
      if (this.pool[i].elapsed > best.elapsed) {
        best = this.pool[i];
      }
    }
    this.deactivateBurst(best);
    return best;
  }

  private deactivateBurst(burst: SparkleBurst): void {
    burst.active = false;
    burst.elapsed = 0;
    burst.material.opacity = 0;
    burst.points.visible = false;
    burst.geometry.setDrawRange(0, 0);
  }
}
