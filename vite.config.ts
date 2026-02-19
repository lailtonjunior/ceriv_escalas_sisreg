import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './', // Set the root directory to the project root
  resolve: {
    alias: {
      '@': '/src', // Alias for easier imports
    },
  },
  build: {
    outDir: 'dist', // Output directory
  },
  // Properly configure the entry point
  entry: 'index.tsx', // Set entry point to index.tsx
});
