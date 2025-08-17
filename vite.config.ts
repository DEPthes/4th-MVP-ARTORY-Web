import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), paths(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://13.209.252.181:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
});
