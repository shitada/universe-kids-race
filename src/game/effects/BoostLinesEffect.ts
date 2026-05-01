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
  // ブースト中の per-frame コスト削減のため、1 フレームあたり更新する本数を制限する。
  private static readonly LINES_PER_FRAME = 4;

  private scene: THREE.Scene | null = null;
  private lines: THREE.LineSegments | null = null;
  private positions: Float32Array | null = null;
  private positionAttr: THREE.BufferAttribute | null = null;
  // null means "unknown / needs to be re-asserted on the next write".
  private lastVisible: boolean | null = null;
  private writeCursor = 0;

  init(scene: THREE.Scene): void {
    if (this.lines) return;
    this.scene = scene;
    this.positions = new Float32Array(BoostLinesEffect.POSITION_FLOATS);
    const geo = new THREE.BufferGeometry();
    const positionAttr = new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage);
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
    const isFirstBoostFrame = this.lastVisible !== true;
    // boost 開始フレームは初期見栄え担保のため全 20 本を一度に書き込み、
    // 以降は LINES_PER_FRAME 本ずつ round-robin で更新する。
    const updateCount = isFirstBoostFrame
      ? BoostLinesEffect.LINE_COUNT
      : BoostLinesEffect.LINES_PER_FRAME;
    const startIndex = isFirstBoostFrame ? 0 : this.writeCursor;
    for (let n = 0; n < updateCount; n++) {
      const i = (startIndex + n) % BoostLinesEffect.LINE_COUNT;
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
    if (isFirstBoostFrame) {
      this.writeCursor = 0;
    } else {
      this.writeCursor = (this.writeCursor + BoostLinesEffect.LINES_PER_FRAME) % BoostLinesEffect.LINE_COUNT;
    }
    // ParticleBurst と同様に、実際に書き換えたスライスのみを GPU に転送する。
    // LINE_COUNT % LINES_PER_FRAME === 0 のため、round-robin の更新範囲は常に
    // ラップせず連続範囲となり、addUpdateRange 1 回で完結する。
    this.positionAttr!.clearUpdateRanges();
    this.positionAttr!.addUpdateRange(startIndex * 6, updateCount * 6);
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
    this.writeCursor = 0;
    this.scene = null;
  }
}
