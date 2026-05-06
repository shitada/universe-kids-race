import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __setSharedVisualFeedbackSystemForTest,
  getResolvedVisualFeedbackEffect,
  getSharedVisualFeedbackSystem,
  VisualFeedbackSystem,
} from '../../../src/game/systems/VisualFeedbackSystem';

describe('VisualFeedbackSystem', () => {
  beforeEach(() => {
    __setSharedVisualFeedbackSystemForTest(null);
  });

  it('resolves the expected star-collection effect profile', () => {
    expect(getResolvedVisualFeedbackEffect('starCollect', 'strong')).toEqual({
      event: 'starCollect',
      durationMs: 100,
      priority: 1,
      overlayBackground: 'transparent',
      overlayOpacity: 0,
      spaceshipScale: 1.2,
    });
  });

  it('scales overlay opacity and ship scale when intensity is lowered', () => {
    expect(getResolvedVisualFeedbackEffect('boost', 'weak')).toMatchObject({
      durationMs: 300,
      overlayOpacity: 0.144,
      spaceshipScale: 1.072,
    });
  });

  it('dispatches visual effects through the registered handler', () => {
    const handler = vi.fn();
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setHandler(handler);

    expect(system.trigger('meteoriteHit')).toBe(true);

    expect(handler).toHaveBeenCalledWith(expect.objectContaining({
      event: 'meteoriteHit',
      durationMs: 200,
      overlayOpacity: 0.315,
      spaceshipScale: 1,
    }));
  });

  it('suppresses repeated low-priority effects but allows stronger ones to override', () => {
    const handler = vi.fn();
    let now = 1000;
    const system = new VisualFeedbackSystem(() => now, 100);
    system.setHandler(handler);

    expect(system.trigger('starCollect')).toBe(true);
    now += 20;
    expect(system.trigger('starCollect')).toBe(false);
    expect(system.trigger('meteoriteHit')).toBe(true);

    expect(handler).toHaveBeenCalledTimes(2);
    expect(handler.mock.calls[0]?.[0]).toMatchObject({ event: 'starCollect' });
    expect(handler.mock.calls[1]?.[0]).toMatchObject({ event: 'meteoriteHit' });
  });

  it('returns false when visual feedback is off or no handler is connected', () => {
    const system = new VisualFeedbackSystem(() => 0, 0);
    system.setIntensity('off');
    expect(system.trigger('boost')).toBe(false);

    const idleSystem = new VisualFeedbackSystem(() => 0, 0);
    expect(idleSystem.trigger('boost')).toBe(false);
  });

  it('lets tests replace the shared visual feedback system', () => {
    const system = new VisualFeedbackSystem(() => 0, 0);
    __setSharedVisualFeedbackSystemForTest(system);
    expect(getSharedVisualFeedbackSystem()).toBe(system);
  });
});
