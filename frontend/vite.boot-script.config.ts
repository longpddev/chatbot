import commonConfig from "./vite.config";
import { defineConfig } from "vite";
export default defineConfig({
  extends: [commonConfig],
  build: {
    rollupOptions: {
      input: {
        "boot-script": "./src/boot-script/index.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
