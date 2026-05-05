import * as THREE from 'three';
import type { SpaceWeatherEventConfig, SpaceWeatherEventId } from '../../types';

interface CometVisualState {
  group: THREE.Group;
  core: THREE.Mesh;
  trail: THREE.Mesh;
  phase: number;
}

export class SpaceWeatherEffect {
  private static readonly METEOR_STREAK_COUNT = 8;
  private static readonly AURORA_BAND_COUNT = 3;
  private static readonly COMET_COUNT = 3;

  private readonly group = new THREE.Group();
  private readonly meteorLines: THREE.Line[] = [];
  private readonly auroraBands: THREE.Mesh[] = [];
  private readonly cometStates: CometVisualState[] = [];
  private scene: THREE.Scene | null = null;
  private activeEvent: SpaceWeatherEventConfig | null = null;
  private elapsed = 0;

  constructor() {
    this.group.visible = false;

    for (let index = 0; index < SpaceWeatherEffect.METEOR_STREAK_COUNT; index += 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1.8, -0.7, 4.5),
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0xaee8ff,
        transparent: true,
        opacity: 0.85,
      });
      const line = new THREE.Line(geometry, material);
      line.visible = false;
      this.group.add(line);
      this.meteorLines.push(line);
    }

    for (let index = 0; index < SpaceWeatherEffect.AURORA_BAND_COUNT; index += 1) {
      const material = new THREE.MeshBasicMaterial({
        color: 0x7fffd4,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      });
      const band = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 1.2), material);
      band.visible = false;
      this.group.add(band);
      this.auroraBands.push(band);
    }

    for (let index = 0; index < SpaceWeatherEffect.COMET_COUNT; index += 1) {
      const cometGroup = new THREE.Group();
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
      );
      const trail = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 0.9, 8),
        new THREE.MeshBasicMaterial({
          color: 0xbdefff,
          transparent: true,
          opacity: 0.6,
        }),
      );
      trail.rotation.z = Math.PI / 2;
      trail.position.x = -0.45;
      cometGroup.add(core);
      cometGroup.add(trail);
      cometGroup.visible = false;
      this.group.add(cometGroup);
      this.cometStates.push({
        group: cometGroup,
        core,
        trail,
        phase: (index / SpaceWeatherEffect.COMET_COUNT) * Math.PI * 2,
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

  start(event: SpaceWeatherEventConfig): void {
    this.activeEvent = event;
    this.elapsed = 0;
    this.group.visible = true;
    this.applyAccentColor(event.accentColor);
    this.updateVisibility(event.id);
  }

  update(active: boolean, deltaTime: number, shipX: number, shipZ: number): void {
    if (!active || !this.activeEvent) {
      this.group.visible = false;
      this.updateVisibility(null);
      if (!active) {
        this.activeEvent = null;
      }
      return;
    }

    this.elapsed += Math.max(0, deltaTime);
    this.group.visible = true;
    this.group.position.set(shipX, 1.6, shipZ - 16);

    switch (this.activeEvent.id) {
      case 'meteor-shower':
        this.updateMeteorStreaks();
        break;
      case 'aurora-storm':
        this.updateAuroraBands();
        break;
      case 'comet-approach':
        this.updateCometSwarm();
        break;
    }
  }

  clear(): void {
    this.activeEvent = null;
    this.elapsed = 0;
    this.group.visible = false;
    this.updateVisibility(null);
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  isActive(): boolean {
    return this.activeEvent !== null;
  }

  private updateMeteorStreaks(): void {
    for (let index = 0; index < this.meteorLines.length; index += 1) {
      const line = this.meteorLines[index];
      line.position.set(
        -4 + (index % 4) * 2.4 + Math.sin(this.elapsed * 1.6 + index) * 0.35,
        1.8 - (index % 3) * 0.55 + Math.cos(this.elapsed * 1.8 + index) * 0.18,
        -((this.elapsed * 12 + index * 4) % 18),
      );
    }
  }

  private updateAuroraBands(): void {
    for (let index = 0; index < this.auroraBands.length; index += 1) {
      const band = this.auroraBands[index];
      band.position.set(
        0,
        0.6 + index * 0.9 + Math.sin(this.elapsed * 2 + index * 0.8) * 0.18,
        -2 - index * 0.8,
      );
      band.rotation.z = Math.sin(this.elapsed * 0.8 + index * 0.4) * 0.12;
      band.scale.x = 1 + Math.sin(this.elapsed * 1.7 + index) * 0.08;
    }
  }

  private updateCometSwarm(): void {
    for (let index = 0; index < this.cometStates.length; index += 1) {
      const state = this.cometStates[index];
      const angle = this.elapsed * (1.1 + index * 0.2) + state.phase;
      state.group.position.set(
        Math.cos(angle) * (2.2 + index * 0.35),
        0.9 + Math.sin(angle * 1.4) * 0.55,
        Math.sin(angle) * 1.4,
      );
      state.group.rotation.z = angle * 0.6;
      state.core.scale.setScalar(0.9 + Math.sin(this.elapsed * 5 + index) * 0.08);
      state.trail.scale.set(1 + Math.sin(this.elapsed * 4 + index) * 0.12, 1, 1);
    }
  }

  private updateVisibility(eventId: SpaceWeatherEventId | null): void {
    for (const line of this.meteorLines) {
      line.visible = eventId === 'meteor-shower';
    }
    for (const band of this.auroraBands) {
      band.visible = eventId === 'aurora-storm';
    }
    for (const state of this.cometStates) {
      state.group.visible = eventId === 'comet-approach';
    }
  }

  private applyAccentColor(accentColor: number): void {
    for (const line of this.meteorLines) {
      (line.material as THREE.LineBasicMaterial).color.setHex(accentColor);
    }
    for (const band of this.auroraBands) {
      (band.material as THREE.MeshBasicMaterial).color.setHex(accentColor);
    }
    for (const state of this.cometStates) {
      (state.core.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
      (state.trail.material as THREE.MeshBasicMaterial).color.setHex(accentColor);
    }
  }
}
