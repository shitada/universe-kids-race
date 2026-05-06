import * as THREE from 'three';
import type { SpaceGemType } from '../../types';
import { SPACE_GEM_CONFIG } from '../config/SpaceGemConfig';

const CORE_GEOMETRY = new THREE.OctahedronGeometry(0.6, 0);
const GLOW_GEOMETRY = new THREE.SphereGeometry(0.92, 16, 16);
const RING_GEOMETRY = new THREE.TorusGeometry(0.86, 0.06, 8, 28);
const SPACE_GEM_ANIMATION_AHEAD = 80;
const SPACE_GEM_ANIMATION_BEHIND = 12;

export class SpaceGem {
  position: { x: number; y: number; z: number };
  readonly radius = 0.82;
  readonly mesh: THREE.Group;
  scoreBonus: number;
  isCollected = false;
  gemType: SpaceGemType;

  private readonly core: THREE.Mesh;
  private readonly glow: THREE.Mesh;
  private readonly ring: THREE.Mesh;
  private readonly coreMaterial: THREE.MeshToonMaterial;
  private readonly glowMaterial: THREE.MeshBasicMaterial;
  private readonly ringMaterial: THREE.MeshBasicMaterial;
  private readonly basePosition: { x: number; y: number; z: number };
  private elapsed = 0;

  constructor(x: number, y: number, z: number, gemType: SpaceGemType = 'diamond-nebula') {
    this.position = { x, y, z };
    this.basePosition = { x, y, z };
    this.gemType = gemType;
    this.scoreBonus = SPACE_GEM_CONFIG[gemType].scoreBonus;
    const group = new THREE.Group();
    const coreMaterial = new THREE.MeshToonMaterial();
    const glowMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });
    const ringMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const core = new THREE.Mesh(CORE_GEOMETRY, coreMaterial);
    const glow = new THREE.Mesh(GLOW_GEOMETRY, glowMaterial);
    const ring = new THREE.Mesh(RING_GEOMETRY, ringMaterial);
    core.name = 'space-gem-core';
    glow.name = 'space-gem-glow';
    ring.name = 'space-gem-ring';
    ring.rotation.x = Math.PI / 2;
    group.add(glow, ring, core);
    this.mesh = group;
    this.core = core;
    this.glow = glow;
    this.ring = ring;
    this.coreMaterial = coreMaterial;
    this.glowMaterial = glowMaterial;
    this.ringMaterial = ringMaterial;
    this.applyAppearance();
    this.syncMesh();
  }

  private applyAppearance(): void {
    const config = SPACE_GEM_CONFIG[this.gemType];
    this.scoreBonus = config.scoreBonus;
    this.coreMaterial.color.setHex(config.visual.coreColor);
    this.coreMaterial.emissive.setHex(config.visual.emissiveColor);
    this.coreMaterial.emissiveIntensity = 0.9;
    this.glowMaterial.color.setHex(config.visual.glowColor);
    this.ringMaterial.color.setHex(config.visual.ringColor);
  }

  private syncMesh(): void {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - SPACE_GEM_ANIMATION_AHEAD || this.position.z > cameraZ + SPACE_GEM_ANIMATION_BEHIND)
    ) {
      return;
    }

    this.elapsed += deltaTime;
    const motion = SPACE_GEM_CONFIG[this.gemType].motion;
    this.position.x = this.basePosition.x + Math.sin(this.elapsed * motion.frequency) * motion.swayX;
    this.position.y = this.basePosition.y + Math.cos(this.elapsed * motion.frequency * 0.82) * motion.swayY;
    this.syncMesh();
    this.core.rotation.x += deltaTime * motion.spinSpeed;
    this.core.rotation.z += deltaTime * motion.spinSpeed * 1.24;
    this.ring.rotation.z += deltaTime * motion.spinSpeed * 0.8;
    const pulse = 1 + Math.sin(this.elapsed * motion.pulseSpeed) * 0.12;
    this.glow.scale.setScalar(pulse);
    this.mesh.scale.setScalar(1 + Math.sin(this.elapsed * motion.pulseSpeed * 0.72) * 0.05);
    this.glowMaterial.opacity = 0.2 + Math.sin(this.elapsed * motion.pulseSpeed) * 0.08;
    this.ringMaterial.opacity = 0.52 + Math.cos(this.elapsed * motion.pulseSpeed * 0.85) * 0.12;
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(x: number, y: number, z: number, gemType: SpaceGemType = this.gemType): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.basePosition.x = x;
    this.basePosition.y = y;
    this.basePosition.z = z;
    this.gemType = gemType;
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.mesh.scale.setScalar(1);
    this.core.rotation.set(0, 0, 0);
    this.ring.rotation.set(Math.PI / 2, 0, 0);
    this.glow.scale.setScalar(1);
    this.applyAppearance();
    this.syncMesh();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.reset(this.position.x, this.position.y, this.position.z, this.gemType);
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.coreMaterial.dispose();
    this.glowMaterial.dispose();
    this.ringMaterial.dispose();
  }
}
