import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import {
  __setSharedVisualFeedbackSystemForTest,
  VisualFeedbackSystem,
} from '../../../src/game/systems/VisualFeedbackSystem';

describe('Meteorite.handleCollision', () => {
  beforeEach(() => {
    __setSharedVisualFeedbackSystemForTest(null);
  });

  afterEach(() => {
    __setSharedVisualFeedbackSystemForTest(null);
  });

  it('deactivates the meteorite and triggers a single hit effect', () => {
    const handler = vi.fn();
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setHandler(handler);
    __setSharedVisualFeedbackSystemForTest(system);
    const meteorite = new Meteorite(0, 0, 0);

    meteorite.handleCollision();
    meteorite.handleCollision();

    expect(meteorite.isActive).toBe(false);
    expect(meteorite.mesh.visible).toBe(false);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      event: 'meteoriteHit',
      durationMs: 200,
    }));
  });
});
