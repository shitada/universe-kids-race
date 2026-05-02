// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('stageVisualAssets import regression', () => {
  it('TitleScene does not statically import StageScene', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/game/scenes/TitleScene.ts'),
      'utf8',
    );

    expect(source).toContain("from './stageVisualAssets'");
    expect(source).not.toContain("from './StageScene'");
  });
});
