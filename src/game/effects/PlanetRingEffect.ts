import * as THREE from 'three';

interface ParticleBurstEmitter {
  emit(
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    color: number,
    particleCount: number,
    isRainbow: boolean,
  ): void;
}

interface RingState {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  delay: number;
  distanceScale: number;
  targetScale: number;
  tiltX: number;
  tiltY: number;
  spinSpeed: number;
  burstEmitted: boolean;
}

const RING_DELAY_STEP = 0.18;
const RING_APPEAR_DURATION = 0.28;
const RING_VISIBLE_DURATION = 0.62;
const RING_FADE_DURATION = 0.4;
const EFFECT_DURATION = RING_DELAY_STEP * 2 + RING_APPEAR_DURATION + RING_VISIBLE_DURATION + RING_FADE_DURATION;
const MIN_RING_SCALE = 0.001;

export class PlanetRingEffect {
  private static readonly sharedGeometry = PlanetRingEffect.createSharedGeometry();
  private readonly group = new THREE.Group();
  private readonly rings: RingState[];
  private readonly worldPosition = new THREE.Vector3();
  private target: THREE.Object3D | null = null;
  private scene: THREE.Scene | null = null;
  private particleBurstEmitter: ParticleBurstEmitter | null = null;
  private accentColor = 0xffffff;
  private elapsed = 0;
  private active = false;

  constructor() {
    this.rings = [
      this.createRing(0, 1.2, 0.72, 0.15, 1.8),
      this.createRing(RING_DELAY_STEP, 1.5, 1.0, 0.55, -2.2),
      this.createRing(RING_DELAY_STEP * 2, 1.8, 1.24, 1.0, 2.8),
    ];
    for (const ring of this.rings) {
      this.group.add(ring.mesh);
    }
  }

  start(
    scene: THREE.Scene,
    target: THREE.Object3D,
    planetRadius: number,
    accentColor: number,
    particleBurstEmitter?: ParticleBurstEmitter,
  ): void {
    this.clear();
    this.scene = scene;
    this.target = target;
    this.particleBurstEmitter = particleBurstEmitter ?? null;
    this.accentColor = accentColor;
    this.elapsed = 0;
    this.active = true;
    target.add(this.group);

    const safeRadius = Math.max(planetRadius, 1);
    for (const ring of this.rings) {
      ring.burstEmitted = false;
      ring.targetScale = safeRadius * ring.distanceScale;
      ring.mesh.visible = false;
      ring.mesh.rotation.set(ring.tiltX, ring.tiltY, 0);
      ring.mesh.scale.setScalar(Math.max(ring.targetScale * MIN_RING_SCALE, MIN_RING_SCALE));
      ring.material.opacity = 0;
    }
  }

  update(deltaTime: number): void {
    if (!this.active) {
      return;
    }

    this.elapsed += deltaTime;
    const scene = this.scene;
    const target = this.target;

    for (const ring of this.rings) {
      const ringElapsed = this.elapsed - ring.delay;
      if (ringElapsed < 0) {
        continue;
      }

      if (!ring.burstEmitted && scene && target) {
        target.getWorldPosition(this.worldPosition);
        this.particleBurstEmitter?.emit(
          scene,
          this.worldPosition.x,
          this.worldPosition.y,
          this.worldPosition.z,
          this.accentColor,
          24,
          true,
        );
        ring.burstEmitted = true;
      }

      const appearProgress = Math.min(ringElapsed / RING_APPEAR_DURATION, 1);
      const fadeProgress = Math.max(
        0,
        1 - Math.max(0, ringElapsed - (RING_APPEAR_DURATION + RING_VISIBLE_DURATION)) / RING_FADE_DURATION,
      );
      const visibility = Math.min(appearProgress, fadeProgress);

      if (visibility <= 0) {
        ring.mesh.visible = false;
        ring.material.opacity = 0;
        continue;
      }

      const sparkle = 0.65 + Math.sin((this.elapsed + ring.delay) * 10) * 0.15;
      const easedScale = PlanetRingEffect.easeOutBack(appearProgress);
      ring.mesh.visible = true;
      ring.mesh.rotation.z += deltaTime * ring.spinSpeed;
      ring.mesh.scale.setScalar(ring.targetScale * easedScale);
      ring.material.opacity = Math.min(0.95, visibility * sparkle);
    }

    if (this.elapsed >= EFFECT_DURATION) {
      this.clear();
    }
  }

  clear(): void {
    this.group.parent?.remove(this.group);
    this.target = null;
    this.scene = null;
    this.particleBurstEmitter = null;
    this.elapsed = 0;
    this.active = false;
    for (const ring of this.rings) {
      ring.burstEmitted = false;
      ring.mesh.visible = false;
      ring.mesh.rotation.set(ring.tiltX, ring.tiltY, 0);
      ring.mesh.scale.setScalar(MIN_RING_SCALE);
      ring.material.opacity = 0;
    }
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  isActive(): boolean {
    return this.active;
  }

  private createRing(
    delay: number,
    distanceScale: number,
    tiltX: number,
    tiltY: number,
    spinSpeed: number,
  ): RingState {
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(PlanetRingEffect.sharedGeometry, material);
    mesh.frustumCulled = false;
    mesh.visible = false;
    return {
      mesh,
      material,
      delay,
      distanceScale,
      targetScale: distanceScale,
      tiltX,
      tiltY,
      spinSpeed,
      burstEmitted: false,
    };
  }

  private static createSharedGeometry(): THREE.TorusGeometry {
    const geometry = new THREE.TorusGeometry(1, 0.08, 12, 64);
    const positionAttr = geometry.getAttribute('position');
    const colors = new Float32Array(positionAttr.count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      const hue = (Math.atan2(y, x) / (Math.PI * 2) + 1) % 1;
      color.setHSL(hue, 1, 0.6);
      const i3 = i * 3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geometry;
  }

  private static easeOutBack(value: number): number {
    const clamped = Math.max(0, Math.min(1, value));
    const c1 = 1.70158;
    const c3 = c1 + 1;
    const inverse = clamped - 1;
    return 1 + c3 * inverse * inverse * inverse + c1 * inverse * inverse;
  }
}
