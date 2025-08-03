import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Allow connections from any host, useful for local network testing
    host: '0.0.0.0',
  },
  build: {
    // Ensure assets are handled correctly
    assetsDir: 'assets'
  }
});
