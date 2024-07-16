import { Camera, Object3D, Raycaster, Scene, Vector2 } from "three";

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