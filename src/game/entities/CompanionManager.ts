import * as THREE from 'three';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import type { PlanetEncyclopediaEntry } from '../../types';

interface CompanionData {
  mesh: THREE.Group;
  angleOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: number;
  entranceTimer: number;
}

export class CompanionManager {
  private companions: CompanionData[] = [];
  private group = new THREE.Group();
  private elapsedTime = 0;

  constructor(unlockedPlanets: number[]) {
    const count = unlockedPlanets.length;
    const baseRadius = count <= 3 ? 2.0 : count <= 7 ? 2.5 : 3.0;

    for (let i = 0; i < count; i++) {
      const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === unlockedPlanets[i]);
      if (!entry) continue;

      const mesh = CompanionManager.createCompanionMesh(entry);
      const angleOffset = i * ((2 * Math.PI) / count);
      const orbitRadius = baseRadius + (i % 3) * 0.15;
      const orbitSpeed = 1.0 + i * 0.05;
      const orbitTilt = (i - count / 2) * 0.15;

      this.companions.push({ mesh, angleOffset, orbitRadius, orbitSpeed, orbitTilt, entranceTimer: 0 });
      this.group.add(mesh);
    }
  }

  addCompanion(stageNumber: number): boolean {
    const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === stageNumber);
    if (!entry) return false;

    const mesh = CompanionManager.createCompanionMesh(entry);
    const count = this.companions.length;
    const newCount = count + 1;
    const baseRadius = newCount <= 3 ? 2.0 : newCount <= 7 ? 2.5 : 3.0;
    const angleOffset = count * ((2 * Math.PI) / newCount);
    const orbitRadius = baseRadius + (count % 3) * 0.15;
    const orbitSpeed = 1.0 + count * 0.05;
    const orbitTilt = (count - newCount / 2) * 0.15;

    mesh.scale.set(0, 0, 0);
    this.companions.push({ mesh, angleOffset, orbitRadius, orbitSpeed, orbitTilt, entranceTimer: 1.0 });
    this.group.add(mesh);
    return true;
  }

  update(deltaTime: number, shipX: number, shipY: number, shipZ: number): void {
    this.elapsedTime += deltaTime;

    for (const c of this.companions) {
      const angle = c.angleOffset + this.elapsedTime * c.orbitSpeed;
      const x = shipX + c.orbitRadius * Math.cos(angle);
      const y = shipY + c.orbitRadius * Math.sin(angle) * Math.cos(c.orbitTilt);
      const z = shipZ + c.orbitRadius * Math.sin(angle) * Math.sin(c.orbitTilt);
      c.mesh.position.set(x, y, z);

      if (c.entranceTimer > 0) {
        c.entranceTimer -= deltaTime;
        const progress = Math.max(0, Math.min(1, 1 - c.entranceTimer));
        c.mesh.scale.setScalar(progress);
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
    for (const c of this.companions) {
      c.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }
    this.companions = [];
    this.group.clear();
  }

  static createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {
    switch (entry.companionShape) {
      case 'ringed':
        return CompanionManager.createRinged(entry.planetColor);
      case 'radiant':
        return CompanionManager.createRadiant(entry.planetColor);
      case 'horned':
        return CompanionManager.createHorned(entry.planetColor);
      case 'icy':
        return CompanionManager.createIcy(entry.planetColor);
      case 'bubble':
        return CompanionManager.createBubble(entry.planetColor);
      default:
        return CompanionManager.createBasic(entry.planetColor);
    }
  }

  private static createBasic(color: number): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x111111 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), mat);
    group.add(body);

    const ear1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 6), mat);
    ear1.position.set(0.2, 0.35, 0);
    ear1.rotation.z = -0.3;
    group.add(ear1);

    const ear2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 6), mat);
    ear2.position.set(-0.2, 0.35, 0);
    ear2.rotation.z = 0.3;
    group.add(ear2);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye1.position.set(0.1, 0.1, 0.25);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye2.position.set(-0.1, 0.1, 0.25);
    group.add(eye2);

    return group;
  }

  private static createRinged(color: number): THREE.Group {
    const group = CompanionManager.createBasic(color);
    const mat = new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.55, 12), mat);
    ring.rotation.x = (Math.PI / 2) * 0.8;
    group.add(ring);
    return group;
  }

  private static createRadiant(color: number): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x111111 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), mat);
    group.add(body);

    const ray1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), mat);
    ray1.position.set(0, 0.5, 0);
    group.add(ray1);

    const ray2 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), mat);
    ray2.position.set(0.4, 0.15, 0);
    ray2.rotation.z = -Math.PI / 3;
    group.add(ray2);

    const ray3 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), mat);
    ray3.position.set(-0.4, 0.15, 0);
    ray3.rotation.z = Math.PI / 3;
    group.add(ray3);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye1.position.set(0.1, 0.1, 0.25);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye2.position.set(-0.1, 0.1, 0.25);
    group.add(eye2);

    return group;
  }

  private static createHorned(color: number): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x111111 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 6, 6), mat);
    group.add(body);

    const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 4), mat);
    horn1.position.set(0.15, 0.45, 0);
    horn1.rotation.z = -0.2;
    group.add(horn1);

    const horn2 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 4), mat);
    horn2.position.set(-0.15, 0.45, 0);
    horn2.rotation.z = 0.2;
    group.add(horn2);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye1.position.set(0.1, 0.1, 0.25);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye2.position.set(-0.1, 0.1, 0.25);
    group.add(eye2);

    return group;
  }

  private static createIcy(color: number): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x111111 });

    const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), mat);
    group.add(body);

    const ear1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 6), mat);
    ear1.position.set(0.2, 0.35, 0);
    ear1.rotation.z = -0.3;
    group.add(ear1);

    const ear2 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 6), mat);
    ear2.position.set(-0.2, 0.35, 0);
    ear2.rotation.z = 0.3;
    group.add(ear2);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye1.position.set(0.1, 0.1, 0.25);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye2.position.set(-0.1, 0.1, 0.25);
    group.add(eye2);

    return group;
  }

  private static createBubble(color: number): THREE.Group {
    const group = new THREE.Group();
    const mat = new THREE.MeshToonMaterial({ color, transparent: true, opacity: 0.7 });
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x111111 });

    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), mat);
    group.add(body);

    const bubble1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 4), mat);
    bubble1.position.set(0.3, 0.2, 0);
    group.add(bubble1);

    const bubble2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 4, 4), mat);
    bubble2.position.set(-0.25, 0.3, 0);
    group.add(bubble2);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye1.position.set(0.1, 0.1, 0.25);
    group.add(eye1);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 4, 4), eyeMat);
    eye2.position.set(-0.1, 0.1, 0.25);
    group.add(eye2);

    return group;
  }
}
