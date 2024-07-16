import { Plugin } from 'vite';

export default function viteR3FTouchController(): Plugin {
  return {
    name: 'threejs-touch-controller',
    configureServer: async (server) => {
      server.ws.on('vite-r3f-touch-controller', (data, socket) => {
        server.ws.clients.forEach((client) => {
          if (client !== socket) {
            client.send('vite-r3f-touch-controller', data);
          }
        });
      });
    }
  };
}
