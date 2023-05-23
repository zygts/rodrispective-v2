import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import { useEffect, useRef, useState } from "react";

export function CameraManager({
  active,
  setActive,
  radius,
  numCubes,
  rotation,
  setRotation,
}) {
  const { camera } = useThree();
  const positionRef = useRef(new Vector3(0, 5, 0));
  const rotationRef = useRef(new Quaternion().setFromEuler(new Euler(-0.5, 0, 0, "XYZ")));
  const targetRef = useRef(new Vector3(0, 0, 10));
  const initialCameraRotation = new Quaternion().setFromEuler(
    new Euler(-0.5, 0, 0, "XYZ")
  );
  const [target, setTarget] = useState(new Vector3(0, 0, 10));
  const lastClickedCube = useRef(null);
  const isCameraAtInitialPosition = useRef(true);
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
    positionRef.current.copy(camera.position);
    setTarget(cube1Position);
  }, []);

  const handleCubeClick = (index) => {
    const angle = (index / numCubes) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    let cubePosition = new Vector3(x, 0, z);
    cubePosition.applyAxisAngle(new Vector3(0, 1, 0), rotation);

    if (active === index) {
      setActive(null);
    } else {
      setActive(index);
    }

    if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
      positionRef.current.set(0, cameraHeight, 0);
      rotationRef.current.copy(initialCameraRotation);
      setTarget(cube1Position);
      isCameraAtInitialPosition.current = true;
    } else {
      positionRef.current = camera.position.clone().lerp(cubePosition, cameraZoom);
      setTarget(cubePosition);
      lastClickedCube.current = index;
      isCameraAtInitialPosition.current = false;
    }
  };

  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, 0.05);
      camera.position.lerp(positionRef.current, 0.05);
      camera.lookAt(targetRef.current);
    }
  });

  // Gira el círculo cuando el usuario hace scroll
  const handleScroll = (e) => {
    if (active !== null) {
      return; // No hacer nada si un cubo está activo
    }
    setRotation(rotation + e.deltaY * 0.001);
  };

  useEffect(() => {
    // Añade el evento de scroll si ningún cubo está activo
    if (active === null) {
      window.addEventListener("wheel", handleScroll);
    } else {
      window.removeEventListener("wheel", handleScroll);
    }
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [rotation, active]); // Actualiza el listener cuando cambia rotation o active

  return { handleCubeClick };
}
