import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('safe-area usage regression', () => {
  it('keeps safe-area env() only on root overlay containers', () => {
    const repoRoot = resolve(__dirname, '../../..');
    const indexHtml = readFileSync(resolve(repoRoot, 'index.html'), 'utf8');
    const hudSource = readFileSync(resolve(repoRoot, 'src/ui/HUD.ts'), 'utf8');
    const muteButtonSource = readFileSync(resolve(repoRoot, 'src/ui/createMuteButton.ts'), 'utf8');
    const titleSceneSource = readFileSync(resolve(repoRoot, 'src/game/scenes/TitleScene.ts'), 'utf8');
    const touchGuideSource = readFileSync(resolve(repoRoot, 'src/ui/TouchGuideOverlay.ts'), 'utf8');

    expect(indexHtml).toContain('padding-top: env(safe-area-inset-top, 0px);');
    expect(indexHtml).toContain('padding: env(safe-area-inset-top, 0px) env(safe-area-inset-right, 0px) env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);');
    expect(hudSource).not.toContain('env(safe-area-inset');
    expect(muteButtonSource).not.toContain('env(safe-area-inset');
    expect(titleSceneSource).not.toContain('env(safe-area-inset');
    expect(touchGuideSource).not.toContain('env(safe-area-inset');
  });
});
