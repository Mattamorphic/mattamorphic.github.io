import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/mattamorphic.github.io/' : '/',
  plugins: [
    react(),
    markdown(),
  ],
  server: {
    open: true, // Automatically open the app in the browser during development
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
}));