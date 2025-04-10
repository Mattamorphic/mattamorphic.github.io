import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/mattamorphic.github.io/' : '/',
  plugins: [
    react(),
    markdown(),
  ],
}));