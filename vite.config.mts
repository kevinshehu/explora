/// <reference types="vitest" />
import { defineConfig } from "vite";

import angular from "@analogjs/vite-plugin-angular";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig(({ mode }) => ({
  plugins: [angular(), viteTsConfigPaths()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4300',
    },
  },
  test: {
    globals: true,
    setupFiles: ["src/test-setup.ts"],
    // environment: 'jsdom',
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    // Vitest browser config
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
}));
