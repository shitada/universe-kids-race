import { describe, expect, it } from 'vitest';
import viteConfig from '../../vite.config';

describe('build chunk設定', () => {
  it('three を vendor chunk に分離する', () => {
    const output = viteConfig.build?.rollupOptions?.output;
    expect(output).toBeTruthy();
    expect(Array.isArray(output)).toBe(false);

    const manualChunks = Array.isArray(output) ? undefined : output?.manualChunks;
    expect(manualChunks).toBeTypeOf('function');
    expect(manualChunks?.('/project/node_modules/three/build/three.module.js')).toBe('three');
    expect(manualChunks?.('/project/src/main.ts')).toBeUndefined();
  });
});
