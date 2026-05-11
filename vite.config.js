import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Îi spunem lui Vite exact unde să ducă simbolul "@"
    alias: {
      "@": "/src",
    },
  },
});
