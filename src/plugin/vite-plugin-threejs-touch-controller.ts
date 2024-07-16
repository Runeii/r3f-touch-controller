import { Plugin } from 'vite';

export default function threejsTouchController(): Plugin {
  return {
    name: 'threejs-touch-controller',
    configureServer: async (server) => {
      server.ws.on('vite-plugin-threejs-touch-controller', (data, socket) => {
        server.ws.clients.forEach((client) => {
          if (client !== socket) {
            client.send('vite-plugin-threejs-touch-controller', data);
          }
        });
      });
    }
  };
}
