import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/universe-kids-race/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
});
