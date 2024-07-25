import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject, useMemo } from "react"
import { Mesh, Object3D  } from "three";
import { getMeshRotationRelativeToCamera } from "../utils";
import Gyroscope from "./Gyroscope/Gyroscope";
import { ModifiedOrbitControls } from "./ModifiedOrbitControls/ModifiedOrbitControls";

type ControllerWorldProps = {
  activeMesh?: Object3D;
  controllerSphereRef: MutableRefObject<Mesh | null>;
};


const ControllerWorld = ({ activeMesh }: ControllerWorldProps) => {
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

  // Handle communicating controller updates to client
  useFrame(({ camera }) => {
    if (!activeMesh ) {
      return;
    }
    
//console.log(controlsRef)
    const rotation = getMeshRotationRelativeToCamera(camera, activeMesh);

    import.meta.hot?.send?.('vite-r3f-touch-controller', {
      type: 'update',
      data: {
        uuid: activeMesh.uuid,
      //  position: position.toArray(),
        rotation: rotation.toArray(),
      //  scale: scale.toArray(),
      }
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