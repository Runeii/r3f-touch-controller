import { useGesture } from "@use-gesture/react";
import { DoubleSide, Object3D, Quaternion, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

type GyroscopeProps = {
  activeMesh?: Object3D;
};

const ROTATION_QUATERNION = new Quaternion();
const ROTATION_VECTOR = new Vector3();

const Gyroscope = ({ activeMesh }: GyroscopeProps) => {
  const bind = useGesture(
    {
      onPinch: ({ delta: [_, angle]}) => {
        if (!activeMesh) {
          return;
        }
        const sign = Math.sign(angle);
        if (sign === 0) {
          return;
        }
        ROTATION_VECTOR.y = sign;
        ROTATION_QUATERNION.setFromAxisAngle(ROTATION_VECTOR, degToRad(angle * -sign));
        activeMesh.quaternion.multiply(ROTATION_QUATERNION);
      },
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