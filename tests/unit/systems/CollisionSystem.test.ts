import { describe, it, expect } from 'vitest';
import { CollisionSystem } from '../../../src/game/systems/CollisionSystem';
import { Spaceship } from '../../../src/game/entities/Spaceship';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';

describe('CollisionSystem', () => {
  const system = new CollisionSystem();

  it('detects star collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const star = new Star(0.5, 0, 0);
    const result = system.check(ship, [star], []);
    expect(result.starCollisions).toHaveLength(1);
    expect(star.isCollected).toBe(true);
  });

  it('skips collected stars', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const star = new Star(0.5, 0, 0);
    star.isCollected = true;
    const result = system.check(ship, [star], []);
    expect(result.starCollisions).toHaveLength(0);
  });

  it('does not detect star collision when far away', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const star = new Star(20, 0, 0);
    const result = system.check(ship, [star], []);
    expect(result.starCollisions).toHaveLength(0);
  });

  it('detects meteorite collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const met = new Meteorite(0.5, 0, 0);
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(true);
  });

  it('skips meteorite collision during SLOWDOWN invincibility', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    ship.onMeteoriteHit(); // enter SLOWDOWN
    const met = new Meteorite(0.5, 0, 0);
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(false);
  });

  it('skips inactive meteorites', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const met = new Meteorite(0.5, 0, 0);
    met.isActive = false;
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(false);
  });
});
