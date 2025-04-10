import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig(() => ({
  plugins: [
    react(),
    markdown(),
  ],
  server: {
    open: true, // Automatically open the app in the browser during development
    headers: {
      'Access-Control-Allow-Origin': '*', // Allow cross-origin requests
    },
    proxy: {
      '/assets': {
        target: 'https://mattamorphic.github.io', // Replace with the actual server hosting the assets
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, ''),
      },
    },
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