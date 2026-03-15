import * as THREE from 'three';

export class AirShield {
  private mesh: THREE.Mesh;
  private material: THREE.MeshBasicMaterial;
  private elapsedTime = 0;
  private isBoosting = false;

  constructor() {
    const geometry = new THREE.SphereGeometry(1.5, 16, 16);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x44aaff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.visible = false;
  }

  update(deltaTime: number): void {
    if (!this.isBoosting) return;

    this.elapsedTime += deltaTime;
    const pulse = Math.sin(this.elapsedTime * 5 * Math.PI * 2) * 0.5 + 0.5;
    this.material.opacity = 0.25 + pulse * 0.10;
  }

  setBoostMode(active: boolean): void {
    this.isBoosting = active;
    if (active) {
      this.mesh.visible = true;
      this.mesh.scale.set(1.0, 0.8, 2.0);
      this.material.color.setHex(0x88ddff);
    } else {
      this.mesh.visible = false;
      this.material.color.setHex(0x44aaff);
    }
  }

  setPosition(x: number, y: number, z: number): void {
    this.mesh.position.set(x, y, z);
  }

  getMesh(): THREE.Mesh {
    return this.mesh;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
