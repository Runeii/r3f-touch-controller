import { useThree } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { DoubleSide, Object3D } from "three";
import { handleCircularRotation, handleMoveMesh, handleScaleMesh } from "./utils";

type GyroscopeProps = {
  activeMesh?: Object3D;
};

const Gyroscope = ({ activeMesh }: GyroscopeProps) => {
  const camera = useThree(state => state.camera);
  const bind = useGesture(
    {
      onDrag: (state) => {
        if (!activeMesh) {
          return;
        }

        if (state.touches === 3) {
          handleMoveMesh(activeMesh, camera, state);
        }
      },
      onPinch: state => {
        if (!activeMesh) {
          return;
        }

        if (state.touches === 2) {
          handleCircularRotation(activeMesh, camera, state);
          handleScaleMesh(activeMesh, state);
        }
      }
    },
    {
      drag: {
        filterTaps: true
      },
      pinch: {
        rubberband: true,
      }
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