import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://flower-catalogue-website.onrender.com',
        changeOrigin: true,
      },
    },
  },
});