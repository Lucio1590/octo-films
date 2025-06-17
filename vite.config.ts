import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      // Use styled-components as the styled engine for MUI
      '@mui/styled-engine': '@mui/styled-engine-sc',
    },
  },
})
