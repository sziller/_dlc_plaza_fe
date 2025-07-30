// vite.config.mjs
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      // Auto-register components like <i-simple-icons-x />
      resolvers: [IconsResolver({ componentPrefix: 'i' })],
      // optional: generate d.ts for auto-imported components
      dts: 'src/components.d.ts',
    }),
    Icons(), // pulls icon data from @iconify/json
  ],
})
