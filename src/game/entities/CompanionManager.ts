import * as THREE from 'three';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import type { PlanetEncyclopediaEntry } from '../../types';
import { createCompanionMesh } from './CompanionMeshFactory';

interface CompanionData {
  stageNumber: number;
  mesh: THREE.Group;
  angleOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: number;
  cosTilt: number;
  sinTilt: number;
  entranceTimer: number;
}

export class CompanionManager {
  private companions: CompanionData[] = [];
  private group = new THREE.Group();
  private elapsedTime = 0;

  constructor(unlockedPlanets: number[]) {
    this.resetUnlockedPlanets(unlockedPlanets);
  }

  addCompanion(stageNumber: number): boolean {
    const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === stageNumber);
    if (!entry) return false;

    const mesh = createCompanionMesh(entry);
    mesh.scale.set(0, 0, 0);
    this.companions.push({
      stageNumber,
      mesh,
      angleOffset: 0,
      orbitRadius: 0,
      orbitSpeed: 0,
      orbitTilt: 0,
      cosTilt: 1,
      sinTilt: 0,
      entranceTimer: 1.0,
    });
    this.group.add(mesh);
    this.redistributeOrbitParams();
    return true;
  }

  resetUnlockedPlanets(unlockedPlanets: number[]): void {
    this.elapsedTime = 0;
    this.companions.length = 0;
    this.group.clear();

    for (const stageNumber of unlockedPlanets) {
      const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === stageNumber);
      if (!entry) continue;

      const mesh = createCompanionMesh(entry);
      this.companions.push({
        stageNumber,
        mesh,
        angleOffset: 0,
        orbitRadius: 0,
        orbitSpeed: 0,
        orbitTilt: 0,
        cosTilt: 1,
        sinTilt: 0,
        entranceTimer: 0,
      });
      this.group.add(mesh);
    }
    this.redistributeOrbitParams();
  }

  // Recomputes orbit parameters (angleOffset / orbitRadius / orbitSpeed /
  // orbitTilt and its cached cos/sin) for ALL companions using the current
  // total count. This must be called whenever the companion count changes so
  // that the orbit stays evenly spaced and uses the correct baseRadius —
  // otherwise companions added incrementally end up at uneven angles and
  // mismatched radii (see CompanionManager bugfix). entranceTimer is
  // intentionally NOT touched so any in-progress entrance animation continues.
  private redistributeOrbitParams(): void {
    const count = this.companions.length;
    if (count === 0) return;
    const baseRadius = count <= 3 ? 2.0 : count <= 7 ? 2.5 : 3.0;

    for (let i = 0; i < count; i++) {
      const c = this.companions[i];
      const orbitTilt = (i - count / 2) * 0.15;
      c.angleOffset = i * ((2 * Math.PI) / count);
      c.orbitRadius = baseRadius + (i % 3) * 0.15;
      c.orbitSpeed = 1.0 + i * 0.05;
      c.orbitTilt = orbitTilt;
      c.cosTilt = Math.cos(orbitTilt);
      c.sinTilt = Math.sin(orbitTilt);
    }
  }

  // Rest-skip: when no companions are present, completely no-op (no elapsedTime
  // advance, no iteration). Same pattern as ParticleBurstManager.update and
  // AirShield.update — keeps the StageScene update hot-path free of empty
  // iteration on iPad Safari (Constitution IV: 60fps). Also keeps the orbit
  // phase deterministic: the first acquired companion always starts at angle=0
  // because elapsedTime stays 0 until at least one companion exists.
  update(deltaTime: number, shipX: number, shipY: number, shipZ: number): void {
    if (this.companions.length === 0) return;
    this.elapsedTime += deltaTime;

    for (const c of this.companions) {
      const angle = c.angleOffset + this.elapsedTime * c.orbitSpeed;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const x = shipX + c.orbitRadius * cosA;
      const y = shipY + c.orbitRadius * sinA * c.cosTilt;
      const z = shipZ + c.orbitRadius * sinA * c.sinTilt;
      c.mesh.position.set(x, y, z);

      if (c.entranceTimer > 0) {
        c.entranceTimer -= deltaTime;
        if (c.entranceTimer <= 0) {
          c.entranceTimer = 0;
          c.mesh.scale.setScalar(1);
        } else {
          const progress = Math.max(0, Math.min(1, 1 - c.entranceTimer));
          c.mesh.scale.setScalar(progress);
        }
        c.mesh.rotation.y += deltaTime * 8;
      } else {
        c.mesh.rotation.y += deltaTime * 2;
      }
    }
  }

  getCount(): number {
    return this.companions.length;
  }

  getStarAttractionBonus(): number {
    return this.companions.length * 0.2;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  dispose(): void {
    // Shared geometries/materials are cached at module scope and reused across
    // CompanionManager instances (same policy as Star/Meteorite). Per-instance
    // dispose only detaches meshes from the scene graph; it must NOT dispose
    // the shared resources or subsequent companions would render incorrectly.
    this.companions.length = 0;
    this.elapsedTime = 0;
    this.group.clear();
  }

  static createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {
    return createCompanionMesh(entry);
  }
}
