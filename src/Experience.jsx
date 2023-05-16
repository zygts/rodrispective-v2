import Cube from "./Cube.jsx";
import LightingAndGround from "./LightingAndGround.jsx";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import { useState, useEffect, useRef } from "react";

export default function Experience() {
  const { camera } = useThree();
  const positionRef = useRef(new Vector3(0, 5, 0));
  const rotationRef = useRef(new Quaternion().setFromEuler(new Euler(-0.5, 0, 0, "XYZ")));
  const targetRef = useRef(new Vector3(0, 0, 10));
  const initialCameraRotation = new Quaternion().setFromEuler(
    new Euler(-0.5, 0, 0, "XYZ")
  );
  const [target, setTarget] = useState(new Vector3(0, 0, 10));

  const radius = 10;
  const numCubes = 15;
  const cameraHeight = 2;
  const cameraZoom = 0.7;
  const cube1Position = new Vector3(
    radius * Math.cos((1 / numCubes) * 2 * Math.PI),
    0,
    radius * Math.sin((1 / numCubes) * 2 * Math.PI)
  );

  useEffect(() => {
    camera.position.set(0, cameraHeight, 0);
    camera.lookAt(cube1Position);
    positionRef.current.copy(camera.position); // make positionRef.current match the initial camera position
    setTarget(cube1Position);
  }, []);

  const lastClickedCube = useRef(null);
  const isCameraAtInitialPosition = useRef(true);

  const [active, setActive] = useState(false);

  const handleCubeClick = (index) => {
    const angle = (index / 15) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const cubePosition = new Vector3(x, 0, z);

    setActive(index);

    if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
      // Clicked on the same cube and the camera is not at its initial position, move the camera back
      positionRef.current.set(0, cameraHeight, 0);
      rotationRef.current.copy(initialCameraRotation);
      setTarget(cube1Position);
      isCameraAtInitialPosition.current = true;
    } else {
      // Clicked on a different cube or the camera is at its initial position, move the camera forward
      positionRef.current = camera.position.clone().lerp(cubePosition, cameraZoom);
      setTarget(cubePosition);
      lastClickedCube.current = index;
      isCameraAtInitialPosition.current = false;
    }
  };

  // Update the camera's position and orientation on each frame
  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, 0.05);
      camera.position.lerp(positionRef.current, 0.05);
      camera.lookAt(targetRef.current);
    }
  });

  return (
    <>
      <LightingAndGround />
      {Array.from({ length: 15 }, (_, index) => (
        <Cube
          key={index}
          index={index}
          radius={radius}
          isActive={index === active}
          onClick={() => handleCubeClick(index)}
        />
      ))}
    </>
  );
}
