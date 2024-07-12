import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'ThreejsTouchController',
      fileName: (format) => `three-js-touch-controller.${format}.js`
    },
    rollupOptions: {
      // Ensure to externalize dependencies that shouldn't be bundled
      external: ['vite'],
      output: {
        globals: {
          vite: 'Vite'
        }
      }
    }
  }
});
