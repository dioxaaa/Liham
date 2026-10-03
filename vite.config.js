import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset URLs so the built site also works when served from a
  // sub-path or opened statically (e.g. VS Code Live Server on dist/).
  base: "./",
  plugins: [react()],
  // Bind IPv4 loopback on a fixed port so both http://localhost:5173/ and
  // http://127.0.0.1:5173/ reach the dev server.
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: "dist",
  },
  // esbuild's dependency scanner chokes on the Firebase SDK's multi-megabyte
  // source maps, so let the browser pull the SDK's ES modules in as-is during dev.
  optimizeDeps: {
    exclude: ["firebase", "firebase/app", "firebase/firestore"],
  },
});