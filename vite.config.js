import { defineConfig } from 'vite'
import {resolve} from 'path';
import config from './src/pjts/pjts.config'
import typescript2 from "rollup-plugin-typescript2";
import catTransformPlugin from './src/cat/vite-plugins/vite-plugin-cat-transform'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  base: './',
  server: {
    port: 8080,
    https: true,
  },
  plugins: [
    basicSsl(),
    {
      ...typescript2(),
      apply: "build",
    },
    // addComponentsPlugin(config),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@cat': resolve(__dirname, './src/cat/src'),
      '@cat-server': resolve(__dirname, './src/cat/src/server'),
      '@cat-client': resolve(__dirname, './src/cat/src/client'),
      '@pjts-game': resolve(__dirname, './src/pjts'),
    },
  }
})