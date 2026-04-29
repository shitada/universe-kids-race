import { describe, it, expect } from 'vitest';
import { followCameraZ } from '../../../src/game/utils/followCameraZ';

describe('followCameraZ', () => {
  it('snaps position.z to shipZ at parallax 1.0', () => {
    const obj = { position: { z: 0 } };
    followCameraZ(obj, -123.4, 1.0);
    expect(obj.position.z).toBeCloseTo(-123.4);
  });

  it('handles zero shipZ', () => {
    const obj = { position: { z: 999 } };
    followCameraZ(obj, 0, 1.0);
    expect(obj.position.z).toBe(0);
  });

  it('applies parallax coefficient < 1.0', () => {
    const obj = { position: { z: 0 } };
    followCameraZ(obj, -1000, 0.9);
    expect(obj.position.z).toBeCloseTo(-900);
  });

  it('handles large negative shipZ (deep stage)', () => {
    const obj = { position: { z: 0 } };
    followCameraZ(obj, -3000, 1.0);
    expect(obj.position.z).toBe(-3000);
  });

  it('handles positive shipZ', () => {
    const obj = { position: { z: 0 } };
    followCameraZ(obj, 50, 1.0);
    expect(obj.position.z).toBe(50);
  });
});
