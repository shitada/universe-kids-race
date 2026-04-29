// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { BoostSystem } from '../../../src/game/systems/BoostSystem';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface StageInternal {
  threeScene: THREE.Scene;
  spaceship: { position: { x: number; y: number; z: number } };
  boostSystem: BoostSystem;
  boostLines: THREE.LineSegments | null;
  lastBoostLinesVisible: boolean | null;
  initBoostLines(): void;
  updateBoostEffects(): void;
  exit(): void;
}

function createScene(): StageInternal {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {} as InputSystem;
  const audioManager = {
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    stopBoostSFX: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {} as SaveManager;
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  const internal = scene as unknown as StageInternal;
  internal.threeScene = new THREE.Scene();
  internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
  return internal;
}

/** Replace `visible` on the LineSegments with a tracking accessor. */
function spyOnVisible(obj: THREE.Object3D): {
  writes: boolean[];
  restore: () => void;
} {
  const writes: boolean[] = [];
  let backing = obj.visible;
  const desc = Object.getOwnPropertyDescriptor(obj, 'visible');
  Object.defineProperty(obj, 'visible', {
    configurable: true,
    enumerable: true,
    get(): boolean {
      return backing;
    },
    set(v: boolean) {
      writes.push(v);
      backing = v;
    },
  });
  return {
    writes,
    restore() {
      if (desc) {
        Object.defineProperty(obj, 'visible', desc);
      } else {
        delete (obj as unknown as { visible?: boolean }).visible;
        (obj as unknown as { visible: boolean }).visible = backing;
      }
    },
  };
}

describe('StageScene boostLines.visible redundant write suppression', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('writes visible=false at most once when boost stays inactive across many frames', () => {
    const internal = createScene();
    internal.initBoostLines();
    // Cache primed to false in initBoostLines.
    expect(internal.lastBoostLinesVisible).toBe(false);

    const spy = spyOnVisible(internal.boostLines!);

    for (let i = 0; i < 60; i++) {
      internal.updateBoostEffects();
    }

    expect(spy.writes.length).toBe(0);
    expect(internal.boostLines!.visible).toBe(false);

    spy.restore();
  });

  it('writes visible only on transitions across boost on/off cycles', () => {
    const internal = createScene();
    internal.initBoostLines();
    const spy = spyOnVisible(internal.boostLines!);

    // Inactive frames -- no writes (cache was primed to false).
    internal.updateBoostEffects();
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([]);

    // Activate boost -> first frame writes true, subsequent frames stay silent.
    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([true]);
    internal.updateBoostEffects();
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([true]);

    // Deactivate -> exactly one false write on the transition.
    internal.boostSystem.update(10);
    expect(internal.boostSystem.isActive()).toBe(false);
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([true, false]);
    internal.updateBoostEffects();
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([true, false]);

    // Re-activate -> one more true write.
    internal.boostSystem.reset();
    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(spy.writes).toEqual([true, false, true]);

    spy.restore();
  });

  it('initBoostLines primes the visibility cache to false (covers fresh-stage start)', () => {
    const internal = createScene();
    internal.initBoostLines();
    expect(internal.boostLines!.visible).toBe(false);
    expect(internal.lastBoostLinesVisible).toBe(false);

    // Activate boost and update so the cache moves to true.
    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(internal.lastBoostLinesVisible).toBe(true);

    // Simulate the dispose half of exit(): tear down boostLines and invalidate the cache.
    // (The production exit() does this around the boostLines dispose block.)
    internal.threeScene.remove(internal.boostLines!);
    internal.boostLines!.geometry.dispose();
    (internal.boostLines!.material as THREE.Material).dispose();
    internal.boostLines = null;
    internal.lastBoostLinesVisible = null;

    // Re-init for the next stage: cache must be primed to false again so the
    // first inactive update() does not produce a redundant write.
    internal.initBoostLines();
    expect(internal.boostLines!.visible).toBe(false);
    expect(internal.lastBoostLinesVisible).toBe(false);

    // Reset boost so updateBoostEffects sees inactive state.
    internal.boostSystem.update(10);
    internal.boostSystem.reset();

    const spy = spyOnVisible(internal.boostLines!);
    for (let i = 0; i < 5; i++) {
      internal.updateBoostEffects();
    }
    expect(spy.writes.length).toBe(0);
    expect(internal.boostLines!.visible).toBe(false);

    spy.restore();
  });
});
