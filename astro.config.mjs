import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [
    svelte(),
    tailwind({
      config: { path: "./tailwind.config.mjs" },
    }),
  ],
});
