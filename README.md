# React Three Fiber Touch Controller

A Vite plugin allowing developers to remotely manipulate the position, shape and rotation of scene meshes using a remote touch screen device.

## Requirements
* A touch device – ideally an iPad
* A Vite project
* A React Three Fiber scene

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
