import * as THREE from 'three';

export class MeteoShowerEffect {
  private static readonly STREAK_COUNT = 12;
  private static readonly START_FLASH_DURATION = 0.7;

  private scene: THREE.Scene | null = null;
  private lines: THREE.LineSegments | null = null;
  private positions: Float32Array | null = null;
  private positionAttr: THREE.BufferAttribute | null = null;
  private burstTimer = 0;
  private elapsed = 0;
  private lastVisible: boolean | null = null;

  init(scene: THREE.Scene): void {
    if (this.lines) return;

    this.scene = scene;
    this.positions = new Float32Array(MeteoShowerEffect.STREAK_COUNT * 6);
    const geometry = new THREE.BufferGeometry();
    this.positionAttr = new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this.positionAttr);

    const material = new THREE.LineBasicMaterial({
      color: 0xaee8ff,
      transparent: true,
      opacity: 0,
    });

    this.lines = new THREE.LineSegments(geometry, material);
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    scene.add(this.lines);
  }

  start(): void {
    this.burstTimer = MeteoShowerEffect.START_FLASH_DURATION;
    this.elapsed = 0;
    if (this.lines) {
      this.lines.visible = true;
      this.lastVisible = true;
    }
  }

  update(active: boolean, deltaTime: number, shipX: number, shipZ: number): void {
    if (!this.lines || !this.positions || !this.positionAttr) return;

    this.elapsed += deltaTime;
    this.burstTimer = Math.max(0, this.burstTimer - deltaTime);
    const visible = active || this.burstTimer > 0;
    if (!visible) {
      if (this.lastVisible !== false) {
        this.lines.visible = false;
        this.lastVisible = false;
      }
      return;
    }

    const opacityBoost = active ? 1 : this.burstTimer / MeteoShowerEffect.START_FLASH_DURATION;
    const material = this.lines.material as THREE.LineBasicMaterial;
    material.opacity = 0.24 + opacityBoost * 0.54;

    for (let i = 0; i < MeteoShowerEffect.STREAK_COUNT; i++) {
      const base = i * 6;
      const direction = i % 2 === 0 ? -1 : 1;
      const lateralBand = 4.5 + (i % 3) * 1.4;
      const sway = Math.sin(this.elapsed * (2.4 + i * 0.17) + i) * 0.5;
      const x = shipX + direction * lateralBand + sway;
      const y = 0.4 + (i % 4) * 0.35 + Math.cos(this.elapsed * (1.8 + i * 0.11) + i) * 0.18;
      const z = shipZ - 18 - ((this.elapsed * 22 + i * 3.8) % 34);
      this.positions[base] = x;
      this.positions[base + 1] = y;
      this.positions[base + 2] = z;
      this.positions[base + 3] = x - direction * 2.2;
      this.positions[base + 4] = y - 0.9;
      this.positions[base + 5] = z + 6;
    }

    this.positionAttr.needsUpdate = true;
    if (this.lastVisible !== true) {
      this.lines.visible = true;
      this.lastVisible = true;
    }
  }

  clear(): void {
    this.burstTimer = 0;
    this.elapsed = 0;
    if (this.lines) {
      this.lines.visible = false;
    }
    this.lastVisible = false;
  }

  getObject(): THREE.LineSegments | null {
    return this.lines;
  }

  dispose(): void {
    if (!this.lines) return;
    this.scene?.remove(this.lines);
    this.lines.geometry.dispose();
    (this.lines.material as THREE.Material).dispose();
    this.lines = null;
    this.positions = null;
    this.positionAttr = null;
    this.scene = null;
    this.lastVisible = null;
  }
}
