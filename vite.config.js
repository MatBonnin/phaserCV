import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
