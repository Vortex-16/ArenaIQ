import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ArenaIQ/',
  build: {
    outDir: 'docs'
  },
  test: {
    // Vitest configuration
    environment: 'node',
    include: ['src/**/*.test.js', 'src/**/*.test.jsx'],
    globals: false,
    coverage: {
      reporter: ['text', 'json', 'html'],
    }
  }
});
