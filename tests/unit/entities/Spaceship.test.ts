import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Spaceship } from '../../../src/game/entities/Spaceship';

describe('Spaceship', () => {
  it('initializes with default position and speed', () => {
    const ship = new Spaceship();
    expect(ship.position.x).toBe(0);
    expect(ship.position.z).toBe(0);
    expect(ship.speed).toBeGreaterThan(0);
  });

  it('moves left when moveLeft is called', () => {
    const ship = new Spaceship();
    const startX = ship.position.x;
    ship.moveLeft(1 / 60);
    expect(ship.position.x).toBeLessThan(startX);
  });

  it('moves right when moveRight is called', () => {
    const ship = new Spaceship();
    const startX = ship.position.x;
    ship.moveRight(1 / 60);
    expect(ship.position.x).toBeGreaterThan(startX);
  });

  it('clamps position to boundary limits', () => {
    const ship = new Spaceship();
    // Move far left beyond boundary
    for (let i = 0; i < 200; i++) {
      ship.moveLeft(1 / 60);
    }
    expect(ship.position.x).toBeGreaterThanOrEqual(ship.boundaryMin);

    // Move far right beyond boundary
    for (let i = 0; i < 400; i++) {
      ship.moveRight(1 / 60);
    }
    expect(ship.position.x).toBeLessThanOrEqual(ship.boundaryMax);
  });

  it('auto-advances forward on update', () => {
    const ship = new Spaceship();
    const startZ = ship.position.z;
    ship.update(1 / 60);
    expect(ship.position.z).toBeLessThan(startZ); // z decreases = moving forward (into screen)
  });

  it('has NORMAL speed state by default', () => {
    const ship = new Spaceship();
    expect(ship.speedState).toBe('NORMAL');
  });

  it('transitions to SLOWDOWN on hit', () => {
    const ship = new Spaceship();
    ship.onMeteoriteHit();
    expect(ship.speedState).toBe('SLOWDOWN');
  });

  it('transitions from SLOWDOWN to RECOVERING after timer expires', () => {
    const ship = new Spaceship();
    ship.onMeteoriteHit();
    expect(ship.speedState).toBe('SLOWDOWN');
    // Update for 3+ seconds to finish SLOWDOWN
    ship.update(3.1);
    expect(ship.speedState).toBe('RECOVERING');
  });

  it('transitions from RECOVERING to NORMAL after recovery timer expires', () => {
    const ship = new Spaceship();
    ship.onMeteoriteHit();
    // SLOWDOWN → RECOVERING
    ship.update(3.1);
    expect(ship.speedState).toBe('RECOVERING');
    // RECOVERING → NORMAL (1 second)
    ship.update(1.1);
    expect(ship.speedState).toBe('NORMAL');
  });

  it('returns correct forward speed based on state', () => {
    const ship = new Spaceship();
    const normalSpeed = ship.getForwardSpeed();
    ship.onMeteoriteHit();
    const slowSpeed = ship.getForwardSpeed();
    expect(slowSpeed).toBeLessThan(normalSpeed);
  });

  it('returns progress based on distance traveled', () => {
    const ship = new Spaceship();
    expect(ship.getProgress(500)).toBe(0);
    // Simulate moving forward
    for (let i = 0; i < 600; i++) {
      ship.update(1 / 60);
    }
    const progress = ship.getProgress(500);
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThanOrEqual(1);
  });

  describe('RECOVERING state', () => {
    it('getForwardSpeed at progress 0 returns SLOWDOWN_MULTIPLIER speed', () => {
      const ship = new Spaceship();
      ship.onMeteoriteHit();
      ship.update(3.01); // transition to RECOVERING
      expect(ship.speedState).toBe('RECOVERING');
      // At start of RECOVERING, speed should be ~0.4x
      const speed = ship.getForwardSpeed();
      const normalSpeed = ship.speed;
      expect(speed / normalSpeed).toBeCloseTo(0.4, 1);
    });

    it('getForwardSpeed at progress 0.5 returns ~0.85x', () => {
      const ship = new Spaceship();
      ship.onMeteoriteHit();
      ship.update(3.01); // transition to RECOVERING
      // Advance 0.5s into RECOVERING (half of 1.0s duration)
      ship.update(0.5);
      expect(ship.speedState).toBe('RECOVERING');
      const speed = ship.getForwardSpeed();
      const normalSpeed = ship.speed;
      expect(speed / normalSpeed).toBeCloseTo(0.85, 1);
    });

    it('getForwardSpeed at progress 1.0 transitions to NORMAL (1.0x)', () => {
      const ship = new Spaceship();
      ship.onMeteoriteHit();
      ship.update(3.01); // transition to RECOVERING
      ship.update(1.01); // finish RECOVERING
      expect(ship.speedState).toBe('NORMAL');
      const speed = ship.getForwardSpeed();
      expect(speed).toBe(ship.speed);
    });

    it('re-hit during RECOVERING resets to SLOWDOWN', () => {
      const ship = new Spaceship();
      ship.onMeteoriteHit();
      ship.update(3.01); // transition to RECOVERING
      expect(ship.speedState).toBe('RECOVERING');
      ship.onMeteoriteHit(); // re-hit
      expect(ship.speedState).toBe('SLOWDOWN');
    });

    it('boost during RECOVERING switches to BOOST', () => {
      const ship = new Spaceship();
      ship.onMeteoriteHit();
      ship.update(3.01); // transition to RECOVERING
      expect(ship.speedState).toBe('RECOVERING');
      ship.activateBoost();
      expect(ship.speedState).toBe('BOOST');
    });
  });

  describe('dispose', () => {
    it('disposes all child mesh geometry and materials recursively', () => {
      const ship = new Spaceship();
      const geoSpies: ReturnType<typeof vi.spyOn>[] = [];
      const matSpies: ReturnType<typeof vi.spyOn>[] = [];
      ship.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          geoSpies.push(vi.spyOn(child.geometry, 'dispose'));
          matSpies.push(vi.spyOn(child.material as THREE.Material, 'dispose'));
        }
      });
      expect(geoSpies.length).toBeGreaterThan(0);

      ship.dispose();

      for (const s of geoSpies) expect(s).toHaveBeenCalledTimes(1);
      for (const s of matSpies) expect(s).toHaveBeenCalledTimes(1);
    });
  });
});
