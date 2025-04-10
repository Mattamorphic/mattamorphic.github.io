import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig({
  base: '/mattamorphic.github.io/',
  plugins: [
    react(),
    markdown(), // Add Markdown plugin to handle .md files
  ],
});
