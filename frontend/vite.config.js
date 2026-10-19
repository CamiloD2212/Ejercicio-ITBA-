import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const frontendDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, frontendDir, '');
  const apiOrigin = new URL(env.VITE_API_URL || 'http://localhost:4000/api').origin;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiOrigin,
          changeOrigin: true,
        },
      },
    },
  };
});
