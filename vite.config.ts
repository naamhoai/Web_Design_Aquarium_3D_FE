import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure a single instance of three across app, R3F, drei and
  // postprocessing — avoids "Multiple instances of Three.js" and the
  // subtle instanceof breakage it causes with the effect composer.
  resolve: {
    dedupe: ['three', '@react-three/fiber'],
  },
  optimizeDeps: {
    include: ['three', 'postprocessing', '@react-three/postprocessing'],
  },
})
