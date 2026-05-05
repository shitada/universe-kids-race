import * as THREE from 'three';

export class SpaceGemCollectionEffect {
  private scene: THREE.Scene | null = null;
  private readonly group = new THREE.Group();
  private readonly ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  private readonly glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  private readonly sparkMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  private readonly ring = new THREE.Mesh(new THREE.RingGeometry(0.55, 1.05, 32), this.ringMaterial);
  private readonly glow = new THREE.Mesh(new THREE.SphereGeometry(0.74, 16, 16), this.glowMaterial);
  private readonly sparks = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), this.sparkMaterial);
  private active = false;
  private timer = 0;

  constructor() {
    this.group.visible = false;
    this.ring.rotation.x = Math.PI / 2;
    this.sparks.scale.set(0.7, 1.2, 0.7);
    this.group.add(this.ring, this.glow, this.sparks);
  }

  init(scene: THREE.Scene): void {
    this.scene = scene;
    scene.add(this.group);
  }

  emit(position: { x: number; y: number; z: number }, color: number): void {
    this.group.position.set(position.x, position.y, position.z);
    this.ringMaterial.color.setHex(color);
    this.glowMaterial.color.setHex(color);
    this.sparkMaterial.color.setHex(color);
    this.group.visible = true;
    this.group.scale.setScalar(1);
    this.glow.scale.setScalar(1);
    this.sparks.scale.set(0.7, 1.2, 0.7);
    this.ringMaterial.opacity = 0.82;
    this.glowMaterial.opacity = 0.42;
    this.sparkMaterial.opacity = 0.95;
    this.timer = 0;
    this.active = true;
  }

  update(deltaTime: number): void {
    if (!this.active) {
      return;
    }
    this.timer += deltaTime;
    const progress = Math.min(this.timer / 0.75, 1);
    this.group.rotation.z += deltaTime * 3.2;
    this.ring.scale.setScalar(1 + progress * 2.6);
    this.glow.scale.setScalar(1 + progress * 1.8);
    this.sparks.scale.setScalar(1 + progress * 1.4);
    this.group.scale.setScalar(1 + progress * 0.28);
    this.ringMaterial.opacity = 0.82 * (1 - progress);
    this.glowMaterial.opacity = 0.42 * (1 - progress);
    this.sparkMaterial.opacity = 0.95 * (1 - progress);
    if (progress >= 1) {
      this.clear();
    }
  }

  clear(): void {
    this.active = false;
    this.timer = 0;
    this.group.visible = false;
  }

  dispose(): void {
    this.clear();
    this.scene?.remove(this.group);
    this.ring.geometry.dispose();
    this.glow.geometry.dispose();
    this.sparks.geometry.dispose();
    this.ringMaterial.dispose();
    this.glowMaterial.dispose();
    this.sparkMaterial.dispose();
  }
}
