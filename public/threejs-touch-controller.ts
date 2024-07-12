import { Plugin, ViteDevServer } from 'vite';
import { createServer } from 'vite';
import * as path from 'path';
import { readFile } from 'fs/promises';

export default function threejsTouchController(): Plugin {
  return {
    name: 'threejs-touch-controller',
    configureServer: async (server) => {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/controller') {
          next();
          return;
        }
        try {
          const filePath = path.resolve(__dirname, 'index.html');
          const html = await readFile(filePath, 'utf-8');
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        } catch (error) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
    },
  };
}
