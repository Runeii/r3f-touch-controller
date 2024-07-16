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
        'vite',
        'react',
        'react-dom',
        'three',
        '@react-three/fiber'
      ],
      output: {
        globals: {
          '@react-three/fiber': 'fiber',
          'react': 'React',
          'react-dom': 'ReactDOM',
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
