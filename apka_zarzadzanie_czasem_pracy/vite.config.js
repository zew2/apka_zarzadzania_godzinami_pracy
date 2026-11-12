import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    
    target: 'chrome80'
  },
  build: {
    target: 'chrome80'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'chrome80'
    }
  }
})