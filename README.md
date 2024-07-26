# React Three Fiber Touch Controller

https://github.com/user-attachments/assets/14cead5d-c0db-4156-8506-8e425baaf796


A Vite plugin allowing developers to remotely manipulate the position, shape and rotation of scene meshes using a remote touch screen device.

## Requirements
* A touch device – ideally an iPad
* A React Three Fiber scene
* A Vite project (recommended, but can be optional [see note below](#using-without-vite) )

## An important note
Please note, this is very much a demo and not designed for use in production projects. You're welcome to build on it, do what you wish with it, but I am not responsible for any meshes rotated, scaled or positioned.

## Installation
1. Add the touchControllerPlugin to your vite.config.ts file.

```
import { defineConfig } from 'vite';
import { touchControllerPlugin } from 'vite-r3f-touch-controller';

export default defineConfig({
  plugins: [
    touchControllerPlugin()
  ]
});
```

2. Add the TouchController component to your React Three Fiber tree:
```
import { TouchController } from 'vite-r3f-touch-controller';

const YourComponent = () => {
  return (
    <Canvas>
      <TouchController />
      {........}
  </Canvas>
}
```

## How to use
1. Open your scene in a browser. This device is the front end.
2. Point a touch device (tested on iPad) to your Vite server, append the URL with query string `?isController`. This device is the controller.
3. On the front end, click on any mesh to send it to the controller.
4. Manipulate the mesh in the controller and you will see it update in the scene in realtime.

## Gestures
*  One finger – rotate the mesh
*  Two fingers circular rotation (like twisting the volume knob on a hifi) – rotate the mesh in a circular motion
*  Two fingers pinch – scale the mesh up and down
*  Three fingers – move the mesh around the scene

## Using without Vite
The plugin takes advantage of Vite's HMR socket server to send messages between the two devices. But, in theory, Vite is not essential for this. To replace Vite:
* Add the Touch Controller component to your scene
* The dev server hosting the FE, which the controller is pointing to, should expose a socket server
* The server should listen for `r3f-touch-controller` events and communicate them to all clients on receipt

Currently this would require an adjustment to the component, which exclusively uses the `import.meta.hot` socket exposed by Vite. By replacing this with any other socket server, Vite should not be required.
