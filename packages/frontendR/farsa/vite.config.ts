import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/styles/variables.scss' as *;`,
      },
    },
  },
  build: {
    outDir: 'dist', // Output folder
    assetsDir: 'assets', // Place assets in an assets folder
    rollupOptions: {
      input: 'index.html', // Entry point
    },
  },
  server: {
    host: true, // Allows external access if needed
    port: 3000, // Change to your desired port
  },
});

