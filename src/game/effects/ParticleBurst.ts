import * as THREE from 'three';

/**
 * Legacy options shape preserved for backwards-compatible call sites.
 * The recommended hot-path API is the primitive-argument overload of
 * `ParticleBurst.reset` / `ParticleBurstManager.emit`, which avoids
 * per-emit GC allocations (no `new THREE.Vector3` / `new THREE.Color`
 * / options literal). See `reset(scene, x, y, z, color, count, isRainbow)`.
 */
export interface ParticleBurstOptions {
  position: THREE.Vector3;
  color: number;
  particleCount: number;
  isRainbow: boolean;
}

const MAX_PARTICLES_PER_BURST = 50;

export class ParticleBurst {
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.PointsMaterial;
  private readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly sizes: Float32Array;
  private readonly velocities: Float32Array;
  private readonly initialSizes: Float32Array;
  private readonly positionAttr: THREE.BufferAttribute;
  private readonly colorAttr: THREE.BufferAttribute;
  private readonly sizeAttr: THREE.BufferAttribute;
  // Reused per-instance color scratch buffers. Safe because each pool slot
  // owns its own ParticleBurst, so concurrent emits never share these.
  private readonly baseColor = new THREE.Color();
  private readonly tempColor = new THREE.Color();
  private count = 0;
  private maxLifetime = 0.5;
  private elapsed = 0;
  private active = false;
  private inScene = false;
  private disposed = false;

  constructor() {
    this.positions = new Float32Array(MAX_PARTICLES_PER_BURST * 3);
    this.colors = new Float32Array(MAX_PARTICLES_PER_BURST * 3);
    this.sizes = new Float32Array(MAX_PARTICLES_PER_BURST);
    this.velocities = new Float32Array(MAX_PARTICLES_PER_BURST * 3);
    this.initialSizes = new Float32Array(MAX_PARTICLES_PER_BURST);

    this.positionAttr = new THREE.BufferAttribute(this.positions, 3);
    this.colorAttr = new THREE.BufferAttribute(this.colors, 3);
    this.sizeAttr = new THREE.BufferAttribute(this.sizes, 1);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', this.positionAttr);
    this.geometry.setAttribute('color', this.colorAttr);
    this.geometry.setAttribute('size', this.sizeAttr);
    this.geometry.setDrawRange(0, 0);

    this.material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.visible = false;
  }

  reset(
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    color: number,
    particleCount: number,
    isRainbow: boolean,
  ): void {
    if (this.disposed) return;
    const count = Math.min(Math.max(0, particleCount), MAX_PARTICLES_PER_BURST);
    this.count = count;
    this.maxLifetime = isRainbow ? 0.8 : 0.5;
    this.elapsed = 0;

    this.baseColor.set(color);
    const baseColor = this.baseColor;
    const speedMin = isRainbow ? 8 : 5;
    const speedMax = isRainbow ? 15 : 10;
    const initialSize = isRainbow ? 0.5 : 0.3;
    const tempColor = isRainbow ? this.tempColor : null;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = x;
      this.positions[i3 + 1] = y;
      this.positions[i3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      // ホットループから三角関数の不変計算をホイスト
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      this.velocities[i3] = sinPhi * cosTheta * speed;
      this.velocities[i3 + 1] = sinPhi * sinTheta * speed;
      this.velocities[i3 + 2] = cosPhi * speed;

      if (isRainbow && tempColor) {
        tempColor.setHSL(Math.random(), 1, 0.5);
        this.colors[i3] = tempColor.r;
        this.colors[i3 + 1] = tempColor.g;
        this.colors[i3 + 2] = tempColor.b;
      } else {
        this.colors[i3] = baseColor.r;
        this.colors[i3 + 1] = baseColor.g;
        this.colors[i3 + 2] = baseColor.b;
      }

      this.sizes[i] = initialSize;
      this.initialSizes[i] = initialSize;
    }

    this.material.size = initialSize;
    this.material.opacity = 1.0;

    this.geometry.setDrawRange(0, count);
    this.markAttributesDirty();

    if (!this.inScene) {
      scene.add(this.points);
      this.inScene = true;
    }
    this.points.visible = true;
    this.active = true;
  }

