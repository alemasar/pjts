import { defineConfig } from 'vite'
import path from 'path';
import config from './src/pjts/pjts.config'
import transformIndexTemplatePlugin from './vite/plugins/vite-plugin-transform-index-template'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  server: {
    port: 3000,
    https: true,
  },
  plugins: [
    basicSsl(),
    // addComponentsPlugin(config),
    {
      ...transformIndexTemplatePlugin(config),
      enforce: 'post',
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@framework': path.resolve(__dirname, './src/framework'),
      '@pjts': path.resolve(__dirname, './src/pjts'),
    },
  }
})