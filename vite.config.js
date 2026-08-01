import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    /**
     * Bind IPv4 explicitly. Left to itself Vite resolves "localhost" to ::1 on
     * Windows and binds IPv6 only, which leaves 127.0.0.1 refusing connections:
     * the browser copes, curl and most tooling do not.
     *
     * PORT lets a host assign the port; 5173 stays the default when it is unset.
     */
    host: "127.0.0.1",
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Split the heavy, rarely-changing dependencies into their own chunks.
         * Everything used to land in one ~890 kB bundle, so a visitor sitting
         * on the sign-in screen still downloaded the whole charting library.
         */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          supabase: ["@supabase/supabase-js"],
          forms: ["react-hook-form", "react-toastify"],
        },
      },
    },
  },
});
