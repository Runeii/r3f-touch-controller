import { useGesture } from "@use-gesture/react";
import { DoubleSide, Mesh, Object3D } from "three";
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';

type GyroscopeProps = {
  activeMesh?: Object3D;
  controllerSphereRef: MutableRefObject<Mesh | null>;
};

const Gyroscope = ({ activeMesh, controllerSphereRef }: GyroscopeProps) => {
  const meshRef = useRef<Mesh>(null);

  const maxTouchesSoFar = useRef(0);
  const bind = useGesture(
    {
      onDrag: ({cancel, canceled, last, movement: [mx, my], offset: [x, y], touches }) => {
        if (!controllerSphereRef.current || canceled || last) {
          maxTouchesSoFar.current = 0;
          return;
        }
        if (touches < maxTouchesSoFar.current) {
          cancel();
          return;
        }
        maxTouchesSoFar.current = Math.min(touches, 2);
        controllerSphereRef.current.userData.hasTouched = true;
        if (touches === 1) {
          // Single finger drag: Rotate the sphere
          controllerSphereRef.current.rotation.z = x / 100;
          controllerSphereRef.current.rotation.y = -y / 100;
        } else if (touches === 3) {
          // Three finger drag: Move the sphere
          controllerSphereRef.current.position.x += mx / 1000;
          controllerSphereRef.current.position.y -= my / 1000;
        } 
      },
      onPinch: ({offset: [scale]}) => {
        if (!controllerSphereRef.current) {
          return;
        }
        controllerSphereRef.current.userData.hasTouched = true;
        controllerSphereRef.current.scale.setScalar(scale);
      }
    },
    {
      drag: {
        filterTaps: true
      },
      pinch: { rubberband: true }
    }
  );

  useFrame(() => {
    if (!meshRef.current || !controllerSphereRef.current) {
      return;
    }
    meshRef.current.position.set(...controllerSphereRef.current.position.toArray());
    meshRef.current.rotation.set(controllerSphereRef.current.rotation.x, controllerSphereRef.current.rotation.y, controllerSphereRef.current.rotation.z);
    meshRef.current.scale.set(...controllerSphereRef.current.scale.toArray());
  })

  useFrame(({ camera }) => {
    if (!controllerSphereRef.current) {
      return;
    }

    const { position, scale } = controllerSphereRef.current;

    camera.position.set(position.x, position.y, (position.z + 6) * scale.z);
  })

  return (
    <>
      <ambientLight intensity={1} />
      { /* @ts-expect-error - Clash between animated and useGesture */}
      <mesh 
        position={controllerSphereRef.current?.position}
        //rotation={controllerSphereRef.current?.rotation}
        scale={controllerSphereRef.current?.scale}
        ref={controllerSphereRef}
        {...bind()}
      >
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial color="transparent" transparent opacity={0} />
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
          <meshStandardMaterial color="red" side={DoubleSide} />
        </mesh>
      </mesh>
      {activeMesh && (
        <primitive
          object={activeMesh}
          ref={meshRef}
        />
      )}
    </>
  );
}

export default Gyroscope;