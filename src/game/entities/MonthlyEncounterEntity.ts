import * as THREE from 'three';
import type { MonthlyEncounterId } from '../../types';
import { getMonthlyEncounterEntry } from '../config/MonthlyEncounterConfig';

const CORE_GEOMETRY = new THREE.IcosahedronGeometry(0.72, 0);
const AURA_GEOMETRY = new THREE.SphereGeometry(1.16, 14, 14);
const TRAIL_GEOMETRY = new THREE.CylinderGeometry(0.08, 0.24, 2.4, 10, 1, true);
const HALO_GEOMETRY = new THREE.TorusGeometry(0.92, 0.09, 8, 24);
const AHEAD_RANGE = 90;
const BEHIND_RANGE = 16;

export class MonthlyEncounterEntity {
  position: { x: number; y: number; z: number };
  readonly radius = 1;
  readonly mesh: THREE.Group;
  readonly scoreBonus: number;
  encounterId: MonthlyEncounterId;
  isCollected = false;

  private readonly core: THREE.Mesh;
  private readonly aura: THREE.Mesh;
  private readonly trail: THREE.Mesh;
  private readonly halo: THREE.Mesh;
  private readonly coreMaterial: THREE.MeshToonMaterial;
  private readonly auraMaterial: THREE.MeshToonMaterial;
  private readonly trailMaterial: THREE.MeshToonMaterial;
  private readonly haloMaterial: THREE.MeshToonMaterial;
  private direction: -1 | 1;
  private elapsed = 0;

  constructor(x: number, y: number, z: number, encounterId: MonthlyEncounterId, direction: -1 | 1 = 1) {
    this.position = { x, y, z };
    this.encounterId = encounterId;
    this.direction = direction;
    const group = new THREE.Group();
    this.coreMaterial = new THREE.MeshToonMaterial();
    this.auraMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.32 });
    this.trailMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.88 });
    this.haloMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.82 });
    this.core = new THREE.Mesh(CORE_GEOMETRY, this.coreMaterial);
    this.aura = new THREE.Mesh(AURA_GEOMETRY, this.auraMaterial);
    this.trail = new THREE.Mesh(TRAIL_GEOMETRY, this.trailMaterial);
    this.halo = new THREE.Mesh(HALO_GEOMETRY, this.haloMaterial);
    this.trail.rotation.z = Math.PI / 2;
    group.add(this.aura, this.halo, this.core, this.trail);
    this.mesh = group;
    this.scoreBonus = getMonthlyEncounterEntry(encounterId)?.scoreBonus ?? 800;
    this.applyAppearance();
    this.syncMesh();
  }

  private applyAppearance(): void {
    const entry = getMonthlyEncounterEntry(this.encounterId);
    const color = entry?.accentColor ?? 0xffffff;
    this.coreMaterial.color.setHex(color);
    this.coreMaterial.emissive.setHex(color);
    this.coreMaterial.emissiveIntensity = 0.8;
    this.auraMaterial.color.setHex(color);
    this.trailMaterial.color.setHex(color);
    this.haloMaterial.color.setHex(color);
  }

  private syncMesh(): void {
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.z = Math.atan2(0.8, 5.6 * this.direction);
    this.trail.position.set(-this.direction * 1.1, 0, 0);
    this.trail.rotation.y = this.direction === 1 ? 0 : Math.PI;
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - AHEAD_RANGE || this.position.z > cameraZ + BEHIND_RANGE)
    ) {
      return;
    }

    this.elapsed += deltaTime;
    this.position.x += this.direction * 5.6 * deltaTime;
    this.position.y += Math.sin(this.elapsed * 3.4) * 0.35 * deltaTime;
    this.position.z += 16 * deltaTime;
    this.core.rotation.x += deltaTime * 3.8;
    this.core.rotation.y += deltaTime * 5.2;
    this.halo.rotation.x += deltaTime * 1.8;
    this.halo.rotation.y += deltaTime * 2.4;
    this.aura.scale.setScalar(1.04 + Math.sin(this.elapsed * 6) * 0.12);
    this.trail.scale.set(1.02 + Math.sin(this.elapsed * 8) * 0.14, 1, 1);
    this.syncMesh();
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(x: number, y: number, z: number, encounterId: MonthlyEncounterId = this.encounterId, direction: -1 | 1 = 1): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.encounterId = encounterId;
    this.direction = direction;
    this.elapsed = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.halo.rotation.set(0, 0, 0);
    this.aura.scale.setScalar(1);
    this.trail.scale.set(1, 1, 1);
    this.applyAppearance();
    this.syncMesh();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.reset(this.position.x, this.position.y, this.position.z, this.encounterId, this.direction);
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.coreMaterial.dispose();
    this.auraMaterial.dispose();
    this.trailMaterial.dispose();
    this.haloMaterial.dispose();
  }
}
