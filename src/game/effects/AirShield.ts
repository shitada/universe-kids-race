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
  }

  update(deltaTime: number): void {
    this.elapsedTime += deltaTime;

    if (this.isBoosting) {
      const pulse = Math.sin(this.elapsedTime * 5 * Math.PI * 2) * 0.5 + 0.5;
      this.material.opacity = 0.25 + pulse * 0.10;
      const s = 1.25 + pulse * 0.10;
      this.mesh.scale.set(s, s, s);
    } else {
      const pulse = Math.sin(this.elapsedTime * 3 * Math.PI * 2) * 0.5 + 0.5;
      this.material.opacity = 0.10 + pulse * 0.10;
      const s = 1.00 + pulse * 0.05;
      this.mesh.scale.set(s, s, s);
    }
  }

  setBoostMode(active: boolean): void {
    this.isBoosting = active;
    if (active) {
      this.material.color.setHex(0x88ddff);
    } else {
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
