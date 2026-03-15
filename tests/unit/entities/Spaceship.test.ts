import { describe, it, expect } from 'vitest';
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

  it('recovers from SLOWDOWN after timer expires', () => {
    const ship = new Spaceship();
    ship.onMeteoriteHit();
    expect(ship.speedState).toBe('SLOWDOWN');
    // Update for 3+ seconds to recover
    ship.update(3.1);
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
});
