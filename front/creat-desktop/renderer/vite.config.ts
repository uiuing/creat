import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED': JSON.stringify(
      process.env.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED
    ),
    'process.env.TERM': JSON.stringify(process.env.TERM),
    'process.platform': JSON.stringify(process.platform)
  }
})
