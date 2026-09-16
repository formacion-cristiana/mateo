// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/mateo/",
  plugins: [
    react(),
  ],
  build: {
    outDir: "dist",
  },
});
