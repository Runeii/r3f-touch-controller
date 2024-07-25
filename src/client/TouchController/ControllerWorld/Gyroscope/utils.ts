import { FullGestureState, } from "@use-gesture/react";
import { Camera, Matrix4, Object3D, Vector3 } from "three";

const CIRCULAR_PINCH_ROTATION_AXIS = new Vector3(0, 0, 1);
const CIRCULAR_PINCH_ROTATION_MATRIX = new Matrix4();

const ROTATION_PINCH_THRESHOLD = 0.1;
const SCALE_PINCH_THRESHOLD = 0.1;

export const handleScaleMesh = (activeMesh: Object3D, gestureState: FullGestureState<"pinch">) => {
  const { offset: [rawScale] } = gestureState;

  if (Math.abs(rawScale) < SCALE_PINCH_THRESHOLD) {
    return;
  }

  const scale = rawScale - SCALE_PINCH_THRESHOLD;
  activeMesh.scale.setScalar(scale);
}

export const handleCircularRotation = (activeMesh: Object3D, camera: Camera, gestureState: FullGestureState<"pinch">) => {
  const { delta: [_, rawAngle] } = gestureState;

  if (Math.abs(rawAngle) < ROTATION_PINCH_THRESHOLD) {
    return;
  }

  const angle = rawAngle - ROTATION_PINCH_THRESHOLD;

  const sign = Math.sign(angle);
  if (sign === 0) {
    return;
  }

  // Reset the axis
  CIRCULAR_PINCH_ROTATION_AXIS.set(0, 0, 1);
  CIRCULAR_PINCH_ROTATION_AXIS.applyQuaternion(camera.quaternion);

  const rotationMatrix = CIRCULAR_PINCH_ROTATION_MATRIX.makeRotationAxis(CIRCULAR_PINCH_ROTATION_AXIS, -(angle / 12));

  rotationMatrix.multiply(activeMesh.matrix);
  rotationMatrix.decompose(activeMesh.position, activeMesh.quaternion, activeMesh.scale);

  activeMesh.setRotationFromQuaternion(activeMesh.quaternion);

}

export const handleMoveMesh = (activeMesh: Object3D, camera: Camera, gestureState: FullGestureState<"drag">) => {
  const { delta: [xAxis, yAxis] } = gestureState;
  const cameraDirection = new Vector3();
  camera.getWorldDirection(cameraDirection);

  // Get the camera's right vector
  const cameraRight = new Vector3();
  cameraRight.crossVectors(camera.up, cameraDirection).normalize();

  // Get the camera's up vector
  const cameraUp = new Vector3();
  cameraUp.crossVectors(cameraDirection, cameraRight).normalize();

  // Calculate the movement vector
  const movementVector = new Vector3();
  movementVector.addScaledVector(cameraRight, -xAxis / 150);
  movementVector.addScaledVector(cameraUp, -yAxis / 150);

  activeMesh.position.add(movementVector);
}