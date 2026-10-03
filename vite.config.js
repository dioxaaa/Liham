import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  // esbuild's dependency scanner chokes on the Firebase SDK's multi-megabyte
  // source maps, so let the browser pull the SDK's ES modules in as-is during dev.
  optimizeDeps: {
    exclude: ["firebase", "firebase/app", "firebase/firestore"],
  },
});