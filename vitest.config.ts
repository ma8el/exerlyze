import { defineConfig } from 'vitest/config';
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    legacy()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    deps: {
      inline: [
        "echarts",
        "vue-echarts"
      ]
    }
  }
});
