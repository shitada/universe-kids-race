import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // jsdom 環境テストの初回モジュールロードで 5s デフォルトを超える
    // コールドスタートが発生しうるため、並列実行時のフレーキー回避目的で
    // 個別テストのタイムアウトを引き上げる。実テスト本体の挙動は変えない。
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
