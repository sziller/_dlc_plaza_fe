// vite.config.mjs
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import pkg from './package.json'

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    proxy: {
      '/app': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/vue/') ||
            id.includes('/node_modules/vue-router/') ||
            id.includes('/node_modules/@vue/')
          ) {
            return 'vendor-vue'
          }
          if (id.includes('/node_modules/@fullcalendar/')) {
            return 'vendor-calendar'
          }
          if (id.includes('/node_modules/marked/')) {
            return 'vendor-markdown'
          }
          if (id.includes('/node_modules/@vuepic/')) {
            return 'vendor-datepicker'
          }
          if (id.includes('/node_modules/axios/')) {
            return 'vendor-http'
          }
        },
      },
    },
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 👇 Tell Vue to ignore <lite-youtube> as a native custom element
          isCustomElement: (tag) => tag === 'lite-youtube',
        },
      },
    }),
    Components({
      // Auto-register components like <i-simple-icons-x />
      resolvers: [IconsResolver({ componentPrefix: 'i' })],
      dts: 'src/components.d.ts',
    }),
    Icons(),
  ],
})
