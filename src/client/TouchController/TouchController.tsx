import { useSpring } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useState } from "react"
import { Object3D, ObjectLoader } from "three";
import { raycastAtCoordinate } from "./utils";
import ControllerUI from "./ControllerUI/ControllerUI";

let isControllerDefault = false;

if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  isControllerDefault = urlParams.has('isController');
}

type TouchControllerProps = {
  isController?: boolean;
}

const TouchController = ({ isController = isControllerDefault }: TouchControllerProps) => {
  const {scene, camera } = useThree();

  const [activeMesh, setActiveMesh] = useState<Object3D>();

  const [spring, api] = useSpring(() => ({
    position: activeMesh?.position.toArray() ?? [0, 0, 0],
    rotation: (activeMesh?.rotation.toArray()?.slice(0, -1) as number[]) ?? [0, 0, 0],
    scale: activeMesh?.scale.toArray() ?? [0, 0, 0],
    immediate: true,
  }), [activeMesh]);

  // Handle selecting element on client screen
  useEffect(() => {
    if (isController) {
      return;
    }

    window.addEventListener('click', ({ clientX, clientY}) => {
      const mesh = raycastAtCoordinate(clientX, clientY, camera, scene);
      if (activeMesh?.uuid === mesh?.uuid) {
        return;
      }

      setActiveMesh(mesh);

      import.meta.hot?.send?.('vite-plugin-threejs-touch-controller', {
        type: 'click',
        data: mesh,
      });
    });
  }, [activeMesh, camera, isController, scene]);

  // Handle setting up controller to display selected element
  useEffect(() => {
    if (!isController) {
      return;
    }

    import.meta.hot?.on('vite-plugin-threejs-touch-controller', (message) => {
      if (message.type !== 'click' || !message.data) {
        return;
      }
      const { data } = message;
      const loader = new ObjectLoader();
      const mesh = loader.parse(data);
      setActiveMesh(mesh);
    })
  }, [isController]);

  // Handle communicating controller updates to client
  useFrame(() => {
    if (!isController || !activeMesh) {
      return;
    }
    
    const { position, rotation, scale } = spring;

    import.meta.hot?.send?.('vite-plugin-threejs-touch-controller', {
      type: 'update',
      data: {
        uuid: activeMesh.uuid,
        position: position.get(),
        rotation: rotation.get(),
        scale: scale.get(),
      }
    });
  });

  // Handle updating element on screen after controller updates
  useEffect(() => {
    if (isController) {
      return;
    }

    import.meta.hot?.on('vite-plugin-threejs-touch-controller', (message) => {
      if (message.type !== 'update' || !activeMesh) {
        return;
      }
      const { uuid, position, rotation, scale } = message.data;
      if (uuid !== activeMesh.uuid) {
        return;
      }
      activeMesh.position.set(position[0], position[1], position[2]);
      activeMesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      activeMesh.scale.set(scale[0], scale[1], scale[2]);
    })
  }, [activeMesh, isController]);

  if (!isController) {
    return null;
  }

  return <ControllerUI activeMesh={activeMesh} api={api} spring={spring} />;
}

export default TouchController;