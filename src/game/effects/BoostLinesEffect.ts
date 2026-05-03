import * as THREE from 'three';

/**
 * ブースト中に船の周囲に表示される速度ラインのエフェクト。
 *
 * StageScene から抽出。20 本の LineSegments を 1 度だけ確保し、
 * 毎フレーム頂点バッファのみ更新して再利用する。可視/不可視の
 * 切替時の冗長な書き込みを避けるため `lastVisible` をキャッシュする。
 */
export class BoostLinesEffect {
  private static readonly VISUAL_QUALITY_SCALE_BY_TIER = [0.45, 0.7, 1];
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
  private qualityTier = BoostLinesEffect.VISUAL_QUALITY_SCALE_BY_TIER.length - 1;

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
    this.lines.geometry.setDrawRange(0, this.getActiveLineCount() * 2);
    this.lastVisible = false;
    scene.add(this.lines);
  }

  setQualityTier(tier: number): void {
    this.qualityTier = BoostLinesEffect.clampQualityTier(tier);
    this.lines?.geometry.setDrawRange(0, this.getActiveLineCount() * 2);
    this.writeCursor = 0;
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
    const activeLineCount = this.getActiveLineCount();
    const isFirstBoostFrame = this.lastVisible !== true;
    // boost 開始フレームは初期見栄え担保のため全 20 本を一度に書き込み、
    // 以降は LINES_PER_FRAME 本ずつ round-robin で更新する。
    const updateCount = isFirstBoostFrame
      ? activeLineCount
      : Math.min(BoostLinesEffect.LINES_PER_FRAME, activeLineCount);
    const startIndex = isFirstBoostFrame ? 0 : this.writeCursor;
    for (let n = 0; n < updateCount; n++) {
      const i = (startIndex + n) % activeLineCount;
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
      this.writeCursor = (this.writeCursor + updateCount) % activeLineCount;
    }
    this.positionAttr!.clearUpdateRanges();
    const wrappedCount = startIndex + updateCount - activeLineCount;
    if (wrappedCount > 0) {
      this.positionAttr!.addUpdateRange(startIndex * 6, (updateCount - wrappedCount) * 6);
      this.positionAttr!.addUpdateRange(0, wrappedCount * 6);
    } else {
      this.positionAttr!.addUpdateRange(startIndex * 6, updateCount * 6);
    }
    this.positionAttr!.needsUpdate = true;
    if (this.lastVisible !== true) {
      this.lines.geometry.setDrawRange(0, activeLineCount * 2);
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

  private getActiveLineCount(): number {
    return Math.max(
      1,
      Math.round(BoostLinesEffect.LINE_COUNT * BoostLinesEffect.getQualityScale(this.qualityTier)),
    );
  }

  private static clampQualityTier(tier: number): number {
    const maxTier = BoostLinesEffect.VISUAL_QUALITY_SCALE_BY_TIER.length - 1;
    return Math.max(0, Math.min(maxTier, Math.round(tier)));
  }

  private static getQualityScale(tier: number): number {
    return BoostLinesEffect.VISUAL_QUALITY_SCALE_BY_TIER[BoostLinesEffect.clampQualityTier(tier)];
  }
}
