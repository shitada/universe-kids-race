import * as THREE from 'three';

/**
 * ブースト中に船尾から噴出する炎パーティクルのエフェクト。
 *
 * StageScene から抽出。MAX_PARTICLES の Points を 1 度だけ確保し、
 * リング状にインデックスを循環させて再利用する。BoostSystem から
 * 受け取る進行率 (0..1) に応じて、フェード期間 (>= 0.83) では
 * 放出数とパーティクルサイズを線形に減衰させる。
 */
export class BoostFlameEffect {
  static readonly MAX_PARTICLES = 150;
  private static readonly FADE_START = 0.83;
  private static readonly BASE_SIZE = 0.5;
  private static readonly OFFSCREEN_Z = 99999;
  private static readonly LIFETIME = 0.7;

  private scene: THREE.Scene | null = null;
  private points: THREE.Points | null = null;
  private positions: Float32Array | null = null;
  private colors: Float32Array | null = null;
  private lifetimes: Float32Array | null = null;
  private velocities: Float32Array | null = null;
  private positionAttr: THREE.BufferAttribute | null = null;
  private colorAttr: THREE.BufferAttribute | null = null;
  private lastSize = -1;
  private index = 0;
  private emitting = false;

  init(scene: THREE.Scene): void {
    if (this.points) return;
    this.scene = scene;
    const MAX = BoostFlameEffect.MAX_PARTICLES;
    this.positions = new Float32Array(MAX * 3);
    this.colors = new Float32Array(MAX * 3);
    this.lifetimes = new Float32Array(MAX);
    this.velocities = new Float32Array(MAX * 2);

    // Park all particles offscreen on z=99999 until first emission.
    for (let i = 0; i < MAX; i++) {
      this.positions[i * 3 + 2] = BoostFlameEffect.OFFSCREEN_Z;
    }
    this.lifetimes.fill(0);
    this.colors.fill(0);
    this.velocities.fill(0);
    this.index = 0;
    this.emitting = false;

    const geometry = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(this.positions, 3);
    const colorAttr = new THREE.BufferAttribute(this.colors, 3);
    geometry.setAttribute('position', positionAttr);
    geometry.setAttribute('color', colorAttr);
    this.positionAttr = positionAttr;
    this.colorAttr = colorAttr;

    const material = new THREE.PointsMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      size: BoostFlameEffect.BASE_SIZE,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
    this.points.visible = false;
    scene.add(this.points);
  }

  /**
   * Begin a new boost: reset all particle state and enable emission.
   * Equivalent to the former `resetBoostFlame` in StageScene.
   */
  start(): void {
    if (
      !this.points
      || !this.positions
      || !this.colors
      || !this.lifetimes
      || !this.velocities
    ) {
      return;
    }
    const MAX = BoostFlameEffect.MAX_PARTICLES;
    this.lifetimes.fill(0);
    this.colors.fill(0);
    this.velocities.fill(0);
    for (let i = 0; i < MAX; i++) {
      const i3 = i * 3;
      this.positions[i3] = 0;
      this.positions[i3 + 1] = 0;
      this.positions[i3 + 2] = BoostFlameEffect.OFFSCREEN_Z;
    }
    (this.points.material as THREE.PointsMaterial).size = BoostFlameEffect.BASE_SIZE;
    this.lastSize = BoostFlameEffect.BASE_SIZE;
    this.index = 0;
    this.emitting = true;
    this.points.visible = true;
    if (this.positionAttr) this.positionAttr.needsUpdate = true;
    if (this.colorAttr) this.colorAttr.needsUpdate = true;
  }

  /**
   * Stop emitting new particles. Existing live particles continue to fade
   * out via subsequent update() calls; visibility is hidden automatically
   * once all particles have died.
   */
  stopEmitting(): void {
    this.emitting = false;
  }

  isEmitting(): boolean {
    return this.emitting;
  }

