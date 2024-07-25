import { useFrame, useThree } from "@react-three/fiber";
import { Dispatch, SetStateAction, useMemo } from "react"
import { Object3D  } from "three";
import { getMeshRotationRelativeToCamera, updateCameraPosition } from "../utils";
import Gyroscope from "./Gyroscope/Gyroscope";
import { ModifiedOrbitControls } from "./ModifiedOrbitControls/ModifiedOrbitControls";
import type { Details } from "../TouchController";

type ControllerWorldProps = {
  activeMesh?: Object3D;
  setDetails: Dispatch<SetStateAction<Details | undefined>>
};


const ControllerWorld = ({ activeMesh, setDetails }: ControllerWorldProps) => {
  const camera = useThree(state => state.camera);

  const domElement = useThree(state => state.gl.domElement);

  const controlsInstance = useMemo(() => {
    const controls = new ModifiedOrbitControls(camera, domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    return controls;
  }, [camera, domElement]);

  useFrame(({ camera }) => {
    if (!activeMesh) {
      return;
    } 

     updateCameraPosition(activeMesh, camera, controlsInstance);
  });

  // Handle communicating controller updates to client
  useFrame(({ camera }) => {
    if (!activeMesh ) {
      return;
    }

    const { position, scale } = activeMesh;
    const rotation = getMeshRotationRelativeToCamera(camera, activeMesh);

    const details: Details = {
      uuid: activeMesh.uuid,
      name: activeMesh.name,
      position: position.toArray(),
      rotation: rotation.toArray().slice(0, 3) as [number, number, number],
      scale: scale.toArray(),
    }

    import.meta.hot?.send?.('r3f-touch-controller', {
      type: 'update',
      data: details
    });

    setDetails((currentDetails: Details | undefined) => {
      if (JSON.stringify(currentDetails) === JSON.stringify(details)) {
        return currentDetails;
      }
      return details;
    });
  });

  return (
    <>
      <primitive object={controlsInstance} />
      <Gyroscope activeMesh={activeMesh}  />
    </>
  );
}

export default ControllerWorld;