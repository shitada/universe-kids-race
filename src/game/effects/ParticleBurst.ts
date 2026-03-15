import * as THREE from 'three';

export interface ParticleBurstOptions {
  position: THREE.Vector3;
  color: number;
  particleCount: number;
  isRainbow: boolean;
}

export class ParticleBurst {
  private points: THREE.Points | null = null;
  private velocities: Float32Array = new Float32Array(0);
  private lifetime = 0;
  private maxLifetime = 0.5;
  private elapsed = 0;
  private initialSizes: Float32Array = new Float32Array(0);

  init(scene: THREE.Scene, options: ParticleBurstOptions): void {
    const count = options.particleCount;
    this.maxLifetime = options.isRainbow ? 0.8 : 0.5;
    this.elapsed = 0;
    this.lifetime = this.maxLifetime;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    this.velocities = new Float32Array(count * 3);
    this.initialSizes = new Float32Array(count);

    const baseColor = new THREE.Color(options.color);
    const speedMin = options.isRainbow ? 8 : 5;
    const speedMax = options.isRainbow ? 15 : 10;
    const initialSize = options.isRainbow ? 0.5 : 0.3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Start at burst position
      positions[i3] = options.position.x;
      positions[i3 + 1] = options.position.y;
      positions[i3 + 2] = options.position.z;

      // Random radial velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = speedMin + Math.random() * (speedMax - speedMin);
      this.velocities[i3] = Math.sin(phi) * Math.cos(theta) * speed;
      this.velocities[i3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      this.velocities[i3 + 2] = Math.cos(phi) * speed;

      // Color
      if (options.isRainbow) {
        const hslColor = new THREE.Color().setHSL(Math.random(), 1, 0.5);
        colors[i3] = hslColor.r;
        colors[i3 + 1] = hslColor.g;
        colors[i3 + 2] = hslColor.b;
      } else {
        colors[i3] = baseColor.r;
        colors[i3 + 1] = baseColor.g;
        colors[i3 + 2] = baseColor.b;
      }

      sizes[i] = initialSize;
      this.initialSizes[i] = initialSize;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: initialSize,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  update(deltaTime: number): void {
    if (!this.points) return;
    this.elapsed += deltaTime;

    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttr = this.points.geometry.getAttribute('size') as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;
    const sizes = sizeAttr.array as Float32Array;

    const remaining = Math.max(0, 1 - this.elapsed / this.maxLifetime);

    for (let i = 0; i < sizes.length; i++) {
      const i3 = i * 3;
      // Move by velocity
      positions[i3] += this.velocities[i3] * deltaTime;
      positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime;
      positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime;

      // Dampen velocity
      this.velocities[i3] *= 0.95;
      this.velocities[i3 + 1] *= 0.95;
      this.velocities[i3 + 2] *= 0.95;

      // Shrink size
      sizes[i] = this.initialSizes[i] * remaining;
    }

    posAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    // Fade opacity
    (this.points.material as THREE.PointsMaterial).opacity = remaining;
  }

  isExpired(): boolean {
    return this.elapsed >= this.maxLifetime;
  }

  dispose(scene: THREE.Scene): void {
    if (this.points) {
      scene.remove(this.points);
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
      this.points = null;
    }
  }
}

export class ParticleBurstManager {
  private static readonly MAX_BURSTS = 10;
  private bursts: ParticleBurst[] = [];

  emit(scene: THREE.Scene, options: ParticleBurstOptions): void {
    // Recycle oldest if at limit
    if (this.bursts.length >= ParticleBurstManager.MAX_BURSTS) {
      const oldest = this.bursts.shift()!;
      oldest.dispose(scene);
    }

    const burst = new ParticleBurst();
    burst.init(scene, options);
    this.bursts.push(burst);
  }

  update(deltaTime: number): void {
    for (const burst of this.bursts) {
      burst.update(deltaTime);
    }
  }

  cleanup(scene: THREE.Scene): void {
    this.bursts = this.bursts.filter((burst) => {
      if (burst.isExpired()) {
        burst.dispose(scene);
        return false;
      }
      return true;
    });
  }

  clear(scene: THREE.Scene): void {
    for (const burst of this.bursts) {
      burst.dispose(scene);
    }
    this.bursts = [];
  }
}
