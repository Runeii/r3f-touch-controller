// This plugin needs to connect to the client-side HMR API
// As such, we do not want Vite to strip out `import.meta.hot`

export default function preserveHMRPlugin() {
  return {
    name: 'preserve-hmr-plugin',
    transform(code, id) {
      // Specify the path to the file you want to exclude from transformation
      if (id.endsWith('main.ts')) {
        // This will prevent Vite from replacing `import.meta.hot`
        code = code.replace(/import\.meta\.hot/g, '__VITE_HMR_PRESERVE__');
      }
      return {
        code,
        map: null, // Provide source map if available
      };
    },
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Restore the original `import.meta.hot` for the specified file
          chunk.code = chunk.code.replace(/__VITE_HMR_PRESERVE__/g, 'import.meta.hot');
        }
      }
    }
  };
}
