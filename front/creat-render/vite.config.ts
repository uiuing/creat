import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': { ...process.env, ...loadEnv('mode', process.cwd()) }
  }
})
