import * as THREE from 'three';

const RAY_COUNT = 10;
const SPARKLE_COUNT = 24;
const DURATION = 1.25;

export class ConstellationCelebrationEffect {
  private scene: THREE.Scene | null = null;
  private readonly group = new THREE.Group();
  private readonly rayGroup = new THREE.Group();
  private readonly ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x8ae8ff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  private readonly glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  private readonly sparkleMaterial = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  private readonly ring = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.45, 48), this.ringMaterial);
  private readonly glow = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 20), this.glowMaterial);
  private readonly sparkles: THREE.Points;
  private readonly sparklePositions = new Float32Array(SPARKLE_COUNT * 3);
  private readonly sparkleColors = new Float32Array(SPARKLE_COUNT * 3);
  private readonly sparkleDirections = Array.from({ length: SPARKLE_COUNT }, (_, index) => {
    const angle = (index / SPARKLE_COUNT) * Math.PI * 2;
    const lift = ((index % 6) - 2.5) * 0.12;
    return new THREE.Vector3(Math.cos(angle), Math.sin(angle), lift).normalize();
  });
  private readonly sparkleSpeed = Array.from({ length: SPARKLE_COUNT }, (_, index) => 1.4 + (index % 5) * 0.33);
  private readonly sparkleColor = new THREE.Color();
  private readonly baseColor = new THREE.Color(0x8ae8ff);
  private readonly glowColor = new THREE.Color(0xffffff);
  private readonly whiteColor = new THREE.Color(0xffffff);
  private readonly rayGeometry = new THREE.PlaneGeometry(0.18, 3.6);
  private readonly rayMaterials: THREE.MeshBasicMaterial[] = [];
  private readonly rays: THREE.Mesh[] = [];
  private active = false;
  private elapsed = 0;

  constructor() {
    this.group.visible = false;
    this.group.frustumCulled = false;
    this.ring.rotation.x = Math.PI / 2;
    this.glow.scale.set(1.2, 1.2, 1.2);
    this.rayGroup.rotation.x = Math.PI / 2;
    this.rayGroup.position.z = -0.05;
    this.rayGeometry.translate(0, 1.8, 0);
    for (let i = 0; i < RAY_COUNT; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(i / RAY_COUNT, 0.95, 0.64),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ray = new THREE.Mesh(this.rayGeometry, material);
      ray.rotation.z = (i / RAY_COUNT) * Math.PI * 2;
      ray.scale.setScalar(0.9);
      ray.frustumCulled = false;
      this.rayMaterials.push(material);
      this.rays.push(ray);
      this.rayGroup.add(ray);
    }

    const sparkleGeometry = new THREE.BufferGeometry();
    sparkleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.sparklePositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    sparkleGeometry.setAttribute('color', new THREE.BufferAttribute(this.sparkleColors, 3));
    sparkleGeometry.setDrawRange(0, SPARKLE_COUNT);
    this.sparkles = new THREE.Points(sparkleGeometry, this.sparkleMaterial);
    this.sparkles.frustumCulled = false;

    this.group.add(this.glow, this.ring, this.rayGroup, this.sparkles);
  }

  init(scene: THREE.Scene): void {
    if (this.scene === scene && this.group.parent === scene) {
      return;
    }
    this.scene?.remove(this.group);
    this.scene = scene;
    scene.add(this.group);
  }

  play(position: { x: number; y: number; z: number }, color = 0x8ae8ff): void {
    this.baseColor.setHex(color);
    this.group.position.set(position.x, position.y, position.z);
    this.group.rotation.set(0, 0, 0);
    this.rayGroup.rotation.set(Math.PI / 2, 0, 0);
    this.ring.scale.setScalar(0.65);
    this.glow.scale.setScalar(0.9);
    this.ringMaterial.color.copy(this.baseColor);
    this.ringMaterial.opacity = 0.92;
    this.glowColor.copy(this.baseColor).lerp(this.whiteColor, 0.45);
    this.glowMaterial.color.copy(this.glowColor);
    this.glowMaterial.opacity = 0.52;
    this.sparkleMaterial.opacity = 0.98;

    for (let i = 0; i < RAY_COUNT; i++) {
      const hue = (i / RAY_COUNT + 0.08) % 1;
      this.rayMaterials[i].color.setHSL(hue, 0.96, 0.68);
      this.rayMaterials[i].opacity = 0.6;
      this.rays[i].scale.set(1, 0.85, 1);
    }

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const i3 = i * 3;
      this.sparklePositions[i3] = 0;
      this.sparklePositions[i3 + 1] = 0;
      this.sparklePositions[i3 + 2] = 0;
      this.sparkleColor.setHSL((i / SPARKLE_COUNT + 0.12) % 1, 0.92, 0.72);
      this.sparkleColors[i3] = this.sparkleColor.r;
      this.sparkleColors[i3 + 1] = this.sparkleColor.g;
      this.sparkleColors[i3 + 2] = this.sparkleColor.b;
    }

    (this.sparkles.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this.sparkles.geometry.getAttribute('color') as THREE.BufferAttribute).needsUpdate = true;
    this.group.visible = true;
    this.active = true;
    this.elapsed = 0;
  }

  update(deltaTime: number): void {
    if (!this.active) {
      return;
    }

    this.elapsed += deltaTime;
    const progress = Math.min(this.elapsed / DURATION, 1);
    const fade = 1 - progress;
    const burst = Math.sin(progress * Math.PI);

    this.group.rotation.z += deltaTime * 1.4;
    this.rayGroup.rotation.z += deltaTime * 0.8;
    this.ring.scale.setScalar(0.65 + progress * 2.8);
    this.glow.scale.setScalar(0.9 + burst * 1.5);
    this.ringMaterial.opacity = 0.92 * fade;
    this.glowMaterial.opacity = 0.52 * fade;
    this.sparkleMaterial.opacity = 0.95 * fade;

    for (let i = 0; i < RAY_COUNT; i++) {
      const pulse = 0.78 + Math.sin(this.elapsed * 8 + i * 0.65) * 0.12 + burst * 0.38;
      this.rays[i].scale.y = pulse;
      this.rayMaterials[i].opacity = (0.34 + burst * 0.26) * fade;
    }

    const positionAttr = this.sparkles.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const i3 = i * 3;
      const distance = 0.45 + progress * (1.9 + this.sparkleSpeed[i]);
      const swirl = this.elapsed * 2.4 + i * 0.31;
      const direction = this.sparkleDirections[i];
      this.sparklePositions[i3] = direction.x * distance + Math.cos(swirl) * 0.18;
      this.sparklePositions[i3 + 1] = direction.y * distance + Math.sin(swirl) * 0.18;
      this.sparklePositions[i3 + 2] = direction.z * distance * 0.8;
    }
    positionAttr.needsUpdate = true;

    if (progress >= 1) {
      this.clear();
    }
  }

  clear(): void {
    this.active = false;
    this.elapsed = 0;
    this.group.visible = false;
  }

  getObject(): THREE.Group {
    return this.group;
  }

  dispose(): void {
    this.clear();
    this.scene?.remove(this.group);
    this.ring.geometry.dispose();
    this.glow.geometry.dispose();
    this.rayGeometry.dispose();
    this.sparkles.geometry.dispose();
    this.ringMaterial.dispose();
    this.glowMaterial.dispose();
    this.sparkleMaterial.dispose();
    for (const material of this.rayMaterials) {
      material.dispose();
    }
  }
}
