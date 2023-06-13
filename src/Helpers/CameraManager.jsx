import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { AppContext } from "../appContext";

export function CameraManager({ radius, numCubes, rotation, setRotation }) {
  const { activeCube, setActiveCube } = useContext(AppContext); // Usa los valores de contexto aquí
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
  const cameraHeight = 2.3;
  const cameraZoom = 0.55;
  const cameraSpeed = 0.04;
  const cube1Position = new Vector3(
    radius * Math.cos((1 / numCubes) * 2 * Math.PI),
    0,
    radius * Math.sin((1 / numCubes) * 2 * Math.PI)
  );
  const [isAnimationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    camera.position.set(0, cameraHeight, 0);
    camera.lookAt(cube1Position);
    positionRef.current.copy(camera.position);
    setTarget(cube1Position);
  }, []);

  // Función de click en el botón de volver
  const resetCamera = () => {
    positionRef.current.set(0, cameraHeight, 0);
    rotationRef.current.copy(initialCameraRotation);
    setTarget(cube1Position);
    isCameraAtInitialPosition.current = true;
  };

  // Función de click en cada elemento
  const handleCubeClickRef = useRef();
  handleCubeClickRef.current = useCallback(
    (index) => {
      if (activeCube !== null) {
        return;
      }
      const angle = (index / numCubes) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      let cubePosition = new Vector3(x, 0, z);
      cubePosition.applyAxisAngle(new Vector3(0, 1, 0), rotation);

      if (activeCube === index) {
        setActiveCube(null);
      } else {
        setActiveCube(index);
      }

      if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
        resetCamera();
      } else {
        positionRef.current = camera.position.clone().lerp(cubePosition, cameraZoom);
        // Ajusta la posición de la cámara a la izquierda y abajo después de hacer lerp
        positionRef.current.x += 0.7;
        positionRef.current.y -= 1;
        setTarget(cubePosition);
        lastClickedCube.current = index;
        isCameraAtInitialPosition.current = false;
      }
    },
    [activeCube, setActiveCube, rotation]
  );

  // Se acerca al elemento activo
  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, cameraSpeed);
      camera.position.lerp(positionRef.current, cameraSpeed);
      camera.lookAt(targetRef.current);

      // Comprueba si la animación ha terminado
      if (camera.position.distanceTo(positionRef.current) < cameraSpeed) {
        setAnimationFinished(true);
      } else {
        setAnimationFinished(false);
      }
    }
  });

  // Gira el círculo cuando el usuario hace scroll
  const handleScroll = (e) => {
    if (activeCube !== null) {
      return; // No hacer nada si un cubo está activo
    }
    setRotation(rotation + e.deltaY * 0.001);
  };

  useEffect(() => {
    // Añade el evento de scroll si ningún cubo está activo
    if (activeCube === null) {
      window.addEventListener("wheel", handleScroll);
    } else {
      window.removeEventListener("wheel", handleScroll);
    }
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [rotation, activeCube]); // Actualiza el listener cuando cambia rotation o active

  return {
    handleCubeClick: handleCubeClickRef.current,
    isAnimationFinished,
    resetCamera,
  };
}
