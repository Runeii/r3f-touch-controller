import { defineConfig } from 'vite';
import path from 'path';
import preserveHMRPlugin from './vite-plugin-preserve-hmr';

export default defineConfig({
  build: {
    lib: {
      entry: [
        path.resolve(__dirname, 'src/index.ts'),
      ],
      name: 'ThreejsTouchController',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: [
        'path',
        'fs/promises',
        'url',
        'fs',
        'react',
        'vite',
        'three',
        '@react-three/fiber',
      ],
      output: {
        globals: {
          '@react-three/fiber': 'fiber',
          'react': 'React',
          'three': 'THREE',
          vite: 'Vite'
        }
      }
    },
  },
  plugins: [
    preserveHMRPlugin()
  ]
});
