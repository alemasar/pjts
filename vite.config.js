import { defineConfig } from 'vite'
import path from 'path';
import config from './src/pjts/pjts.config'
import catTransformPlugin from './src/cat/vite-plugins/vite-plugin-cat-transform'
import basicSsl from '@vitejs/plugin-basic-ssl'

console.log(path.resolve(__dirname, "index.html"))
export default defineConfig({
  server: {
    port: 8080,
    https: true,
  },
  plugins: [
    basicSsl(),
    // addComponentsPlugin(config),
    {
      ...catTransformPlugin(config),
      enforce: 'post',
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@cat': path.resolve(__dirname, './src/cat/src'),
      '@cat-server': path.resolve(__dirname, './src/cat/src/server'),
      '@cat-client': path.resolve(__dirname, './src/cat/src/client'),
      '@pjts-game': path.resolve(__dirname, './src/pjts'),
    },
  }
})