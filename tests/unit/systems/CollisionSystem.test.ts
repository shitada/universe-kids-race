import { describe, it, expect } from 'vitest';
import { CollisionSystem } from '../../../src/game/systems/CollisionSystem';
import { Spaceship } from '../../../src/game/entities/Spaceship';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import { ShootingStar } from '../../../src/game/entities/ShootingStar';
import { Comet } from '../../../src/game/entities/Comet';
import { SpecialShootingStar } from '../../../src/game/entities/SpecialShootingStar';
import { SpaceGem } from '../../../src/game/entities/SpaceGem';

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

  it('detects LOVELY star collisions like other collectible stars', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const star = new Star(0.5, 0, 0, 'LOVELY');
    const result = system.check(ship, [star], []);
    expect(result.starCollisions).toEqual([star]);
    expect(star.isCollected).toBe(true);
  });

  it('does not detect star collision when far away', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const star = new Star(20, 0, 0);
    const result = system.check(ship, [star], []);
    expect(result.starCollisions).toHaveLength(0);
  });

  it('detects shooting star collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const shootingStar = new ShootingStar(0.5, 0, 0, 1);

    const result = system.check(ship, [], [], 0, [shootingStar]);

    expect(result.shootingStarHit).toBe(shootingStar);
    expect(shootingStar.isCollected).toBe(true);
  });

  it('clears shootingStarHit when no shooting star is hit', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const shootingStar = new ShootingStar(10, 0, 0, 1);

    const result = system.check(ship, [], [], 0, [shootingStar]);

    expect(result.shootingStarHit).toBeNull();
    expect(shootingStar.isCollected).toBe(false);
  });

  it('detects comet collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const comet = new Comet(0.6, 0, 0, 1);

    const result = system.check(ship, [], [], 0, [], [comet]);

    expect(result.cometHit).toBe(comet);
    expect(comet.isCollected).toBe(true);
  });

  it('clears cometHit when no comet is hit', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const comet = new Comet(10, 0, 0, 1);

    const result = system.check(ship, [], [], 0, [], [comet]);

    expect(result.cometHit).toBeNull();
    expect(comet.isCollected).toBe(false);
  });

  it('detects special shooting star collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const specialStar = new SpecialShootingStar(0.6, 0, 0, 'gold', 1);

    const result = system.check(ship, [], [], 0, [], [], [specialStar]);

    expect(result.specialShootingStarHit).toBe(specialStar);
    expect(specialStar.isCollected).toBe(true);
  });

  it('clears specialShootingStarHit when no special shooting star is hit', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const specialStar = new SpecialShootingStar(10, 0, 0, 'silver', 1);

    const result = system.check(ship, [], [], 0, [], [], [specialStar]);

    expect(result.specialShootingStarHit).toBeNull();
    expect(specialStar.isCollected).toBe(false);
  });

  it('detects space gem collision when in range', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const gem = new SpaceGem(0.5, 0, 0, 'diamond-nebula');

    const result = system.check(ship, [], [], 0, [], [], [], [], [gem]);

    expect(result.spaceGemHit).toBe(gem);
    expect(gem.isCollected).toBe(true);
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
    expect(result.meteoriteHit).toBeNull();
  });

  it('returns reference to the hit meteorite via meteoriteHit', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const met = new Meteorite(0.5, 0, 0);
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(true);
    expect(result.meteoriteHit).toBe(met);
  });

  it('clears meteoriteHit when no meteorite is hit', () => {
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const met = new Meteorite(20, 0, 0);
    const result = system.check(ship, [], [met]);
    expect(result.meteoriteCollision).toBe(false);
    expect(result.meteoriteHit).toBeNull();
  });

  it('does not double-hit the same meteorite once isActive is set false', () => {
    // Simulates the StageScene behavior of marking a meteorite consumed
    // after the first hit. A second check() at the same position must not
    // register a duplicate collision.
    const ship = new Spaceship();
    ship.position = { x: 0, y: 0, z: 0 };
    const met = new Meteorite(0.5, 0, 0);
    const first = system.check(ship, [], [met]);
    expect(first.meteoriteCollision).toBe(true);
    expect(first.meteoriteHit).toBe(met);
    // Caller (StageScene) marks it consumed.
    if (first.meteoriteHit) first.meteoriteHit.isActive = false;
    const second = system.check(ship, [], [met]);
    expect(second.meteoriteCollision).toBe(false);
    expect(second.meteoriteHit).toBeNull();
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

  describe('hoisted invariant collision radii (perf refactor regression)', () => {
    it('star: collides exactly at expanded boundary (just inside) with companionBonus', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(1.99, 0, 0);
      const result = sys.check(ship, [star], [], 0.4);
      expect(result.starCollisions).toHaveLength(1);
    });

    it('star: does NOT collide at exactly expanded boundary with companionBonus', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const star = new Star(2.0, 0, 0);
      const result = sys.check(ship, [star], [], 0.4);
      expect(result.starCollisions).toHaveLength(0);
    });

    it('meteorite: does not collide just outside collisionDist (strict < boundary)', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const met = new Meteorite(2.0001, 0, 0);
      const result = sys.check(ship, [], [met]);
      expect(result.meteoriteCollision).toBe(false);
    });

    it('mixed frame: star collected and meteorite hit are both reported consistently', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const starHit = new Star(0.5, 0, 0);
      const starFar = new Star(0, 0, 50);
      const metHit = new Meteorite(0, 0.5, 0);
      const metFar = new Meteorite(0, 0, 50);

      const result = sys.check(ship, [starHit, starFar], [metHit, metFar]);
      expect(result.starCollisions).toEqual([starHit]);
      expect(starHit.isCollected).toBe(true);
      expect(starFar.isCollected).toBe(false);
      expect(result.meteoriteCollision).toBe(true);
    });

    it('handles empty star and meteorite arrays without throwing', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const result = sys.check(ship, [], []);
      expect(result.starCollisions).toHaveLength(0);
      expect(result.meteoriteCollision).toBe(false);
    });
  });

  describe('z-descending early-break optimization (SpawnSystem invariant)', () => {
    // Game coordinate convention: ship moves in -Z (forward). Spawns happen at
    // ship.z - spawnAheadDistance, so newer spawns have smaller (more negative)
    // z. Arrays are maintained in spawn order = z-descending order, meaning
    // dz = sp.z - p.z increases monotonically with array index. CollisionSystem
    // exploits this by `break`ing once dz > collisionDist.
    //
    // Ship at sp.z = 0:
    //   index 0 (oldest, largest p.z, behind ship): dz <  0
    //   ...                                         dz ~  0  ← collision range
    //   index N (newest, smallest p.z, far ahead):  dz >> 0
    it('star: collects only nearby star when 5 far-ahead stars follow in z-descending order', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // z-descending: nearby first (dz=0), then 5 far-ahead (dz=10..50, all > collisionDist=1.6)
      const nearby = new Star(0, 0, 0);
      const farAhead = [
        new Star(0, 0, -10),
        new Star(0, 0, -20),
        new Star(0, 0, -30),
        new Star(0, 0, -40),
        new Star(0, 0, -50),
      ];
      const stars = [nearby, ...farAhead];
      const result = sys.check(ship, stars, []);
      expect(result.starCollisions).toEqual([nearby]);
      expect(nearby.isCollected).toBe(true);
      for (const s of farAhead) {
        expect(s.isCollected).toBe(false);
      }
    });

    it('meteorite: detects collision regardless of z-descending order with far-ahead followers', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const nearby = new Meteorite(0, 0, 0);
      const farAhead = [
        new Meteorite(0, 0, -10),
        new Meteorite(0, 0, -20),
        new Meteorite(0, 0, -30),
        new Meteorite(0, 0, -40),
        new Meteorite(0, 0, -50),
      ];
      const result = sys.check(ship, [], [nearby, ...farAhead]);
      expect(result.meteoriteCollision).toBe(true);
    });

    it('meteorite: detection result is independent of in-array position when z-descending', () => {
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      // Two layouts: hit at head vs hit at the closest-to-ship slot among many ahead-of-ship entries.
      // In z-descending order, "behind ship" entries (larger p.z) come first.
      const layoutA = [new Meteorite(0, 0, 5), new Meteorite(0, 0, 0), new Meteorite(0, 0, -10)];
      const resA = sys.check(ship, [], layoutA);
      expect(resA.meteoriteCollision).toBe(true);
    });

    it('safety net: with order invariant violated, behind-ship `continue` branch still finds in-range entries', () => {
      // The optimization replaced one branch with `break` (forward), but kept
      // the behind-ship branch as `continue`. So if the array is mistakenly
      // ordered with a far-behind entry at index 0 followed by an in-range
      // entry, detection still works.
      const sys = new CollisionSystem();
      const ship = new Spaceship();
      ship.position = { x: 0, y: 0, z: 0 };
      const farBehind = new Star(0, 0, 50); // dz = -50 → continue (behind branch)
      const inRange = new Star(0.3, 0, 0); // dz = 0 → collision
      const result = sys.check(ship, [farBehind, inRange], []);
      expect(result.starCollisions).toEqual([inRange]);
      expect(inRange.isCollected).toBe(true);
      expect(farBehind.isCollected).toBe(false);
    });
  });
});
