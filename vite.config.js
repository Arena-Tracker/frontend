import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Încărcăm variabilele de mediu din fișierul .env (VITE_...)
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      // Alias-ul "@" pentru importuri mai curate (ex: "@/components/...")
      alias: {
        "@": "/src",
      },
    },
    server: {
      proxy: {
        // Redirecționare pentru User Service (Port 8083)
        "/api/users": {
          target: env.VITE_USERS_SERVICE_URL || "http://localhost:8083",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/users/, ""),
        },
        // Redirecționare pentru Court Service (Port 8081)
        "/api/court": {
          target: env.VITE_COURT_SERVICE_URL || "http://localhost:8081",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/court/, ""),
        },
        // Redirecționare pentru Booking Service (Port 8082)
        "/api/booking": {
          target: env.VITE_BOOKING_SERVICE_URL || "http://localhost:8082",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/booking/, ""),
        },
        // Redirecționare pentru Payment Service (Port 8084)
        "/api/payment": {
          target: env.VITE_PAYMENT_SERVICE_URL || "http://localhost:8084",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/payment/, ""),
        },
      },
    },
  };
});
