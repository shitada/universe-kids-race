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

  it('detects meteorite collision during RECOVERING state (not invincible)', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    // Put ship in RECOVERING state
    ship.speedState = 'RECOVERING';
    ship.speedStateTimer = 0.5;
    const met = new Meteorite(0.5, 0, 0);
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(true);
  });

  describe('companionBonus', () => {
    it('expands star collision distance by bonus value', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // Place star just outside normal range (1.0 + 0.6 = 1.6) but within bonus range
      const star = new Star(2.0, 0, 0);
      // Without bonus: dist 2.0 > collisionDist 1.6 → no collision
      const resultNoBonus = system.check(ship, [star], []);
      expect(resultNoBonus.starCollisions).toHaveLength(0);

      // Reset star
      star.isCollected = false;
      // With bonus 0.6: collisionDist = 1.6 + 0.6 = 2.2 > 2.0 → collision
      const resultWithBonus = system.check(ship, [star], [], 0.6);
      expect(resultWithBonus.starCollisions).toHaveLength(1);
    });

    it('does not affect meteorite collision distance', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // Place meteorite just outside normal range (1.0 + 1.0 = 2.0)
      const met = new Meteorite(2.5, 0, 0);
      // With large bonus, meteorite should still NOT be hit
      const result = system.check(ship, [], [met], 2.0);
      expect(result.meteoriteCollision).toBe(false);
    });

    it('defaults companionBonus to 0 for backward compatibility', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(0.5, 0, 0);
      // Call without companion bonus — should still work
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(1);
    });
  });

  describe('squared-distance boundary behavior', () => {
    it('does NOT collide when distance equals collisionDist (strict <)', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // Star radius default 0.6 → collisionDist = 1.0 + 0.6 = 1.6. Place exactly at 1.6.
      const star = new Star(1.6, 0, 0);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(0);
    });

    it('collides when distance is just inside collisionDist', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(1.59, 0, 0);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(1);
    });

    it('meteorite: does NOT collide when distance equals collisionDist', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // Meteorite radius default 1.0 → collisionDist = 2.0. Place exactly at 2.0.
      const met = new Meteorite(2.0, 0, 0);
      const result = system.check(ship, [], [met]);
      expect(result.meteoriteCollision).toBe(false);
    });

    it('meteorite: collides when distance is just inside collisionDist', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const met = new Meteorite(1.99, 0, 0);
      const result = system.check(ship, [], [met]);
      expect(result.meteoriteCollision).toBe(true);
    });
  });

  describe('result buffer reuse', () => {
    it('does not carry starCollisions from the previous call', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };

      const starHit = new Star(0.5, 0, 0);
      const r1 = sys.check(ship, [starHit], []);
      expect(r1.starCollisions).toHaveLength(1);

      // Second call with no stars in range must produce an empty list,
      // even though the buffer is reused.
      const starFar = new Star(50, 0, 0);
      const r2 = sys.check(ship, [starFar], []);
      expect(r2.starCollisions).toHaveLength(0);
    });

    it('resets meteoriteCollision flag between calls', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };

      const met = new Meteorite(0.5, 0, 0);
      const r1 = sys.check(ship, [], [met]);
      expect(r1.meteoriteCollision).toBe(true);

      const r2 = sys.check(ship, [], []);
      expect(r2.meteoriteCollision).toBe(false);
    });
  });

  describe('Z-axis early-skip behavior', () => {
    it('detects star collision when Z is identical and x/y close', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 5 };
      const star = new Star(0.3, 0.2, 5);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(1);
    });

    it('detects star collision when star is +1.4 ahead in Z (within radius)', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(0, 0, 1.4);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(1);
    });

    it('detects star collision when star is -1.4 behind in Z (within radius)', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(0, 0, -1.4);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(1);
    });

    it('skips star far ahead in Z (+5) even when x/y are close', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(0, 0, 5);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(0);
      expect(star.isCollected).toBe(false);
    });

    it('skips star far behind in Z (-5) even when x/y are close', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(0, 0, -5);
      const result = system.check(ship, [star], []);
      expect(result.starCollisions).toHaveLength(0);
    });

    it('respects companionBonus when computing Z early-skip threshold', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // collisionDist without bonus = 1.6; with bonus 0.4 = 2.0.
      // Place star at z=1.9 → outside without bonus, inside with bonus.
      const star = new Star(0, 0, 1.9);
      const noBonus = system.check(ship, [star], []);
      expect(noBonus.starCollisions).toHaveLength(0);

      star.isCollected = false;
      const withBonus = system.check(ship, [star], [], 0.4);
      expect(withBonus.starCollisions).toHaveLength(1);
    });

    it('skips meteorite far ahead in Z (+5) even when x/y are close', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const met = new Meteorite(0, 0, 5);
      const result = system.check(ship, [], [met]);
      expect(result.meteoriteCollision).toBe(false);
    });

    it('detects meteorite collision when Z within radius (collisionDist=2.0)', () => {
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const met = new Meteorite(0, 0, 1.9);
      const result = system.check(ship, [], [met]);
      expect(result.meteoriteCollision).toBe(true);
    });
  });
});
