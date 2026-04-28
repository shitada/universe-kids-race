import * as THREE from 'three';

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

  reset(scene: THREE.Scene, options: ParticleBurstOptions): void {
    if (this.disposed) return;
    const count = Math.min(Math.max(0, options.particleCount), MAX_PARTICLES_PER_BURST);
    this.count = count;
    this.maxLifetime = options.isRainbow ? 0.8 : 0.5;
    this.elapsed = 0;

    const baseColor = new THREE.Color(options.color);
    const speedMin = options.isRainbow ? 8 : 5;
    const speedMax = options.isRainbow ? 15 : 10;
    const initialSize = options.isRainbow ? 0.5 : 0.3;
    const tempColor = options.isRainbow ? new THREE.Color() : null;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      this.positions[i3] = options.position.x;
      this.positions[i3 + 1] = options.position.y;
      this.positions[i3 + 2] = options.position.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      this.velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      this.velocities[i3 + 2] = Math.cos(phi) * speed;

      if (options.isRainbow && tempColor) {
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

  // Backwards-compatible alias for the legacy initialization API.
  init(scene: THREE.Scene, options: ParticleBurstOptions): void {
    this.reset(scene, options);
  }

  update(deltaTime: number): void {
    if (!this.active) return;
    this.elapsed += deltaTime;
    const remaining = Math.max(0, 1 - this.elapsed / this.maxLifetime);

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

    this.positionAttr.needsUpdate = true;
    this.sizeAttr.needsUpdate = true;
    this.material.opacity = remaining;
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
    this.positionAttr.needsUpdate = true;
    this.colorAttr.needsUpdate = true;
    this.sizeAttr.needsUpdate = true;
  }
}

export class ParticleBurstManager {
  static readonly MAX_BURSTS = 10;
  private readonly pool: ParticleBurst[];

  constructor() {
    this.pool = [];
    for (let i = 0; i < ParticleBurstManager.MAX_BURSTS; i++) {
      this.pool.push(new ParticleBurst());
    }
  }

  emit(scene: THREE.Scene, options: ParticleBurstOptions): void {
    let slot: ParticleBurst | null = null;
    for (const burst of this.pool) {
      if (!burst.isActive()) {
        slot = burst;
        break;
      }
    }

    if (!slot) {
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

    slot.reset(scene, options);
  }

  update(deltaTime: number): void {
    for (const burst of this.pool) {
      if (burst.isActive()) burst.update(deltaTime);
    }
  }

  cleanup(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      if (burst.isActive() && burst.isExpired()) {
        burst.deactivate(scene);
      }
    }
  }

  clear(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      if (burst.isActive()) burst.deactivate(scene);
    }
  }

  /** Releases all pooled GPU resources. Call once when shutting the scene down for good. */
  dispose(scene: THREE.Scene): void {
    for (const burst of this.pool) {
      burst.dispose(scene);
    }
  }

  /** Test/diagnostic helper: number of currently active bursts. */
  getActiveCount(): number {
    let n = 0;
    for (const burst of this.pool) {
      if (burst.isActive()) n++;
    }
    return n;
  }

  /** Test/diagnostic helper: total pool size (constant). */
  getPoolSize(): number {
    return this.pool.length;
  }
}
