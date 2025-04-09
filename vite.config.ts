import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import markdown from "vite-plugin-markdown";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), markdown()], // Add markdown plugin to the plugins array
  server: {
    open: true, // Automatically open the browser on server start
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
