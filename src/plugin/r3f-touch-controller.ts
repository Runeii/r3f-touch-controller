import { Plugin } from 'vite';

export default function r3FTouchController(): Plugin {
  return {
    name: 'threejs-touch-controller',
    configureServer: async (server) => {
      server.ws.on('r3f-touch-controller', (data, socket) => {
        server.ws.clients.forEach((client) => {
          if (client !== socket) {
            client.send('r3f-touch-controller', data);
          }
        });
      });
    }
  };
}