  // Backwards-compatible alias for the legacy options-object initialization API.
  // Prefer the primitive-argument `reset` to avoid per-call allocations.
  init(scene: THREE.Scene, options: ParticleBurstOptions): void {
    this.reset(
      scene,
      options.position.x,
      options.position.y,
      options.position.z,
      options.color,
      options.particleCount,
      options.isRainbow,
    );
  }

  /**
   * Advances the burst by `deltaTime` seconds.
   *
   * Returns `true` if the burst expired during this call so the caller
   * (typically `ParticleBurstManager`) can detach it from the scene
   * immediately, avoiding the prior pattern of running a second pool
   * sweep in `cleanup()`.
   *
   * On the expire frame we skip the per-particle position/size loop and
   * the `needsUpdate` flags entirely: the geometry is about to be hidden
   * via `setDrawRange(0, 0)` + `visible = false`, so uploading the final
   * frame to the GPU would be pure waste. This is measurable when several
   * bursts expire on the same frame (e.g. star pickup, rainbow, crash).
   */
  update(deltaTime: number): boolean {
    if (!this.active) return false;
    this.elapsed += deltaTime;
    if (this.elapsed >= this.maxLifetime) {
      // Expired this frame: stop drawing without uploading a discarded buffer.
      this.geometry.setDrawRange(0, 0);
      this.points.visible = false;
      this.active = false;
      return true;
    }

    const remaining = 1 - this.elapsed / this.maxLifetime;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      this.positions[i3] += this.velocities[i3] * deltaTime;
      this.positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime;
      this.positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime;

      this.velocities[i3] *= 0.95;
      this.velocities[i3 + 1] *= 0.95;
      this.velocities[i3 + 2] *= 0.95;

      this.sizes[i] = this.initialSizes[i] * remaining;
    }

    // Limit the GPU upload window to the live particle slice. The backing
    // Float32Arrays are sized for MAX_PARTICLES_PER_BURST (50), but bursts
    // such as the NORMAL star pickup only use 20 particles, so without a
    // range hint Three.js would re-upload the unused tail every frame.
    this.positionAttr.clearUpdateRanges();
    this.positionAttr.addUpdateRange(0, this.count * 3);
    this.positionAttr.needsUpdate = true;
    this.sizeAttr.clearUpdateRanges();
    this.sizeAttr.addUpdateRange(0, this.count);
    this.sizeAttr.needsUpdate = true;
    this.material.opacity = remaining;
    return false;
  }

  isExpired(): boolean {
    return this.elapsed >= this.maxLifetime;
  }

  isActive(): boolean {
    return this.active;
  }

  /** Progress through the lifetime in [0, 1+]. Used for recycling decisions. */
  getProgress(): number {
    if (this.maxLifetime <= 0) return 1;
    return this.elapsed / this.maxLifetime;
  }

  /** Removes the burst from the scene and marks it inactive. Buffers are kept alive. */
  deactivate(scene: THREE.Scene): void {
    if (this.inScene) {
      scene.remove(this.points);
      this.inScene = false;
    }
    this.points.visible = false;
    this.geometry.setDrawRange(0, 0);
    this.active = false;
  }

  /** Fully releases GPU resources. Use only when the owning scene tears down. */
  dispose(scene: THREE.Scene): void {
    if (this.inScene) {
      scene.remove(this.points);
      this.inScene = false;
    }
    if (!this.disposed) {
      this.geometry.dispose();
      this.material.dispose();
      this.disposed = true;
    }
    this.active = false;
  }

  private markAttributesDirty(): void {
    // Mirror the per-frame upload-range narrowing in update(): only the
    // active [0, count) slice was written by reset(), so flagging the
    // remaining MAX_PARTICLES_PER_BURST tail dirty would waste bandwidth.
    const count = this.count;
    this.positionAttr.clearUpdateRanges();
    this.positionAttr.addUpdateRange(0, count * 3);
    this.positionAttr.needsUpdate = true;
    this.colorAttr.clearUpdateRanges();
    this.colorAttr.addUpdateRange(0, count * 3);
    this.colorAttr.needsUpdate = true;
    this.sizeAttr.clearUpdateRanges();
    this.sizeAttr.addUpdateRange(0, count);
    this.sizeAttr.needsUpdate = true;
  }
}

