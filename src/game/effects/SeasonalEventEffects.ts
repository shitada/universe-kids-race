import * as THREE from 'three';
import type { SeasonalEventConfig } from '../../types';

interface SeasonalOrbState {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  phase: number;
}

export class SeasonalEventEffects {
  private static readonly ORB_COUNT = 8;
  private static readonly sharedOrbGeometry = new THREE.SphereGeometry(0.22, 10, 10);
  private static readonly sharedBoxGeometry = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  private static readonly sharedStarGeometry = new THREE.OctahedronGeometry(0.26, 0);
  private static readonly sharedPetalGeometry = new THREE.PlaneGeometry(0.34, 0.26);

  private readonly group = new THREE.Group();
  private readonly orbStates: SeasonalOrbState[] = [];
  private readonly haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
  });
  private readonly haloMesh = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.08, 10, 36),
    this.haloMaterial,
  );
  private scene: THREE.Scene | null = null;
  private activeEvent: SeasonalEventConfig | null = null;
  private elapsed = 0;

  constructor() {
    this.group.visible = false;
    this.haloMesh.rotation.x = Math.PI / 2.5;
    this.haloMesh.visible = false;
    this.haloMesh.userData.seasonalEventHalo = true;
    this.group.add(this.haloMesh);

    for (let index = 0; index < SeasonalEventEffects.ORB_COUNT; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.78,
      });
      const mesh = new THREE.Mesh(SeasonalEventEffects.sharedOrbGeometry, material);
      mesh.visible = false;
      this.group.add(mesh);
      this.orbStates.push({
        mesh,
        material,
        phase: (index / SeasonalEventEffects.ORB_COUNT) * Math.PI * 2,
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

  start(event: SeasonalEventConfig): void {
    this.activeEvent = event;
    this.elapsed = 0;
    this.group.visible = true;
    this.haloMaterial.color.setHex(event.accentColor);
    this.haloMesh.visible = event.id !== 'tanabata';
    for (const state of this.orbStates) {
      state.material.color.setHex(event.accentColor);
      state.material.opacity = event.id === 'sakura' ? 0.88 : 0.78;
      state.material.side = event.id === 'sakura' ? THREE.DoubleSide : THREE.FrontSide;
      state.mesh.visible = true;
      state.mesh.geometry = this.getGeometry(event.id);
      state.mesh.rotation.set(0, 0, 0);
      state.mesh.scale.setScalar(1);
    }
  }

  update(deltaTime: number, shipX: number, shipZ: number): void {
    if (!this.activeEvent) {
      this.group.visible = false;
      this.haloMesh.visible = false;
      return;
    }

    this.elapsed += Math.max(0, deltaTime);
    this.group.visible = true;
    this.group.position.set(shipX, 2.5, shipZ - 18);

    if (this.haloMesh.visible) {
      const haloScale = 1 + Math.sin(this.elapsed * 2.2) * 0.06;
      this.haloMesh.scale.setScalar(haloScale);
      this.haloMesh.rotation.z = this.elapsed * 0.45;
    }

    for (let index = 0; index < this.orbStates.length; index += 1) {
      const state = this.orbStates[index];
      this.updateOrb(state, index, this.activeEvent.id);
    }
  }

  clear(): void {
    this.activeEvent = null;
    this.elapsed = 0;
    this.group.visible = false;
    this.haloMesh.visible = false;
    for (const state of this.orbStates) {
      state.mesh.visible = false;
      state.mesh.position.set(0, 0, 0);
      state.mesh.scale.setScalar(1);
      state.mesh.rotation.set(0, 0, 0);
    }
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  isActive(): boolean {
    return this.activeEvent !== null;
  }

  private updateOrb(
    state: SeasonalOrbState,
    index: number,
    eventId: SeasonalEventConfig['id'],
  ): void {
    const angle = this.elapsed * (0.8 + index * 0.03) + state.phase;
    switch (eventId) {
      case 'sakura': {
        const fallCycle = (this.elapsed * 0.48 + index * 0.19) % 1.8;
        state.mesh.position.set(
          Math.sin(angle) * 2.15 + Math.cos(this.elapsed * 0.7 + index) * 0.42,
          1.1 - fallCycle * 1.5,
          Math.cos(angle * 0.72) * 1.25 + Math.sin(this.elapsed * 0.5 + index * 0.35) * 0.32,
        );
        state.mesh.rotation.x = Math.PI / 3;
        state.mesh.rotation.y = Math.sin(this.elapsed * 1.4 + index) * 0.45;
        state.mesh.rotation.z += 0.028;
        state.mesh.scale.setScalar(0.9 + Math.sin(this.elapsed * 2.2 + index * 0.7) * 0.08);
        break;
      }
      case 'tanabata':
        state.mesh.position.set(
          -3 + index * 0.85,
          Math.sin(this.elapsed * 1.8 + index * 0.4) * 0.9,
          Math.cos(angle) * 0.9,
        );
        state.mesh.scale.setScalar(0.82 + Math.sin(this.elapsed * 2.4 + index) * 0.12);
        break;
      case 'christmas':
        state.mesh.position.set(
          Math.cos(angle) * (1.8 + (index % 2) * 0.35),
          Math.sin(angle * 1.4) * 0.8,
          Math.sin(angle) * 1.1,
        );
        state.mesh.rotation.x += 0.02;
        state.mesh.rotation.y += 0.03;
        state.mesh.scale.setScalar(0.8 + (index % 3) * 0.12);
        break;
      case 'new-year':
        state.mesh.position.set(
          Math.sin(angle) * 1.6,
          -0.9 + ((this.elapsed * 0.8 + index * 0.18) % 2.4),
          Math.cos(angle) * 0.7,
        );
        state.mesh.scale.setScalar(0.78 + Math.sin(this.elapsed * 3 + index) * 0.1);
        break;
    }
  }

  private getGeometry(eventId: SeasonalEventConfig['id']): THREE.BufferGeometry {
    if (eventId === 'sakura') {
      return SeasonalEventEffects.sharedPetalGeometry;
    }
    if (eventId === 'tanabata') {
      return SeasonalEventEffects.sharedStarGeometry;
    }
    if (eventId === 'christmas') {
      return SeasonalEventEffects.sharedBoxGeometry;
    }
    return SeasonalEventEffects.sharedOrbGeometry;
  }
}
