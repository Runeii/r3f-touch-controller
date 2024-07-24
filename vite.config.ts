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
        'vite',
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'three',
        '@react-three/fiber',
      ],
      output: {
        globals: {
          '@react-three/fiber': 'fiber',
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          'react/jsx-runtime': 'jsxRuntime',
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
