import * as THREE from 'three';

const TRAIL_GEOMETRY = new THREE.CylinderGeometry(0.08, 0.34, 3.2, 10, 1, true);
const SPARK_GEOMETRY = new THREE.SphereGeometry(0.12, 10, 10);
const TRAIL_MATERIAL = new THREE.MeshToonMaterial({
  color: 0x8fe7ff,
  transparent: true,
  opacity: 0.82,
});
const SPARK_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xffffff,
  emissive: 0xa8f3ff,
  emissiveIntensity: 0.9,
});

export class CometTrailEffect {
  readonly group: THREE.Group;
  private readonly trail: THREE.Mesh;
  private readonly sparkA: THREE.Mesh;
  private readonly sparkB: THREE.Mesh;

  constructor(direction: -1 | 1 = 1) {
    this.group = new THREE.Group();
    this.group.name = 'comet-trail-effect';

    this.trail = new THREE.Mesh(TRAIL_GEOMETRY, TRAIL_MATERIAL);
    this.sparkA = new THREE.Mesh(SPARK_GEOMETRY, SPARK_MATERIAL);
    this.sparkB = new THREE.Mesh(SPARK_GEOMETRY, SPARK_MATERIAL);
    this.trail.userData.sharedAssets = true;
    this.sparkA.userData.sharedAssets = true;
    this.sparkB.userData.sharedAssets = true;

    this.trail.rotation.z = Math.PI / 2;
    this.sparkA.scale.setScalar(0.9);
    this.sparkB.scale.setScalar(0.6);

    this.group.add(this.trail);
    this.group.add(this.sparkA);
    this.group.add(this.sparkB);
    this.reset(direction);
  }

  update(elapsed: number, direction: -1 | 1): void {
    const pulse = 1 + Math.sin(elapsed * 7) * 0.14;
    this.group.scale.set(pulse, 1 + Math.sin(elapsed * 5) * 0.08, 1);
    this.sparkA.position.set(-direction * (0.85 + Math.sin(elapsed * 8) * 0.18), 0.18, 0);
    this.sparkB.position.set(-direction * (1.25 + Math.cos(elapsed * 6) * 0.16), -0.16, 0);
  }

  reset(direction: -1 | 1): void {
    this.group.scale.set(1, 1, 1);
    this.group.position.set(-direction * 1.55, 0, 0);
    this.group.rotation.y = direction === 1 ? 0 : Math.PI;
    this.sparkA.position.set(-direction * 0.85, 0.18, 0);
    this.sparkB.position.set(-direction * 1.25, -0.16, 0);
  }

  dispose(): void {
    this.group.parent?.remove(this.group);
  }
}
