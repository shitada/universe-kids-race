import * as THREE from 'three';
import type { StageSpecialEffectStyle, StageSpecialEventConfig } from '../../types';

interface OrbState {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  phase: number;
}

export class StageSpecialEffects {
  private static readonly ORB_COUNT = 10;
  private static readonly sharedOrbGeometry = new THREE.SphereGeometry(0.2, 12, 12);
  private static readonly sharedCrystalGeometry = new THREE.OctahedronGeometry(0.24, 0);
  private static readonly sharedRingGeometry = new THREE.TorusGeometry(2.2, 0.09, 12, 42);

  private readonly group = new THREE.Group();
  private readonly orbStates: OrbState[] = [];
  private readonly ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.82,
  });
  private readonly ringMesh = new THREE.Mesh(StageSpecialEffects.sharedRingGeometry, this.ringMaterial);
  private scene: THREE.Scene | null = null;
  private activeConfig: StageSpecialEventConfig | null = null;
  private elapsed = 0;
  private active = false;

  constructor() {
    this.ringMesh.visible = false;
    this.ringMesh.rotation.x = Math.PI / 2.8;
    this.ringMesh.userData.stageSpecialRing = true;
    this.group.visible = false;
    this.group.add(this.ringMesh);

    for (let index = 0; index < StageSpecialEffects.ORB_COUNT; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const mesh = new THREE.Mesh(StageSpecialEffects.sharedOrbGeometry, material);
      mesh.visible = false;
      this.group.add(mesh);
      this.orbStates.push({
        mesh,
        material,
        phase: (index / StageSpecialEffects.ORB_COUNT) * Math.PI * 2,
      });
    }
  }

  init(scene: THREE.Scene): void {
    if (this.scene) {
      return;
    }
    this.scene = scene;
    scene.add(this.group);
  }

  start(config: StageSpecialEventConfig): void {
    this.activeConfig = config;
    this.elapsed = 0;
    this.active = true;
    this.group.visible = true;
    this.ringMaterial.color.setHex(config.accentColor);
    for (let index = 0; index < this.orbStates.length; index += 1) {
      const state = this.orbStates[index];
      state.material.color.setHex(config.accentColor);
      state.material.opacity = config.style === 'bubble' ? 0.45 : 0.85;
      state.mesh.geometry = this.usesCrystalGeometry(config.style)
        ? StageSpecialEffects.sharedCrystalGeometry
        : StageSpecialEffects.sharedOrbGeometry;
      state.mesh.visible = true;
      state.mesh.scale.setScalar(0.8);
    }
    this.ringMesh.visible = config.style === 'ring' || config.style === 'halo' || config.style === 'homecoming';
  }

  update(active: boolean, deltaTime: number, shipX: number, shipZ: number): void {
    if (!this.scene) {
      return;
    }
    if (!active || !this.active || !this.activeConfig) {
      if (!active) {
        this.active = false;
      }
      this.group.visible = false;
      this.ringMesh.visible = false;
      return;
    }

    this.elapsed += Math.max(0, deltaTime);
    this.group.visible = true;
    this.group.position.set(shipX, 1.2, shipZ - 14);
    this.updateRing(this.activeConfig.style);

    for (let index = 0; index < this.orbStates.length; index += 1) {
      this.updateOrb(this.orbStates[index], index, this.activeConfig.style);
    }
  }

  clear(): void {
    this.activeConfig = null;
    this.elapsed = 0;
    this.active = false;
    this.group.visible = false;
    this.ringMesh.visible = false;
    for (const state of this.orbStates) {
      state.mesh.visible = false;
      state.mesh.position.set(0, 0, 0);
      state.mesh.scale.setScalar(1);
    }
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  isActive(): boolean {
    return this.active;
  }

  private updateRing(style: StageSpecialEffectStyle): void {
    if (!this.ringMesh.visible) {
      return;
    }
    const pulse = 1 + Math.sin(this.elapsed * 4) * 0.08;
    this.ringMesh.scale.setScalar(pulse);
    this.ringMesh.rotation.z = this.elapsed * (style === 'ring' ? 1.8 : 0.9);
  }

  private updateOrb(state: OrbState, index: number, style: StageSpecialEffectStyle): void {
    const angle = this.elapsed * (0.8 + index * 0.03) + state.phase;
    const orbitRadius = 1.6 + (index % 3) * 0.45;
    const wave = Math.sin(angle * 1.4) * 0.5;
    const rise = ((this.elapsed * 0.7 + index * 0.13) % 2.4) - 1.2;
    const scalePulse = 0.78 + Math.sin(this.elapsed * 3 + index) * 0.14;

    switch (style) {
      case 'rabbit':
        state.mesh.position.set(
          (index % 2 === 0 ? -0.9 : 0.9) * (index < 4 ? 0.55 : 0.18) + Math.sin(angle) * 0.18,
          index < 2 ? 1.35 + wave * 0.2 : (index < 4 ? 0.55 + wave * 0.25 : Math.sin(angle) * 0.42),
          Math.cos(angle) * 0.35,
        );
        break;
      case 'twinkle':
      case 'flare':
        state.mesh.position.set(
          Math.cos(angle) * orbitRadius,
          Math.sin(angle * 1.2) * 0.8,
          Math.sin(angle) * orbitRadius * 0.6,
        );
        break;
      case 'veil':
      case 'aurora':
        state.mesh.position.set(
          -3 + index * 0.65,
          Math.sin(this.elapsed * 2.2 + index * 0.5) * 0.8,
          Math.cos(angle) * 0.9,
        );
        break;
      case 'dust':
        state.mesh.position.set(
          Math.sin(angle * 1.8) * (1.2 + (index % 4) * 0.35),
          wave * 0.3,
          Math.cos(angle * 1.1) * 1.8,
        );
        break;
      case 'halo':
      case 'ring':
      case 'homecoming':
        state.mesh.position.set(
          Math.cos(angle) * (2.1 + (index % 2) * 0.18),
          Math.sin(angle * 2) * 0.4,
          Math.sin(angle) * (1.1 + (index % 3) * 0.12),
        );
        break;
      case 'bubble':
        state.mesh.position.set(
          Math.sin(angle) * 1.8,
          rise + (index % 3) * 0.45,
          Math.cos(angle) * 0.7,
        );
        break;
      case 'crystal':
        state.mesh.position.set(
          Math.cos(angle) * orbitRadius,
          Math.sin(angle * 1.5) * 0.75,
          Math.sin(angle) * orbitRadius,
        );
        state.mesh.rotation.x += 0.04;
        state.mesh.rotation.z += 0.05;
        break;
    }

    state.mesh.scale.setScalar(style === 'bubble' ? 0.72 + (index % 3) * 0.14 : scalePulse);
  }

  private usesCrystalGeometry(style: StageSpecialEffectStyle): boolean {
    return style === 'crystal';
  }
}
