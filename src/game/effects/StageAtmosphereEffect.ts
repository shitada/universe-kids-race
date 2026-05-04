import * as THREE from 'three';
import type { MotionSensitivity, StageAtmosphereConfig, StageAtmosphereParticlePattern } from '../../types';
import { getMotionSensitivityProfile } from '../accessibility/motionSensitivity';

interface ParticleState {
  angle: number;
  radius: number;
  height: number;
  depth: number;
  speed: number;
  phase: number;
  drift: number;
}

export class StageAtmosphereEffect {
  private static readonly QUALITY_SCALES = [0.45, 0.7, 1] as const;
  private static readonly GRADIENT_STEPS = 32;
  private static readonly PLANE_DISTANCE = 900;

  private readonly group = new THREE.Group();
  private readonly backdropAnchor = new THREE.Group();
  private readonly particleAnchor = new THREE.Group();
  private readonly backdropMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    depthTest: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  private readonly backdropMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    this.backdropMaterial,
  );
  private readonly particleGeometry = new THREE.BufferGeometry();
  private readonly particleMaterial = new THREE.PointsMaterial({
    size: 0.34,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    toneMapped: false,
  });
  private readonly particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
  private scene: THREE.Scene | null = null;
  private activeConfig: StageAtmosphereConfig | null = null;
  private qualityTier = StageAtmosphereEffect.QUALITY_SCALES.length - 1;
  private elapsed = 0;
  private active = false;
  private gradientTexture: THREE.DataTexture | null = null;
  private particleStates: ParticleState[] = [];
  private particlePositions = new Float32Array(0);
  private motionSensitivity: MotionSensitivity = 'strong';

  constructor() {
    this.group.visible = false;
    this.backdropMesh.renderOrder = -20;
    this.backdropMesh.frustumCulled = false;
    this.particleSystem.renderOrder = -5;
    this.particleSystem.frustumCulled = false;
    this.particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(0), 3));
    this.backdropAnchor.add(this.backdropMesh);
    this.particleAnchor.add(this.particleSystem);
    this.group.add(this.backdropAnchor);
    this.group.add(this.particleAnchor);
  }

  init(scene: THREE.Scene): void {
    if (this.scene) {
      return;
    }
    this.scene = scene;
    scene.add(this.group);
  }

  start(config: StageAtmosphereConfig): void {
    this.activeConfig = config;
    this.elapsed = 0;
    this.active = true;
    this.group.visible = true;
    this.backdropMesh.visible = true;
    this.particleSystem.visible = true;
    this.applyMotionSensitivityToMaterial(config);
    this.updateGradientTexture(config.gradientTopColor, config.gradientBottomColor);
    this.rebuildParticles(config);
    this.applyQualityTier();
  }

  clear(): void {
    this.active = false;
    this.activeConfig = null;
    this.elapsed = 0;
    this.group.visible = false;
    this.backdropMesh.visible = false;
    this.particleSystem.visible = false;
    this.particleGeometry.setDrawRange(0, 0);
  }

  update(deltaTime: number, camera: THREE.PerspectiveCamera, shipX: number, shipZ: number): void {
    if (!this.scene || !this.active || !this.activeConfig) {
      return;
    }

    this.elapsed += Math.max(0, deltaTime) * getMotionSensitivityProfile(this.motionSensitivity).animationSpeedScale;
    this.syncBackdrop(camera);
    this.syncParticles(shipX, shipZ, this.activeConfig.particlePattern);
  }

  setQualityTier(tier: number): void {
    const maxTier = StageAtmosphereEffect.QUALITY_SCALES.length - 1;
    this.qualityTier = Math.max(0, Math.min(maxTier, Math.round(tier)));
    this.applyQualityTier();
  }

  setMotionSensitivity(sensitivity: MotionSensitivity): void {
    this.motionSensitivity = sensitivity;
    if (this.activeConfig) {
      this.applyMotionSensitivityToMaterial(this.activeConfig);
    }
    this.applyQualityTier();
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getBackdropMesh(): THREE.Mesh {
    return this.backdropMesh;
  }

  getParticleSystem(): THREE.Points {
    return this.particleSystem;
  }

  getActiveConfig(): StageAtmosphereConfig | null {
    return this.activeConfig;
  }

  isActive(): boolean {
    return this.active;
  }

  private applyQualityTier(): void {
    if (!this.activeConfig) {
      this.particleGeometry.setDrawRange(0, 0);
      return;
    }
    const scale = StageAtmosphereEffect.QUALITY_SCALES[this.qualityTier];
    const motionProfile = getMotionSensitivityProfile(this.motionSensitivity);
    this.particleGeometry.setDrawRange(
      0,
      Math.max(1, Math.round(this.activeConfig.particleCount * scale * motionProfile.particleDensityScale)),
    );
  }

  private applyMotionSensitivityToMaterial(config: StageAtmosphereConfig): void {
    const motionProfile = getMotionSensitivityProfile(this.motionSensitivity);
    this.particleMaterial.size = config.particleSize * motionProfile.effectSizeScale;
    this.particleMaterial.opacity =
      (config.particlePattern === 'mist' ? 0.5 : 0.72) * (0.7 + motionProfile.effectSizeScale * 0.3);
  }

  private rebuildParticles(config: StageAtmosphereConfig): void {
    this.particleStates = [];
    this.particlePositions = new Float32Array(config.particleCount * 3);
    const colors = new Float32Array(config.particleCount * 3);
    const primary = new THREE.Color(config.particlePrimaryColor);
    const secondary = new THREE.Color(config.particleSecondaryColor);

    for (let index = 0; index < config.particleCount; index += 1) {
      const blend = config.particleCount <= 1 ? 0 : index / (config.particleCount - 1);
      const color = primary.clone().lerp(secondary, blend * 0.75);
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      this.particleStates.push(this.createParticleState(index, config));
    }

    this.particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.syncParticles(0, 0, config.particlePattern);
  }

  private createParticleState(index: number, config: StageAtmosphereConfig): ParticleState {
    const ratio = config.particleCount <= 1 ? 0 : index / (config.particleCount - 1);
    return {
      angle: ratio * Math.PI * 2,
      radius: 1.4 + (index % 6) * 0.45,
      height: -1.8 + (index % 7) * 0.55,
      depth: -10 - (index % 5) * 2.8,
      speed: 0.55 + (index % 4) * 0.14,
      phase: index * 0.37,
      drift: (index % 3) - 1,
    };
  }

  private syncBackdrop(camera: THREE.PerspectiveCamera): void {
    const distance = StageAtmosphereEffect.PLANE_DISTANCE;
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const height = 2 * Math.tan(halfFov) * distance;
    const width = height * camera.aspect;
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    this.backdropAnchor.position.copy(camera.position).addScaledVector(direction, distance);
    this.backdropAnchor.quaternion.copy(camera.quaternion);
    this.backdropMesh.scale.set(width, height, 1);
  }

  private syncParticles(shipX: number, shipZ: number, pattern: StageAtmosphereParticlePattern): void {
    this.particleAnchor.position.set(shipX, 0, shipZ);
    const positions = this.particleGeometry.getAttribute('position') as THREE.BufferAttribute;

    for (let index = 0; index < this.particleStates.length; index += 1) {
      const state = this.particleStates[index];
      const base = index * 3;
      const time = this.elapsed * state.speed + state.phase;
      const x = this.getParticleX(pattern, state, time);
      const y = this.getParticleY(pattern, state, time);
      const z = this.getParticleZ(pattern, state, time);

      this.particlePositions[base] = x;
      this.particlePositions[base + 1] = y;
      this.particlePositions[base + 2] = z;
    }

    positions.needsUpdate = true;
  }

  private getParticleX(pattern: StageAtmosphereParticlePattern, state: ParticleState, time: number): number {
    switch (pattern) {
      case 'ring':
        return Math.cos(time + state.angle) * (4 + (state.radius - 1.4) * 0.35);
      case 'aurora':
        return -6 + (state.angle / (Math.PI * 2)) * 12;
      case 'crystal':
        return Math.cos(time + state.angle) * (1.8 + state.radius * 0.3);
      case 'flare':
        return Math.sin(time * 2.2 + state.phase) * 2.3 + state.drift * 0.4;
      case 'homecoming':
        return Math.cos(time + state.angle) * 2.1 + Math.sin(time * 0.6) * 0.4;
      case 'ember':
        return Math.sin(time + state.phase) * (1.8 + state.radius * 0.15);
      case 'mist':
        return Math.cos(time * 0.65 + state.phase) * (2.6 + state.radius * 0.2);
      case 'dust':
        return Math.sin(time * 1.4 + state.angle) * (2 + state.radius * 0.24);
      case 'sparkle':
      default:
        return Math.cos(time + state.angle) * (2.2 + state.radius * 0.2);
    }
  }

  private getParticleY(pattern: StageAtmosphereParticlePattern, state: ParticleState, time: number): number {
    switch (pattern) {
      case 'ring':
        return Math.sin((time + state.angle) * 2) * 0.25;
      case 'aurora':
        return Math.sin(time * 1.8 + state.phase) * 1.6;
      case 'crystal':
        return Math.sin(time * 1.5 + state.phase) * 1.3;
      case 'flare':
        return Math.cos(time * 2.6 + state.phase) * 1.4;
      case 'homecoming':
        return 0.8 + Math.sin(time * 1.3 + state.phase) * 0.9;
      case 'ember':
        return ((time + state.phase) % 3.4) - 1.7;
      case 'mist':
        return state.height * 0.4 + Math.sin(time + state.phase) * 0.8;
      case 'dust':
        return Math.sin(time * 1.2 + state.phase) * 0.5;
      case 'sparkle':
      default:
        return state.height * 0.35 + Math.sin(time * 2.4 + state.phase) * 0.45;
    }
  }

  private getParticleZ(pattern: StageAtmosphereParticlePattern, state: ParticleState, time: number): number {
    switch (pattern) {
      case 'ring':
        return -18 + Math.sin(time + state.angle) * (2 + (state.radius - 1.4) * 0.2);
      case 'aurora':
        return -16 + Math.cos(time + state.phase) * 1.4;
      case 'crystal':
        return -14 + Math.sin(time + state.angle) * (2.4 + state.radius * 0.1);
      case 'flare':
        return -16 + Math.cos(time * 1.7 + state.phase) * 3.2;
      case 'homecoming':
        return -15 + Math.sin(time + state.angle) * 1.8;
      case 'ember':
        return state.depth + Math.cos(time + state.phase) * 1.4;
      case 'mist':
        return -14 + Math.sin(time * 0.8 + state.angle) * 3.2;
      case 'dust':
        return state.depth + Math.cos(time * 1.1 + state.phase) * 2.1;
      case 'sparkle':
      default:
        return -13 + Math.sin(time + state.angle) * 2.2;
    }
  }

  private updateGradientTexture(topColorHex: number, bottomColorHex: number): void {
    const steps = StageAtmosphereEffect.GRADIENT_STEPS;
    const topColor = new THREE.Color(topColorHex);
    const bottomColor = new THREE.Color(bottomColorHex);
    const data = new Uint8Array(steps * 4);
    const mixColor = new THREE.Color();

    for (let index = 0; index < steps; index += 1) {
      const t = steps <= 1 ? 0 : index / (steps - 1);
      mixColor.copy(bottomColor).lerp(topColor, t);
      data[index * 4] = Math.round(mixColor.r * 255);
      data[index * 4 + 1] = Math.round(mixColor.g * 255);
      data[index * 4 + 2] = Math.round(mixColor.b * 255);
      data[index * 4 + 3] = 255;
    }

    this.gradientTexture?.dispose();
    this.gradientTexture = new THREE.DataTexture(data, 1, steps, THREE.RGBAFormat);
    this.gradientTexture.colorSpace = THREE.SRGBColorSpace;
    this.gradientTexture.magFilter = THREE.LinearFilter;
    this.gradientTexture.minFilter = THREE.LinearFilter;
    this.gradientTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.gradientTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.gradientTexture.needsUpdate = true;
    this.backdropMaterial.map = this.gradientTexture;
    this.backdropMaterial.needsUpdate = true;
  }
}
