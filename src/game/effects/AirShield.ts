import * as THREE from 'three';

export type ShieldMode = 'OFF' | 'BOOST' | 'INVINCIBLE';

const INVINCIBLE_OPACITY_BASE = 0.30;
const INVINCIBLE_OPACITY_PULSE = 0.20;
const INVINCIBLE_PULSE_HZ = 3;

export class AirShield {
  private mesh: THREE.Mesh;
  private material: THREE.MeshBasicMaterial;
  private elapsedTime = 0;
  private mode: ShieldMode = 'OFF';
  private lastMode: ShieldMode | null = null;
  private opacityScale = 1;

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
    if (this.mode === 'OFF') return;

    this.elapsedTime += deltaTime;

    if (this.mode === 'BOOST') {
      const pulse = Math.sin(this.elapsedTime * 5 * Math.PI * 2) * 0.5 + 0.5;
      this.material.opacity = 0.25 + pulse * 0.10;
      return;
    }

    // INVINCIBLE: ~3Hz pulse, multiplied by opacityScale (1 during SLOWDOWN,
    // fading 1→0 during RECOVERING) so that returning to NORMAL hides it.
    const pulse = Math.sin(this.elapsedTime * INVINCIBLE_PULSE_HZ * Math.PI * 2) * 0.5 + 0.5;
    const base = INVINCIBLE_OPACITY_BASE + pulse * INVINCIBLE_OPACITY_PULSE;
    const scale = Math.max(0, Math.min(1, this.opacityScale));
    this.material.opacity = base * scale;
  }

  /**
   * Backward-compatible boost-only API. Internally delegates to setShieldMode.
   */
  setBoostMode(active: boolean): void {
    this.setShieldMode(active ? 'BOOST' : 'OFF');
  }

  /**
   * Set the shield mode and (for INVINCIBLE) the fade scale 0..1.
   * opacityScale is applied every frame in update() so callers can pass a
   * monotonically-decreasing value during RECOVERING to fade the shield out.
   */
  setShieldMode(mode: ShieldMode, opacityScale: number = 1): void {
    this.opacityScale = opacityScale;
    if (mode === this.lastMode) return;
    this.lastMode = mode;
    this.mode = mode;

    if (mode === 'BOOST') {
      this.mesh.visible = true;
      this.mesh.scale.set(1.0, 0.8, 2.0);
      this.material.color.setHex(0x88ddff);
    } else if (mode === 'INVINCIBLE') {
      this.mesh.visible = true;
      this.mesh.scale.set(1.2, 1.0, 1.6);
      this.material.color.setHex(0xff88aa);
    } else {
      this.mesh.visible = false;
      this.material.color.setHex(0x44aaff);
    }
  }

  getMode(): ShieldMode {
    return this.mode;
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
