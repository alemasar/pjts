import { defineConfig } from 'vite'
import path from 'path';
import config from './src/pjts/pjts.config'
import transformComponentsPlugin from './vite/plugins/vite-plugin-transform-components'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    port: 3000,
    https: true,
  },
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
  plugins: [
    basicSsl(),
    // addComponentsPlugin(config),
    transformComponentsPlugin(config)
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@framework': path.resolve(__dirname, './src/framework'),
      '@pjts': path.resolve(__dirname, './src/pjts'),
    },
  }
})