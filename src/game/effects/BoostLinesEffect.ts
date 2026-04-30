import * as THREE from 'three';

/**
 * ブースト中に船の周囲に表示される速度ラインのエフェクト。
 *
 * StageScene から抽出。20 本の LineSegments を 1 度だけ確保し、
 * 毎フレーム頂点バッファのみ更新して再利用する。可視/不可視の
 * 切替時の冗長な書き込みを避けるため `lastVisible` をキャッシュする。
 */
export class BoostLinesEffect {
  // 20 line segments × 2 endpoints × 3 floats = 120
  private static readonly LINE_COUNT = 20;
  private static readonly POSITION_FLOATS = BoostLinesEffect.LINE_COUNT * 6;

  private scene: THREE.Scene | null = null;
  private lines: THREE.LineSegments | null = null;
  private positions: Float32Array | null = null;
  private positionAttr: THREE.BufferAttribute | null = null;
  // null means "unknown / needs to be re-asserted on the next write".
  private lastVisible: boolean | null = null;

  init(scene: THREE.Scene): void {
    if (this.lines) return;
    this.scene = scene;
    this.positions = new Float32Array(BoostLinesEffect.POSITION_FLOATS);
    const geo = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(this.positions, 3);
    geo.setAttribute('position', positionAttr);
    this.positionAttr = positionAttr;
    const mat = new THREE.LineBasicMaterial({ color: 0x00ddff, transparent: true, opacity: 0.6 });
    this.lines = new THREE.LineSegments(geo, mat);
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    this.lastVisible = false;
    scene.add(this.lines);
  }

  update(boostActive: boolean, shipX: number, shipZ: number): void {
    if (!this.lines || !this.positions) return;

    if (!boostActive) {
      if (this.lastVisible !== false) {
        this.lines.visible = false;
        this.lastVisible = false;
      }
      return;
    }

    const pos = this.positions;
    for (let i = 0; i < BoostLinesEffect.LINE_COUNT; i++) {
      const x = shipX + (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 3;
      const z = shipZ + 2 + Math.random() * 8;
      const base = i * 6;
      pos[base] = x;
      pos[base + 1] = y;
      pos[base + 2] = z;
      pos[base + 3] = x;
      pos[base + 4] = y;
      pos[base + 5] = z + 2 + Math.random() * 3;
    }
    this.positionAttr!.needsUpdate = true;
    if (this.lastVisible !== true) {
      this.lines.visible = true;
      this.lastVisible = true;
    }
  }

  getObject(): THREE.LineSegments | null {
    return this.lines;
  }

  dispose(): void {
    if (this.lines) {
      this.scene?.remove(this.lines);
      this.lines.geometry.dispose();
      (this.lines.material as THREE.Material).dispose();
      this.lines = null;
    }
    this.positions = null;
    this.positionAttr = null;
    this.lastVisible = null;
    this.scene = null;
  }
}
