import styles from './TouchController.module.css';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react"
import { Mesh, Object3D, ObjectLoader } from "three";
import { raycastAtCoordinate } from "./utils";
import Gyroscope from "./Gyroscope/Gyroscope";
import { createPortal } from "react-dom";
import { Html } from "@react-three/drei";

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
  const controllerSphereRef = useRef<Mesh>(null);

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

      import.meta.hot?.send?.('vite-r3f-touch-controller', {
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

    import.meta.hot?.on('vite-r3f-touch-controller', (message) => {
      if (message.type !== 'click' || !message.data || !controllerSphereRef.current) {
        return;
      }

      controllerSphereRef.current.userData.hasTouched = false;
  
      const { data } = message;
      const loader = new ObjectLoader();
      const mesh = loader.parse(data);

      controllerSphereRef.current?.position.set(...mesh.position.toArray());
      controllerSphereRef.current?.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
      controllerSphereRef.current?.scale.set(...mesh.scale.toArray());
      setActiveMesh(mesh);
    })
  }, [isController]);

  // Handle communicating controller updates to client
  useFrame(() => {
    if (!isController || !activeMesh || !controllerSphereRef.current || !controllerSphereRef.current.userData.hasTouched) {
      return;
    }
    
    const { position, rotation, scale } = controllerSphereRef.current;

    import.meta.hot?.send?.('vite-r3f-touch-controller', {
      type: 'update',
      data: {
        uuid: activeMesh.uuid,
        position: position.toArray(),
        rotation: rotation.toArray(),
        scale: scale.toArray(),
      }
    });
  });

  // Handle updating element on screen after controller updates
  useEffect(() => {
    if (isController) {
      return;
    }

    import.meta.hot?.on('vite-r3f-touch-controller', (message) => {
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

  const dom = (
    <div className={styles.frame}>
      <Canvas scene={{
        name: 'controller',
      }}>
        <Gyroscope activeMesh={activeMesh} controllerSphereRef={controllerSphereRef} />;
      </Canvas>
    </div>
  )

  return <Html>{createPortal(dom, document.body)}</Html>;
  
}

export default TouchController;