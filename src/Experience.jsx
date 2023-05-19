import Cube from "./Cube.jsx";
import LightingAndGround from "./LightingAndGround.jsx";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Quaternion, Euler, TextureLoader } from "three";
import { useState, useEffect, useRef, useMemo } from "react";

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

  const [active, setActive] = useState(null);

  // Cuando haces click en el cubo
  const handleCubeClick = (index) => {
    const angle = (index / 15) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const cubePosition = new Vector3(x, 0, z);

    if (active === index) {
      // Si el cubo activo se vuelve a clicar, lo desactivamos
      setActive(null);
    } else {
      // Activamos el nuevo cubo
      setActive(index);
    }

    if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
      // Mueve la cámara hacia el cubo
      positionRef.current.set(0, cameraHeight, 0);
      rotationRef.current.copy(initialCameraRotation);
      setTarget(cube1Position);
      isCameraAtInitialPosition.current = true;
    } else {
      // Mueve la cámara a la posición inicial
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

  // Añade imágenes
  const texturePaths = [
    "./img/t1.jpg",
    "./img/t2.jpg",
    "./img/t3.jpg",
    "./img/t4.jpg",
    "./img/t5.jpg",
    "./img/t6.jpg",
    "./img/t7.jpg",
    "./img/t8.jpg",
    "./img/t9.jpg",
    "./img/t10.jpg",
    "./img/t11.jpg",
    "./img/t12.jpg",
    "./img/t13.jpg",
  ];

  const textures = useMemo(
    () => texturePaths.map((path) => new TextureLoader().load(path)),
    []
  );

  return (
    <>
      <LightingAndGround />
      {textures.map((texture, index) => (
        <Cube
          key={index}
          index={index}
          radius={radius}
          isActive={index === active}
          onClick={() => handleCubeClick(index)}
          texture={texture}
        />
      ))}
    </>
  );
}