export class ParticleBurstManager {
  static readonly MAX_BURSTS = 10;
  private readonly pool: ParticleBurst[];
  // Cached count of currently active pool slots. Maintains the invariant
  // `activeCount === pool.filter(b => b.isActive()).length` so update()
  // can early-return on rest frames without scanning all 10 slots at 60Hz.
  private activeCount = 0;

  constructor() {
    this.pool = [];
    for (let i = 0; i < ParticleBurstManager.MAX_BURSTS; i++) {
      this.pool.push(new ParticleBurst());
    }
  }

  emit(
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    color: number,
    particleCount: number,
    isRainbow: boolean,
  ): void {
    let slot: ParticleBurst | null = null;
    for (const burst of this.pool) {
      if (!burst.isActive()) {
        slot = burst;
        break;
      }
    }

    if (slot) {
      // Found an inactive slot — it's transitioning inactive→active, so
      // increment the cached counter. The "recycle most-progressed" branch
      // below intentionally does NOT increment because that slot is already
      // counted as active.
      this.activeCount++;
    } else {
      // All slots in flight; recycle the most-progressed one to mimic
      // the previous "drop oldest" behaviour without allocating a new burst.
      slot = this.pool[0];
      let bestProgress = slot.getProgress();
      for (let i = 1; i < this.pool.length; i++) {
        const progress = this.pool[i].getProgress();
        if (progress > bestProgress) {
          bestProgress = progress;
          slot = this.pool[i];
        }
      }
    }

    slot.reset(scene, x, y, z, color, particleCount, isRainbow);
  }

  /**
   * Steps every active burst and detaches any that expired during this
   * call. Replaces the previous `update()` + `cleanup()` two-pass scheme
   * so expired bursts no longer get an extra GPU upload before being
   * removed from the scene.
   *
   * On rest frames (no active bursts) we early-return to skip the 10-slot
   * pool scan entirely, matching the rest-skip optimization pattern used
   * by AirShield (OFF) and Star/Meteorite (off-screen).
   */
  update(scene: THREE.Scene, deltaTime: number): void {
    if (this.activeCount === 0) return;
    for (const burst of this.pool) {
      if (!burst.isActive()) continue;
      const expired = burst.update(deltaTime);
      if (expired) {
        burst.deactivate(scene);
        this.activeCount--;
      }
    }
  }

  /**
   * @deprecated Expired bursts are now detached from the scene directly
   * inside `update(scene, deltaTime)`. Retained as a no-op safety net for
   * call sites that still invoke it, and to catch any burst that became
   * inactive without going through `update()`.
   */
  cleanup(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      if (burst.isActive() && burst.isExpired()) {
        burst.deactivate(scene);
        this.activeCount--;
      }
    }
  }

  clear(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      if (burst.isActive()) burst.deactivate(scene);
    }
    this.activeCount = 0;
  }

  /** Releases all pooled GPU resources. Call once when shutting the scene down for good. */
  dispose(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      burst.dispose(scene);
    }
    this.activeCount = 0;
  }

  /** Test/diagnostic helper: number of currently active bursts. */
  getActiveCount(): number {
    return this.activeCount;
  }

  /** Test/diagnostic helper: total pool size (constant). */
  getPoolSize(): number {
    return this.pool.length;
  }
}
