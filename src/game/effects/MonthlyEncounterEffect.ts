import * as THREE from 'three';

export class MonthlyEncounterEffect {
  private scene: THREE.Scene | null = null;
  private readonly group = new THREE.Group();
  private readonly ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  });
  private readonly glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
  });
  private readonly ring = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.2, 32), this.ringMaterial);
  private readonly glow = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), this.glowMaterial);
  private active = false;
  private timer = 0;

  constructor() {
    this.group.visible = false;
    this.glow.scale.set(1.1, 1.1, 1.1);
    this.group.add(this.ring, this.glow);
  }

  init(scene: THREE.Scene): void {
    this.scene = scene;
    scene.add(this.group);
  }

  emit(position: { x: number; y: number; z: number }, color: number): void {
    this.group.position.set(position.x, position.y, position.z);
    this.ringMaterial.color.setHex(color);
    this.glowMaterial.color.setHex(color);
    this.ring.scale.setScalar(1);
    this.glow.scale.setScalar(1);
    this.ringMaterial.opacity = 0.75;
    this.glowMaterial.opacity = 0.42;
    this.group.visible = true;
    this.active = true;
    this.timer = 0;
  }

  update(deltaTime: number): void {
    if (!this.active) {
      return;
    }
    this.timer += deltaTime;
    const progress = Math.min(this.timer / 0.7, 1);
    const scale = 1 + progress * 2.3;
    this.ring.scale.setScalar(scale);
    this.glow.scale.setScalar(1 + progress * 1.4);
    this.ringMaterial.opacity = 0.75 * (1 - progress);
    this.glowMaterial.opacity = 0.42 * (1 - progress);
    this.group.rotation.z += deltaTime * 1.8;
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
    this.ringMaterial.dispose();
    this.glowMaterial.dispose();
  }
}
