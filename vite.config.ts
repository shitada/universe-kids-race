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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) {
            return 'three-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
