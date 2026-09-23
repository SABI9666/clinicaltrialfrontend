import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Lets the dev server talk to a locally running API without CORS setup.
    proxy: {
      '/api': { target: process.env.VITE_DEV_API ?? 'http://localhost:8080', changeOrigin: true },
      '/uploads': { target: process.env.VITE_DEV_API ?? 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
