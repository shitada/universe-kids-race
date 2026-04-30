// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {} as InputSystem;
  const audioManager = {} as AudioManager;
  const saveManager = {} as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

interface InternalScene {
  damageTimer: number;
  spaceship: { mesh: THREE.Object3D };
  updateDamageEffect(dt: number): void;
}

describe('StageScene damage flash residual rotation reset', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('resets spaceship.mesh.rotation.z to 0 on the frame the damage timer ends', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;

    // Stub spaceship to a minimal mesh; emulate residual wobble from prior frame.
    const mesh = new THREE.Object3D();
    mesh.rotation.z = 0.27;
    mesh.rotation.y = 0;
    mesh.visible = false;
    internal.spaceship = { mesh };

    // Damage timer about to expire this frame.
    internal.damageTimer = 0.01;

    internal.updateDamageEffect(0.05);

    expect(internal.damageTimer).toBe(0);
    expect(mesh.rotation.z).toBe(0);
    expect(mesh.rotation.y).toBe(0);
    expect(mesh.visible).toBe(true);
  });

  it('keeps applying wobble while the damage timer is still active', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;

    const mesh = new THREE.Object3D();
    internal.spaceship = { mesh };

    internal.damageTimer = 0.5;
    internal.updateDamageEffect(0.016);

    expect(internal.damageTimer).toBeGreaterThan(0);
    // wobble = sin(damageTimer * 30) * 0.3, with damageTimer ≈ 0.484 → non-zero
    expect(Math.abs(mesh.rotation.z)).toBeGreaterThan(0);
    expect(Math.abs(mesh.rotation.z)).toBeLessThanOrEqual(0.3 + 1e-6);
    expect(mesh.rotation.y).toBe(0);
  });

  it('leaves rotation untouched when damage timer is already 0 (rest path)', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;

    const mesh = new THREE.Object3D();
    mesh.rotation.z = 0.42; // simulate Spaceship-managed bank value
    internal.spaceship = { mesh };

    internal.damageTimer = 0;
    internal.updateDamageEffect(0.016);

    // Should NOT overwrite rotation when not in damage state.
    expect(mesh.rotation.z).toBe(0.42);
    expect(mesh.visible).toBe(true);
  });
});
