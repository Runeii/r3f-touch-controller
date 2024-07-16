import { Html } from '@react-three/drei';
import styles from './ControllerUI.module.css';
import { animated, SpringRef, SpringValue } from "@react-spring/three";
import { useGesture } from "@use-gesture/react";
import { createPortal } from "react-dom";
import { Object3D } from "three";
import { Canvas } from '@react-three/fiber';
import React, { useRef, useState } from 'react';

type ControllerUIProps = {
  activeMesh?: Object3D;
  api: SpringRef<{
    position: number[],
    rotation: number[],
    scale: number[]
  }>;
  spring: {
    position: SpringValue<number[]>,
    rotation: SpringValue<number[]>,
    scale: SpringValue<number[]>
  }
};

const MODE = {
  ROTATION: 'ROTATION' ,
  POSITION: 'POSITION' ,
  SCALE: 'SCALE'
} as const;

const ControllerUI = ({ activeMesh, api, spring }: ControllerUIProps) => {
  const { position, rotation, scale } = spring;
  const [currentMode, setCurrentMode] = useState<keyof typeof MODE>('POSITION');

  const frameRef = useRef<HTMLDivElement>(null);
  useGesture({
    onClick: () => {

    },
    onDrag: ({ delta: [dx, dy]}) => {
      if (currentMode === 'POSITION') {
        const currentPosition = position.get();
        api.start({
          position: [currentPosition[0] + (dx / 10), currentPosition[1] - (dy / 10), currentPosition[2]]
        });
        return;
      }
      if (currentMode === 'ROTATION') {
        const currentRotation = scale.get();
        api.start({
          rotation: [currentRotation[0] + (dx / 100), currentRotation[1] + (dy / 100), currentRotation[2]]
        });
        return;
      }
    },
    onPinch: ({ offset: [d] }) => {
      if (currentMode === 'POSITION') {
        const currentPosition = position.get();
        api.start({
          position: [currentPosition[0], currentPosition[1], currentPosition[2] + d / 10]
        });
        return;
      }
      if (currentMode === 'SCALE') {
        const currentScale = scale.get();
        api.start({
          scale: [currentScale[0], currentScale[1], currentScale[2] + d / 100]
        });
        return;
      }
    },
    onWheel: ({ movement: [dy] }) => {
      if (currentMode !== 'ROTATION') {
        return;
      }

      const currentRotation = rotation.get();
      api.start({
        rotation: [currentRotation[0], currentRotation[1], currentRotation[2] + dy / 100]
      });
    },
  },
  { target: frameRef.current ?? document.body, eventOptions: { passive: false } }
  );

  const dom = (
    <div className={styles.frame} ref={frameRef}>
      <Canvas scene={{
        name: 'controller',
      }}>
        <ambientLight intensity={1} />
        {activeMesh && (
          // @ts-expect-error - Weird clash between animated and primitive
          <animated.primitive
            object={activeMesh}
            position={[0,0,0]}
            rotation={rotation}
            scale={scale}
            onPointerOver={(e: PointerEvent) => e.stopPropagation()}
            onPointerOut={(e: PointerEvent) => e.stopPropagation()}
          />
        )}
      </Canvas>
      <div className={styles.buttons}>
        {Object.values(MODE).map((mode) => (
          <button key={mode} className={mode === currentMode ? styles.isActive : ''} onClick={() => setCurrentMode(mode)}>{mode}</button>
        ))}
      </div>
    </div>
  )

  return <Html>{createPortal(dom, document.body)}</Html>;
}

export default ControllerUI;