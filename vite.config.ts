import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:9090";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/ws": {
          target: proxyTarget,
          ws: true,
          changeOrigin: true,
        },
        "/Ping": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
