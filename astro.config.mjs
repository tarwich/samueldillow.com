import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://samueldillow.com",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
