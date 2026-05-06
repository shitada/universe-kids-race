import * as THREE from 'three';

type WorldPosition = Readonly<{ x: number; y: number; z: number }>;

const HEART_PARTICLE_COUNT = 14;
const BURST_POOL_SIZE = 3;
const BURST_DURATION = 0.9;

interface HeartParticle {
  readonly mesh: THREE.Mesh;
  readonly material: THREE.MeshBasicMaterial;
  readonly velocity: THREE.Vector3;
  readonly spinVelocity: number;
  readonly baseScale: number;
}

interface HeartBurstSlot {
  readonly group: THREE.Group;
  readonly particles: HeartParticle[];
  active: boolean;
  elapsed: number;
}

function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.3);
  shape.bezierCurveTo(0, 0.65, -0.45, 0.92, -0.88, 0.48);
  shape.bezierCurveTo(-1.18, 0.15, -1.02, -0.38, 0, -1.08);
  shape.bezierCurveTo(1.02, -0.38, 1.18, 0.15, 0.88, 0.48);
  shape.bezierCurveTo(0.45, 0.92, 0, 0.65, 0, 0.3);
  shape.closePath();
  return shape;
}

const SHARED_HEART_GEOMETRY = (() => {
  const geometry = new THREE.ExtrudeGeometry(createHeartShape(), {
    depth: 0.1,
    bevelEnabled: false,
    curveSegments: 4,
  });
  geometry.scale(0.14, 0.14, 0.65);
  geometry.center();
  return geometry;
})();

export class LovelyStarBurstEffect {
  private scene: THREE.Scene | null = null;
  private readonly pool: HeartBurstSlot[] = [];

  init(scene: THREE.Scene): void {
    if (this.scene === scene && this.pool.length > 0) {
      return;
    }
    if (this.scene && this.scene !== scene) {
      this.dispose();
    }
    this.scene = scene;
    if (this.pool.length > 0) {
      for (const slot of this.pool) {
        scene.add(slot.group);
      }
      return;
    }

    for (let i = 0; i < BURST_POOL_SIZE; i++) {
      const group = new THREE.Group();
      group.visible = false;
      const particles: HeartParticle[] = [];
      for (let j = 0; j < HEART_PARTICLE_COUNT; j++) {
        const material = new THREE.MeshBasicMaterial({
          color: 0xff8fd6,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(SHARED_HEART_GEOMETRY, material);
        mesh.userData.sharedAssets = true;
        group.add(mesh);
        particles.push({
          mesh,
          material,
          velocity: new THREE.Vector3(),
          spinVelocity: (Math.random() - 0.5) * 8,
          baseScale: 0.8 + Math.random() * 0.6,
        });
      }
      scene.add(group);
      this.pool.push({
        group,
        particles,
        active: false,
        elapsed: 0,
      });
    }
  }

  emit(worldPosition: WorldPosition): void {
    if (!this.scene) {
      return;
    }
    const slot = this.acquireSlot();
    slot.active = true;
    slot.elapsed = 0;
    slot.group.visible = true;

    for (let i = 0; i < slot.particles.length; i++) {
      const particle = slot.particles[i];
      const angle = (Math.PI * 2 * i) / slot.particles.length + Math.random() * 0.24;
      const speed = 1.8 + Math.random() * 1.6;
      particle.mesh.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
      particle.mesh.rotation.set(0, 0, angle);
      particle.mesh.scale.setScalar(particle.baseScale);
      particle.material.opacity = 1;
      particle.material.color.setHSL((0.82 + i / slot.particles.length * 0.25) % 1, 0.85, 0.7);
      particle.velocity.set(
        Math.cos(angle) * speed * 0.7,
        1.2 + Math.random() * 1.4,
        Math.sin(angle) * speed,
      );
      particle.mesh.visible = true;
    }
  }

  update(deltaTime: number): void {
    for (const slot of this.pool) {
      if (!slot.active) {
        continue;
      }
      slot.elapsed += deltaTime;
      const progress = slot.elapsed / BURST_DURATION;
      if (progress >= 1) {
        this.deactivateSlot(slot);
        continue;
      }

      const scaleFade = 1 - progress * 0.45;
      for (const particle of slot.particles) {
        particle.mesh.position.x += particle.velocity.x * deltaTime;
        particle.mesh.position.y += particle.velocity.y * deltaTime;
        particle.mesh.position.z += particle.velocity.z * deltaTime;
        particle.mesh.rotation.z += particle.spinVelocity * deltaTime;
        particle.velocity.multiplyScalar(0.94);
        particle.material.opacity = 1 - progress;
        particle.mesh.scale.setScalar(particle.baseScale * scaleFade);
      }
    }
  }

  clear(): void {
    for (const slot of this.pool) {
      this.deactivateSlot(slot);
    }
  }

  dispose(): void {
    if (!this.scene) {
      return;
    }
    for (const slot of this.pool) {
      this.scene.remove(slot.group);
      for (const particle of slot.particles) {
        particle.material.dispose();
      }
    }
    this.pool.length = 0;
    this.scene = null;
  }

  getActiveCount(): number {
    return this.pool.filter((slot) => slot.active).length;
  }

  getPoolSize(): number {
    return this.pool.length;
  }

  private acquireSlot(): HeartBurstSlot {
    const available = this.pool.find((slot) => !slot.active);
    if (available) {
      return available;
    }
    let oldest = this.pool[0];
    for (let i = 1; i < this.pool.length; i++) {
      if (this.pool[i].elapsed > oldest.elapsed) {
        oldest = this.pool[i];
      }
    }
    this.deactivateSlot(oldest);
    return oldest;
  }

  private deactivateSlot(slot: HeartBurstSlot): void {
    slot.active = false;
    slot.elapsed = 0;
    slot.group.visible = false;
    for (const particle of slot.particles) {
      particle.material.opacity = 0;
      particle.mesh.visible = false;
    }
  }
}
