import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Star } from '../../../src/game/entities/Star';
import {
  __setSharedVisualFeedbackSystemForTest,
  VisualFeedbackSystem,
} from '../../../src/game/systems/VisualFeedbackSystem';

describe('Star.collect', () => {
  beforeEach(() => {
    __setSharedVisualFeedbackSystemForTest(null);
  });

  afterEach(() => {
    __setSharedVisualFeedbackSystemForTest(null);
  });

  it('triggers a single normal-star visual feedback event', () => {
    const handler = vi.fn();
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setHandler(handler);
    __setSharedVisualFeedbackSystemForTest(system);
    const star = new Star(0, 0, 0, 'NORMAL');

    star.collect();
    star.collect();

    expect(star.isCollected).toBe(true);
    expect(star.mesh.visible).toBe(false);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ event: 'starCollect' }));
  });

  it('uses the rainbow collection effect for a rainbow star', () => {
    const handler = vi.fn();
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setHandler(handler);
    __setSharedVisualFeedbackSystemForTest(system);
    const star = new Star(0, 0, 0, 'RAINBOW');

    star.collect();

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ event: 'rainbowCollect' }));
  });

  it('uses the rainbow collection effect for a lovely star', () => {
    const handler = vi.fn();
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setHandler(handler);
    __setSharedVisualFeedbackSystemForTest(system);
    const star = new Star(0, 0, 0, 'LOVELY');

    star.collect();

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ event: 'rainbowCollect' }));
  });
});
