import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // the three.js scene ships as a deliberate lazy chunk (~244KB gz)
    chunkSizeWarningLimit: 1000,
  },
})