  /**
   * Emit a burst of particles for the current frame at `shipPos`.
   * `progress` is the BoostSystem duration progress in [0, 1]; emission
   * count and size taper to zero across the fade window starting at 0.83.
   */
  emit(shipPos: { x: number; y: number; z: number }, progress: number): void {
    if (!this.positions || !this.colors || !this.lifetimes || !this.velocities) return;
    const MAX = BoostFlameEffect.MAX_PARTICLES;
    const FADE_START = BoostFlameEffect.FADE_START;

    const emitCount = progress < FADE_START
      ? 8
      : Math.max(0, Math.round(8 * (1.0 - progress) / (1.0 - FADE_START)));
    const sizeFraction = progress < FADE_START
      ? 1.0
      : (1.0 - progress) / (1.0 - FADE_START);

    for (let p = 0; p < emitCount; p++) {
      const idx = this.index % MAX;
      const i3 = idx * 3;
      const i2 = idx * 2;

      this.positions[i3] = shipPos.x + (Math.random() - 0.5) * sizeFraction;
      this.positions[i3 + 1] = shipPos.y + (Math.random() - 0.5) * sizeFraction;
      this.positions[i3 + 2] = shipPos.z + 2;

      const t = Math.random();
      this.colors[i3] = 1.0;
      this.colors[i3 + 1] = 0.4 * (1 - t) + 0.133 * t;
      this.colors[i3 + 2] = 0;

      this.lifetimes[idx] = BoostFlameEffect.LIFETIME;
      this.velocities[i2] = 3 + Math.random() * 2;
      this.velocities[i2 + 1] = (Math.random() - 0.5);

      this.index++;
    }

    if (emitCount > 0) {
      if (this.positionAttr) this.positionAttr.needsUpdate = true;
      if (this.colorAttr) this.colorAttr.needsUpdate = true;
    }

    // Scale particle size during fade phase
    if (this.points) {
      const desiredSize = BoostFlameEffect.BASE_SIZE * sizeFraction;
      if (desiredSize !== this.lastSize) {
        (this.points.material as THREE.PointsMaterial).size = desiredSize;
        this.lastSize = desiredSize;
      }
    }
  }

  update(deltaTime: number): void {
    if (!this.positions || !this.colors || !this.lifetimes || !this.velocities || !this.points) return;
    if (!this.points.visible) return;
    const MAX = BoostFlameEffect.MAX_PARTICLES;
    let hasLive = false;
    let positionsChanged = false;
    let colorsChanged = false;

    for (let i = 0; i < MAX; i++) {
      if (this.lifetimes[i] <= 0) continue;
      this.lifetimes[i] -= deltaTime;
      const i3 = i * 3;
      const i2 = i * 2;

      if (this.lifetimes[i] <= 0) {
        this.positions[i3 + 2] = BoostFlameEffect.OFFSCREEN_Z;
        this.colors[i3] = 0;
        this.colors[i3 + 1] = 0;
        this.colors[i3 + 2] = 0;
        positionsChanged = true;
        colorsChanged = true;
        continue;
      }

      hasLive = true;
      this.positions[i3 + 2] += this.velocities[i2] * deltaTime;
      this.positions[i3 + 1] += this.velocities[i2 + 1] * deltaTime;
      positionsChanged = true;
    }

    if (positionsChanged) this.positionAttr!.needsUpdate = true;
    if (colorsChanged) this.colorAttr!.needsUpdate = true;

    if (!this.emitting && !hasLive) {
      this.remove();
    }
  }

  /**
   * Hide the flame and reset all transient state. Geometry/material
   * remain allocated so that the next start() can reuse them.
   */
  remove(): void {
    if (!this.points) return;
    const MAX = BoostFlameEffect.MAX_PARTICLES;
    if (this.lifetimes) this.lifetimes.fill(0);
    if (this.colors) this.colors.fill(0);
    if (this.velocities) this.velocities.fill(0);
    if (this.positions) {
      for (let i = 0; i < MAX; i++) {
        const i3 = i * 3;
        this.positions[i3] = 0;
        this.positions[i3 + 1] = 0;
        this.positions[i3 + 2] = BoostFlameEffect.OFFSCREEN_Z;
      }
    }
    if (this.positionAttr) this.positionAttr.needsUpdate = true;
    if (this.colorAttr) this.colorAttr.needsUpdate = true;
    this.index = 0;
    this.emitting = false;
    this.points.visible = false;
    this.lastSize = -1;
  }

  getObject(): THREE.Points | null {
    return this.points;
  }

  dispose(): void {
    if (this.points) {
      this.scene?.remove(this.points);
      this.points.geometry.dispose();
      (this.points.material as THREE.PointsMaterial).dispose();
      this.points = null;
    }
    this.positions = null;
    this.colors = null;
    this.lifetimes = null;
    this.velocities = null;
    this.positionAttr = null;
    this.colorAttr = null;
    this.index = 0;
    this.emitting = false;
    this.lastSize = -1;
    this.scene = null;
  }
}
