// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { prewarmStageVisualAssets } from '../../../src/game/scenes/stageVisualAssets';

describe('prewarmStageVisualAssets without DOM', () => {
  it('document が無い環境でも例外を投げない', () => {
    expect(() => prewarmStageVisualAssets(11)).not.toThrow();
  });
});
