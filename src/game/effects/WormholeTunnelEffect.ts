import * as THREE from 'three';
import type { MotionSensitivity, WormholeTunnelConfig } from '../../types';
import { getMotionSensitivityProfile } from '../accessibility/motionSensitivity';

interface TunnelParticleState {
  angle: number;
  radius: number;
  depthOffset: number;
  speed: number;
  phase: number;
}

interface TunnelRayState {
  angle: number;
  length: number;
  depthOffset: number;
  speed: number;
}

export class WormholeTunnelEffect {
  static readonly MAX_PARTICLES = 96;
  static readonly MAX_RAYS = 28;
  private static readonly QUALITY_SCALES = [0.45, 0.7, 1] as const;
  private static readonly ANCHOR_DISTANCE = 6;
  private static readonly TUNNEL_DEPTH = 26;

  private readonly group = new THREE.Group();
  private readonly anchor = new THREE.Group();
  private readonly flashMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    side: THREE.DoubleSide,
  });
  private readonly flashMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.flashMaterial);
  private readonly rayGeometry = new THREE.BufferGeometry();
  private readonly rayMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  private readonly raySystem = new THREE.LineSegments(this.rayGeometry, this.rayMaterial);
  private readonly particleGeometry = new THREE.BufferGeometry();
  private readonly particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    toneMapped: false,
  });
  private readonly particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
  private readonly rayPositions = new Float32Array(WormholeTunnelEffect.MAX_RAYS * 2 * 3);
  private readonly particlePositions = new Float32Array(WormholeTunnelEffect.MAX_PARTICLES * 3);
  private readonly tunnelParticles: TunnelParticleState[] = [];
  private readonly tunnelRays: TunnelRayState[] = [];
  private readonly startColor = new THREE.Color();
  private readonly targetColor = new THREE.Color();
  private readonly mixedColor = new THREE.Color();
  private readonly tempDirection = new THREE.Vector3();
  private scene: THREE.Scene | null = null;
  private active = false;
  private elapsed = 0;
  private duration = 0;
  private configuredParticleCount = 0;
  private configuredRayCount = 0;
  private qualityTier = WormholeTunnelEffect.QUALITY_SCALES.length - 1;
  private motionSensitivity: MotionSensitivity = 'strong';

  constructor() {
    this.group.visible = false;
    this.flashMesh.frustumCulled = false;
    this.flashMesh.visible = false;
    this.raySystem.frustumCulled = false;
    this.raySystem.visible = false;
    this.particleSystem.frustumCulled = false;
    this.particleSystem.visible = false;
    this.rayGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.rayPositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.particlePositions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.flashMesh.renderOrder = 90;
    this.raySystem.renderOrder = 91;
    this.particleSystem.renderOrder = 92;
    this.anchor.add(this.flashMesh);
    this.anchor.add(this.raySystem);
    this.anchor.add(this.particleSystem);
    this.group.add(this.anchor);
  }

  init(scene: THREE.Scene): void {
    if (this.scene) {
      return;
    }
    this.scene = scene;
    scene.add(this.group);
  }

  start(config: WormholeTunnelConfig): void {
    this.startColor.setHex(config.sourceColor);
    this.targetColor.setHex(config.targetColor);
    this.duration = Math.max(0.1, config.duration);
    this.elapsed = 0;
    this.active = true;
    this.group.visible = true;
    this.flashMesh.visible = true;
    this.raySystem.visible = true;
    this.particleSystem.visible = true;
    this.configuredParticleCount = Math.min(
      WormholeTunnelEffect.MAX_PARTICLES,
      Math.max(1, Math.round(config.particleCount)),
    );
    this.configuredRayCount = Math.min(
      WormholeTunnelEffect.MAX_RAYS,
      Math.max(1, Math.round(config.rayCount)),
    );
    this.rebuildStates();
    this.applyMotionSensitivity();
    this.applyQualityTier();
  }

  update(deltaTime: number, camera: THREE.PerspectiveCamera): void {
    if (!this.active) {
      return;
    }
    this.elapsed = Math.min(
      this.duration,
      this.elapsed + Math.max(0, deltaTime) * getMotionSensitivityProfile(this.motionSensitivity).animationSpeedScale,
    );
    const progress = Math.min(1, this.elapsed / this.duration);
    this.syncAnchor(camera);
    this.syncFlash(camera, progress);
    this.syncRays(progress);
    this.syncParticles(progress);
  }

  clear(): void {
    this.active = false;
    this.elapsed = 0;
    this.duration = 0;
    this.configuredParticleCount = 0;
    this.configuredRayCount = 0;
    this.group.visible = false;
    this.flashMesh.visible = false;
    this.raySystem.visible = false;
    this.particleSystem.visible = false;
    this.rayGeometry.setDrawRange(0, 0);
    this.particleGeometry.setDrawRange(0, 0);
    this.flashMaterial.opacity = 0;
  }

  setQualityTier(tier: number): void {
    const maxTier = WormholeTunnelEffect.QUALITY_SCALES.length - 1;
    this.qualityTier = Math.max(0, Math.min(maxTier, Math.round(tier)));
    this.applyQualityTier();
  }

  setMotionSensitivity(sensitivity: MotionSensitivity): void {
    this.motionSensitivity = sensitivity;
    this.applyMotionSensitivity();
    this.applyQualityTier();
  }

  isActive(): boolean {
    return this.active;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  getFlashMesh(): THREE.Mesh {
    return this.flashMesh;
  }

  getRaySystem(): THREE.LineSegments {
    return this.raySystem;
  }

  getParticleSystem(): THREE.Points {
    return this.particleSystem;
  }

  getConfiguredParticleCount(): number {
    return this.configuredParticleCount;
  }

  getConfiguredRayCount(): number {
    return this.configuredRayCount;
  }

  private rebuildStates(): void {
    this.tunnelParticles.length = 0;
    this.tunnelRays.length = 0;
    for (let index = 0; index < this.configuredParticleCount; index += 1) {
      this.tunnelParticles.push({
        angle: (index / Math.max(1, this.configuredParticleCount)) * Math.PI * 2,
        radius: 0.45 + (index % 7) * 0.2,
        depthOffset: (index / Math.max(1, this.configuredParticleCount)) * WormholeTunnelEffect.TUNNEL_DEPTH,
        speed: 6 + (index % 5) * 0.7,
        phase: index * 0.37,
      });
    }
    for (let index = 0; index < this.configuredRayCount; index += 1) {
      this.tunnelRays.push({
        angle: (index / Math.max(1, this.configuredRayCount)) * Math.PI * 2,
        length: 4 + (index % 4) * 1.2,
        depthOffset: (index % 6) * 0.8,
        speed: 1.8 + (index % 3) * 0.25,
      });
    }
  }

  private applyQualityTier(): void {
    const qualityScale = WormholeTunnelEffect.QUALITY_SCALES[this.qualityTier];
    const motionProfile = getMotionSensitivityProfile(this.motionSensitivity);
    const activeParticles = Math.max(
      0,
      Math.min(
        this.configuredParticleCount,
        Math.round(this.configuredParticleCount * qualityScale * motionProfile.particleDensityScale),
      ),
    );
    const activeRays = Math.max(
      0,
      Math.min(
        this.configuredRayCount,
        Math.round(this.configuredRayCount * qualityScale * motionProfile.particleDensityScale),
      ),
    );
    this.particleGeometry.setDrawRange(0, activeParticles);
    this.rayGeometry.setDrawRange(0, activeRays * 2);
  }

  private applyMotionSensitivity(): void {
    const motionProfile = getMotionSensitivityProfile(this.motionSensitivity);
    this.particleMaterial.size = 0.26 * motionProfile.effectSizeScale;
    this.particleMaterial.opacity = 0.75 * (0.6 + motionProfile.effectSizeScale * 0.4);
    this.rayMaterial.opacity = 0.72 * (0.7 + motionProfile.effectSizeScale * 0.3);
  }

  private syncAnchor(camera: THREE.PerspectiveCamera): void {
    camera.getWorldDirection(this.tempDirection);
    this.anchor.position.copy(camera.position).addScaledVector(
      this.tempDirection,
      WormholeTunnelEffect.ANCHOR_DISTANCE,
    );
    this.anchor.quaternion.copy(camera.quaternion);
  }

  private syncFlash(camera: THREE.PerspectiveCamera, progress: number): void {
    const distance = WormholeTunnelEffect.ANCHOR_DISTANCE;
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const height = 2 * Math.tan(halfFov) * distance;
    const width = height * camera.aspect;
    const reveal = THREE.MathUtils.smoothstep(progress, 0.1, 0.95);
    this.mixedColor.copy(this.startColor).lerp(this.targetColor, Math.min(1, progress * 1.15));
    this.flashMaterial.color.copy(this.mixedColor);
    this.flashMaterial.opacity = 0.12 + reveal * 0.82;
    this.flashMesh.scale.set(width, height, 1);
    this.flashMesh.position.set(0, 0, 0);
  }

  private syncRays(progress: number): void {
    const activeRayCount = this.rayGeometry.drawRange.count / 2;
    const positions = this.rayGeometry.getAttribute('position') as THREE.BufferAttribute;
    for (let index = 0; index < activeRayCount; index += 1) {
      const state = this.tunnelRays[index];
      const base = index * 6;
      const angle = state.angle + this.elapsed * state.speed;
      const innerRadius = 0.1 + progress * 0.5;
      const outerRadius = innerRadius + state.length * (0.35 + progress * 0.8);
      const zNear = -1.4 - state.depthOffset;
      const zFar = zNear - 8 - progress * 10;
      this.rayPositions[base] = Math.cos(angle) * innerRadius;
      this.rayPositions[base + 1] = Math.sin(angle) * innerRadius;
      this.rayPositions[base + 2] = zNear;
      this.rayPositions[base + 3] = Math.cos(angle) * outerRadius;
      this.rayPositions[base + 4] = Math.sin(angle) * outerRadius;
      this.rayPositions[base + 5] = zFar;
    }
    this.rayMaterial.color.copy(this.mixedColor);
    positions.needsUpdate = true;
  }

  private syncParticles(progress: number): void {
    const activeParticleCount = this.particleGeometry.drawRange.count;
    const positions = this.particleGeometry.getAttribute('position') as THREE.BufferAttribute;
    for (let index = 0; index < activeParticleCount; index += 1) {
      const state = this.tunnelParticles[index];
      const base = index * 3;
      const depthTravel =
        (state.depthOffset + this.elapsed * state.speed * 4) % WormholeTunnelEffect.TUNNEL_DEPTH;
      const spiralAngle = state.angle + this.elapsed * 5 + state.phase + depthTravel * 0.08;
      const radius = (0.5 + state.radius) * (0.5 + progress * 1.4);
      this.particlePositions[base] = Math.cos(spiralAngle) * radius;
      this.particlePositions[base + 1] = Math.sin(spiralAngle) * radius * 0.6;
      this.particlePositions[base + 2] = -depthTravel - 1.5;
    }
    this.particleMaterial.color.copy(this.mixedColor);
    positions.needsUpdate = true;
  }
}
