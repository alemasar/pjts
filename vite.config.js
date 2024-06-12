import { defineConfig } from 'vite'
import path from 'path';
import config from './src/pjts/pjts.config'
import addComponentsPlugin from './vite/plugins/vite-plugin-add-components'

export default defineConfig({
  plugins: [addComponentsPlugin(config)],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})