import { Camera, Euler, Mesh, Object3D, Quaternion, Raycaster, Scene, Vector2 } from "three";

export const raycastAtCoordinate = (x: number, y: number, camera: Camera, scene: Scene) => {
  const raycaster = new Raycaster();
  const mouse = new Vector2();

  // Normalize mouse coordinates to range [-1, 1]
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length === 0) {
    return;
  }

  return intersects[0].object as Object3D;
}


export const getSphereRotationFromControls = (camera: Camera, sphere: Mesh) => {
  const cameraQuaternion = camera.quaternion.clone();

  const sphereQuaternion = sphere.quaternion.clone();
  const relativeQuaternion = cameraQuaternion.multiply(sphereQuaternion.invert());

  const relativeEuler = new Euler().setFromQuaternion(relativeQuaternion);

  return relativeEuler;
}

export const getMeshRotationRelativeToCamera = (camera: Camera, mesh: Object3D) => {
  // Create a quaternion to represent the camera's orientation
  const cameraQuaternion = new Quaternion();
  camera.getWorldQuaternion(cameraQuaternion);

  // Create a quaternion to represent the mesh's orientation
  const meshQuaternion = new Quaternion();
  mesh.getWorldQuaternion(meshQuaternion);

  // Calculate the inverse of the camera's orientation
  const cameraQuaternionInverse = cameraQuaternion.clone().invert();

  // Rotate the mesh quaternion by the inverse of the camera quaternion
  const relativeQuaternion = cameraQuaternionInverse.multiply(meshQuaternion);

  // Convert the resulting quaternion to Euler angles
  const relativeEuler = new Euler().setFromQuaternion(relativeQuaternion, 'XYZ');

  return relativeEuler;
}
