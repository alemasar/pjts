import { defineConfig } from 'vite'
import path from 'path';
import config from './src/pjts/pjts.config'
import addComponentsPlugin from './vite/plugins/vite-plugin-add-components'
import basicSsl from "@vitejs/plugin-basic-ssl"

export default defineConfig({
  server: {
    port: 3000,
    https: true,
  },
  plugins: [basicSsl(), addComponentsPlugin(config)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})