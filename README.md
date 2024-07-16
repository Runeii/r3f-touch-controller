# Vite + R3F Touch Controller

A Vite plugin allowing developers to remotely manipulate the position, shape and rotation of scene meshes using a remote touch screen device.

Readme to follow...

## Setup
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

3. Controller is now active
