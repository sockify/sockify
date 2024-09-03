import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        // Name of the service in `docker-compose.yml`
        target: "http://api:8080",
        changeOrigin: true
      }
    }
  }
});
