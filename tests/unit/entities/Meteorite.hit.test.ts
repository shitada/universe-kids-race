import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import {
  __setSharedVibrationSystemForTest,
  VibrationSystem,
} from '../../../src/game/systems/VibrationSystem';

describe('Meteorite.handleCollision', () => {
  beforeEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  afterEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  it('deactivates the meteorite and triggers a strong vibration once', () => {
    const vibrate = vi.fn(() => true);
    __setSharedVibrationSystemForTest(new VibrationSystem({ vibrate }, () => 0, 0));
    const meteorite = new Meteorite(0, 0, 0);

    meteorite.handleCollision();
    meteorite.handleCollision();

    expect(meteorite.isActive).toBe(false);
    expect(meteorite.mesh.visible).toBe(false);
    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(200);
  });
});
