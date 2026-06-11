import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({command, mode, ssrBuild}) => {
  // 加载 env 文件
  const env = loadEnv(mode, process.cwd())
    return {
        base: env.VITE_PUBLISH_PATH,
        plugins: [
            vue(),
            vueDevTools(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        }
    }
})
