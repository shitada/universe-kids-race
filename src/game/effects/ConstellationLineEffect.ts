import * as THREE from 'three';
import type { ConstellationPoint } from '../../types';

export class ConstellationLineEffect {
  private static readonly MAX_SEGMENTS = 8;

  private scene: THREE.Scene | null = null;
  private lines: THREE.LineSegments | null = null;
  private positions: Float32Array | null = null;
  private positionAttribute: THREE.BufferAttribute | null = null;
  private segmentCount = 0;
  private pulseTime = 0;

  init(scene: THREE.Scene): void {
    if (this.lines) {
      return;
    }

    this.scene = scene;
    this.positions = new Float32Array(ConstellationLineEffect.MAX_SEGMENTS * 6);
    const geometry = new THREE.BufferGeometry();
    this.positionAttribute = new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', this.positionAttribute);
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({
      color: 0x8ae8ff,
      transparent: true,
      opacity: 0.8,
    });
    this.lines = new THREE.LineSegments(geometry, material);
    this.lines.visible = false;
    this.lines.frustumCulled = false;
    scene.add(this.lines);
  }

  addSegment(from: ConstellationPoint, to: ConstellationPoint): void {
    if (!this.lines || !this.positions || !this.positionAttribute) {
      return;
    }
    if (this.segmentCount >= ConstellationLineEffect.MAX_SEGMENTS) {
      return;
    }

    const base = this.segmentCount * 6;
    this.positions[base] = from.x;
    this.positions[base + 1] = from.y;
    this.positions[base + 2] = from.z;
    this.positions[base + 3] = to.x;
    this.positions[base + 4] = to.y;
    this.positions[base + 5] = to.z;
    this.segmentCount += 1;
    this.positionAttribute.clearUpdateRanges();
    this.positionAttribute.addUpdateRange(base, 6);
    this.positionAttribute.needsUpdate = true;
    this.lines.geometry.setDrawRange(0, this.segmentCount * 2);
    this.lines.visible = this.segmentCount > 0;
  }

  update(deltaTime: number): void {
    if (!this.lines) {
      return;
    }
    this.pulseTime += deltaTime;
    const material = this.lines.material as THREE.LineBasicMaterial;
    material.opacity = 0.58 + (Math.sin(this.pulseTime * 4) + 1) * 0.16;
  }

  clear(): void {
    this.segmentCount = 0;
    this.pulseTime = 0;
    if (!this.lines) {
      return;
    }
    this.lines.visible = false;
    this.lines.geometry.setDrawRange(0, 0);
  }

  getObject(): THREE.LineSegments | null {
    return this.lines;
  }
}
