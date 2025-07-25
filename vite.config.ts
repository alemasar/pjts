import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import fs from "fs";
import pjts from "./src/cat/cat-vite-plugin/cat-vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    pjts(),
    tailwindcss(),
  ],
  server: {
    host: "cat.alemasar.com",
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost-cert.pem"),
    },
    port: 3010,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@cat": path.resolve(__dirname, "src/cat"),
      "@gaps-config": path.resolve(__dirname, "pjts/gaps-config"),
      "@pages": path.resolve(__dirname, "pjts/pages"),
      "@pjts": path.resolve(__dirname, "pjts"),
    },
  },
});
