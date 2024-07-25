import { useGesture } from "@use-gesture/react";
import { DoubleSide, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { useFrame, useThree } from '@react-three/fiber';
import { act, MutableRefObject, useEffect, useRef } from 'react';
import { getMeshRotationRelativeToCamera } from "../../utils";
import { degToRad } from "three/src/math/MathUtils.js";

type GyroscopeProps = {
  activeMesh?: Object3D;
};

const Gyroscope = ({ activeMesh }: GyroscopeProps) => {
  const maxTouchesSoFar = useRef(0);
  const initialPinchRotation = useRef<number>(0);
  const camera = useThree(state => state.camera)
  const bind = useGesture(
    {
      onPinch: ({canceled, last, movement: [distance, angle]}) => {
        if (!activeMesh) {
          return;
        }
        return
        if (canceled || last) {
          initialPinchRotation.current = 0;
          return;
        }
        const meshRotation = getMeshRotationRelativeToCamera(camera, activeMesh);
        if (!initialPinchRotation.current) {
          initialPinchRotation.current = meshRotation.y;
        }

        // Normalize the vector to get the axis of rotation
        let rotationAxis = new Vector3(0, Math.sign(angle), 0); 

        // Create a quaternion for the rotation
        let quaternion = new Quaternion();
        quaternion.setFromAxisAngle(rotationAxis, degToRad(angle));
      //  console.log(degToRad(angle));
        // Apply the quaternion rotation to the mesh
       // activeMesh.quaternion.multiplyQuaternions(quaternion, activeMesh.quaternion);
      }
    },
    {
      drag: {
        filterTaps: true
      },
      pinch: { rubberband: true }
    }
  );

  return (
    <>
      <ambientLight intensity={1} />
      {activeMesh && (
        <primitive
          object={activeMesh}
          position={[0,0,0]}
          {...bind()}
        >
          <mesh>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial color="black" transparent opacity={0} />
            {/* Horizontal Band */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2, 0.01, 16, 100]} />
              <meshStandardMaterial color="blue" side={DoubleSide} />
            </mesh>
    
            {/* Vertical Band */}
            <mesh rotation={[0, 0, 0]}>
              <torusGeometry args={[2, 0.01, 16, 100]} />
              <meshStandardMaterial color="green" side={DoubleSide} />
            </mesh>
    
            {/* Tilted Band */}
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
              <torusGeometry args={[2, 0.01, 16, 100]} />
              <meshBasicMaterial color="red" side={DoubleSide} opacity={0.5} transparent/>
            </mesh>
    
            {/* Tilted Band */}
            <mesh rotation={[-Math.PI / 4, 0,-Math.PI / 4]}>
              <torusGeometry args={[2, 0.01, 16, 100]} />
              <meshBasicMaterial color="red" side={DoubleSide} opacity={0.9} transparent/>
            </mesh>
          </mesh>
        </primitive>
      )}
    </>
  );
}

export default Gyroscope;