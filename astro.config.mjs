import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  vite: {
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
    plugins: [tailwindcss()],
  },
});
