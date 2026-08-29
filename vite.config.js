import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        include: /\.(jsx|js)$/,
      }),
    ],
    define: {
      'process.env': {
        REACT_APP_API_URL: env.REACT_APP_API_URL || env.VITE_API_URL || '',
        NODE_ENV: JSON.stringify(mode),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    build: {
      outDir: 'build',
      sourcemap: false,
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
  };
});
