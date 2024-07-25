import styles from './TouchController.module.css';
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react"
import { Object3D, ObjectLoader } from "three";
import {  raycastAtCoordinate } from "./utils";
import { Html } from "@react-three/drei";
import ControllerWorld from './ControllerWorld/ControllerWorld';
import { createPortal } from 'react-dom';

let isControllerDefault = false;

if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  isControllerDefault = urlParams.has('isController');
}

type TouchControllerProps = {
  isController?: boolean;
}

export type Details = {
  uuid: string;
  name?: string
  position: number[];
  rotation: number[];
  scale: number[];
}

const TouchController = ({ isController = isControllerDefault }: TouchControllerProps) => {
  const scene = useThree(state => state.scene);
  const camera = useThree(state => state.camera);

  const [activeMesh, setActiveMesh] = useState<Object3D>();

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

      import.meta.hot?.send?.('r3f-touch-controller', {
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

    import.meta.hot?.on('r3f-touch-controller', (message) => {
      if (message.type !== 'click' || !message.data) {
        return;
      }
  
      const { data } = message;
      const loader = new ObjectLoader();
      const mesh = loader.parse(data);

      setActiveMesh(mesh);
    })
  }, [isController]);

  // Handle updating element on screen after controller updates
  useEffect(() => {
    if (isController) {
      return;
    }

    import.meta.hot?.on('r3f-touch-controller', (message) => {
      if (message.type !== 'update' || !activeMesh) {
        return;
      }

      const { uuid, position, rotation, scale } = message.data as Details;
      if (uuid !== activeMesh.uuid) {
        return;
      }

      activeMesh.position.set(position[0], position[1], position[2]);
      activeMesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      activeMesh.scale.set(scale[0], scale[1], scale[2]);
    })
  }, [activeMesh, isController]);

  const [details, setDetails] = useState<Details>();

  if (!isController) {
    return null;
  }

  return (
    <Html>
      {createPortal((
        <div className={styles.frame}>
          <Canvas scene={{ name: 'controller' }}>
            <ControllerWorld activeMesh={activeMesh} setDetails={setDetails} />
          </Canvas>
          <div className={styles.details}>
            {(activeMesh && details) ? (
              <div>
                {details.name && <p>{details.name}</p>}
                <p>ID: {details.uuid}</p>
                <p>Position: {details.position.map((n) => n.toFixed(2)).join(', ')}</p>
                <p>Rotation: {details.rotation.map((n) => n.toFixed(2)).join(', ')}</p>
                <p>Scale: {details.scale.map((n) => n.toFixed(2)).join(', ')}</p>
              </div>
            ) : (
              <p>Select an object to view details</p> 
            )}
          </div>
        </div>
      ), document.body)}
    </Html>
  );
}

export default TouchController;