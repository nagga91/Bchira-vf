import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://51.210.180.53:5000',
        changeOrigin: true,
      },
      '/uploads': 'http://51.210.180.53:5000',
    },
  },
})
