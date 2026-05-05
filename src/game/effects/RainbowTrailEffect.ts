import * as THREE from 'three';

const RAINBOW_TRAIL_DURATION = 6;
const RAINBOW_TRAIL_SAMPLE_INTERVAL = 0.05;
const RAINBOW_TRAIL_POINT_COUNT = 18;
const RAINBOW_TRAIL_COLORS = [0xff5f6d, 0xff9f43, 0xffe066, 0x6bff95, 0x4dabf7, 0xb197fc] as const;
const RAINBOW_TRAIL_BAND_OFFSETS = [0.22, 0.13, 0.04, -0.04, -0.13, -0.22] as const;
const RAINBOW_TRAIL_BASE_OPACITY = [0.9, 0.82, 0.76, 0.72, 0.68, 0.64] as const;

export class RainbowTrailEffect {
  readonly group: THREE.Group;
  private readonly history = new Float32Array(RAINBOW_TRAIL_POINT_COUNT * 3);
  private readonly lines: THREE.Line[] = [];
  private remainingTime = 0;
  private sampleTimer = 0;
  private active = false;

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'rainbow-trail-effect';
    this.group.visible = false;

    for (let i = 0; i < RAINBOW_TRAIL_COLORS.length; i++) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(RAINBOW_TRAIL_POINT_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage),
      );
      geometry.setDrawRange(0, RAINBOW_TRAIL_POINT_COUNT);
      const material = new THREE.LineBasicMaterial({
        color: RAINBOW_TRAIL_COLORS[i],
        transparent: true,
        opacity: RAINBOW_TRAIL_BASE_OPACITY[i],
      });
      const line = new THREE.Line(geometry, material);
      line.frustumCulled = false;
      this.lines.push(line);
      this.group.add(line);
    }
  }

  start(position: THREE.Vector3Like): void {
    this.active = true;
    this.remainingTime = RAINBOW_TRAIL_DURATION;
    this.sampleTimer = 0;
    this.fillHistory(position);
    this.syncGeometry();
    this.group.visible = true;
  }

  update(deltaTime: number, position: THREE.Vector3Like): void {
    if (!this.active) {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - deltaTime);
    this.sampleTimer += deltaTime;

    if (this.sampleTimer >= RAINBOW_TRAIL_SAMPLE_INTERVAL) {
      while (this.sampleTimer >= RAINBOW_TRAIL_SAMPLE_INTERVAL) {
        this.pushSample(position);
        this.sampleTimer -= RAINBOW_TRAIL_SAMPLE_INTERVAL;
      }
    } else {
      this.history[0] = position.x;
      this.history[1] = position.y;
      this.history[2] = position.z;
    }

    this.syncGeometry();

    if (this.remainingTime === 0) {
      this.clear();
    }
  }

  clear(): void {
    this.active = false;
    this.remainingTime = 0;
    this.sampleTimer = 0;
    this.group.visible = false;
  }

  isActive(): boolean {
    return this.active;
  }

  dispose(): void {
    this.clear();
    this.group.parent?.remove(this.group);
    for (const line of this.lines) {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    }
  }

  private fillHistory(position: THREE.Vector3Like): void {
    for (let i = 0; i < this.history.length; i += 3) {
      this.history[i] = position.x;
      this.history[i + 1] = position.y;
      this.history[i + 2] = position.z;
    }
  }

  private pushSample(position: THREE.Vector3Like): void {
    this.history.copyWithin(3, 0, this.history.length - 3);
    this.history[0] = position.x;
    this.history[1] = position.y;
    this.history[2] = position.z;
  }

  private syncGeometry(): void {
    const fade = Math.max(0.25, this.remainingTime / RAINBOW_TRAIL_DURATION);
    for (let band = 0; band < this.lines.length; band++) {
      const line = this.lines[band];
      const positions = (line.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
      const yOffset = RAINBOW_TRAIL_BAND_OFFSETS[band];
      for (let i = 0; i < this.history.length; i += 3) {
        positions[i] = this.history[i];
        positions[i + 1] = this.history[i + 1] + yOffset;
        positions[i + 2] = this.history[i + 2];
      }
      (line.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (line.material as THREE.LineBasicMaterial).opacity = RAINBOW_TRAIL_BASE_OPACITY[band] * fade;
    }
  }
}
