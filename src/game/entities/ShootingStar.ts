import * as THREE from 'three';

const CORE_GEOMETRY = new THREE.OctahedronGeometry(0.55, 0);
const TRAIL_GEOMETRY = new THREE.CylinderGeometry(0.04, 0.18, 1.9, 8, 1, true);
const CORE_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xffffff,
  emissive: 0x99ddff,
  emissiveIntensity: 0.75,
});
const TRAIL_MATERIAL = new THREE.MeshToonMaterial({
  color: 0x66ccff,
  transparent: true,
  opacity: 0.85,
});

const SHOOTING_STAR_ANIMATION_AHEAD = 70;
const SHOOTING_STAR_ANIMATION_BEHIND = 12;
const SHOOTING_STAR_SPEED_X = 9.5;
const SHOOTING_STAR_SPEED_Y = -0.8;
const SHOOTING_STAR_SPEED_Z = 14;

export class ShootingStar {
  position: { x: number; y: number; z: number };
  readonly radius = 0.8;
  readonly bonusDuration = 6;
  readonly scoreMultiplier = 2;
  isCollected = false;
  mesh: THREE.Group;
  private readonly core: THREE.Mesh;
  private readonly trail: THREE.Mesh;
  private direction: -1 | 1;
  private elapsed = 0;

  constructor(x: number, y: number, z: number, direction: -1 | 1 = 1) {
    this.position = { x, y, z };
    this.direction = direction;
    const { group, core, trail } = this.createMesh();
    this.mesh = group;
    this.core = core;
    this.trail = trail;
    this.syncMesh();
  }

  private createMesh(): { group: THREE.Group; core: THREE.Mesh; trail: THREE.Mesh } {
    const group = new THREE.Group();
    const core = new THREE.Mesh(CORE_GEOMETRY, CORE_MATERIAL);
    const trail = new THREE.Mesh(TRAIL_GEOMETRY, TRAIL_MATERIAL);
    core.userData.sharedAssets = true;
    trail.userData.sharedAssets = true;
    trail.name = 'shooting-star-trail';
    trail.rotation.z = Math.PI / 2;
    group.add(core);
    group.add(trail);
    return { group, core, trail };
  }

  private syncMesh(): void {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.z = Math.atan2(SHOOTING_STAR_SPEED_Y, SHOOTING_STAR_SPEED_X * this.direction);
    this.trail.position.set(-this.direction * 0.95, 0, 0);
    this.trail.rotation.y = this.direction === 1 ? 0 : Math.PI;
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - SHOOTING_STAR_ANIMATION_AHEAD ||
        this.position.z > cameraZ + SHOOTING_STAR_ANIMATION_BEHIND)
    ) {
      return;
    }

    this.elapsed += deltaTime;
    this.position.x += SHOOTING_STAR_SPEED_X * this.direction * deltaTime;
    this.position.y += SHOOTING_STAR_SPEED_Y * deltaTime;
    this.position.z += SHOOTING_STAR_SPEED_Z * deltaTime;
    this.syncMesh();
    this.core.rotation.x += deltaTime * 6;
    this.core.rotation.z += deltaTime * 8;
    const pulse = 0.75 + Math.sin(this.elapsed * 18) * 0.18;
    (this.trail.material as THREE.MeshToonMaterial).opacity = pulse;
    this.trail.scale.set(1 + Math.sin(this.elapsed * 9) * 0.08, 1, 1);
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(x: number, y: number, z: number, direction: -1 | 1 = 1): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.direction = direction;
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.trail.scale.set(1, 1, 1);
    (this.trail.material as THREE.MeshToonMaterial).opacity = 0.85;
    this.syncMesh();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.trail.scale.set(1, 1, 1);
    (this.trail.material as THREE.MeshToonMaterial).opacity = 0.85;
    this.syncMesh();
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
  }
}
