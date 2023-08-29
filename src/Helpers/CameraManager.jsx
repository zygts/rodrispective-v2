import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import { useEffect, useRef, useState, useContext, useCallback } from "react";

import { AppContext } from "../appContext";

export function CameraManager({ radius, numCubes, rotation, setRotation }) {
  const { activeCube, setActiveCube } = useContext(AppContext);
  const { camera } = useThree();

  const [cameraSpeed, setCameraSpeed] = useState(0.009);
  const cameraHeight = 5;
  const cameraZoom = 0.5;
  const positionRef = useRef(new Vector3(0, cameraHeight, 0));
  const rotationRef = useRef(new Quaternion().setFromEuler(new Euler(-0.5, 0, 0, "XYZ")));
  const targetRef = useRef(new Vector3(0, 0, 10));
  const initialCameraRotation = new Quaternion().setFromEuler(
    new Euler(-0.5, 0, 0, "XYZ")
  );
  const [target, setTarget] = useState(new Vector3(0, 0, -10));
  const lastClickedCube = useRef(null);
  const isCameraAtInitialPosition = useRef(true);

  const cube1Position = new Vector3(
    radius * Math.cos((1 / numCubes) * 2 * Math.PI),
    0,
    radius * Math.sin((1 / numCubes) * 2 * Math.PI)
  );
  const [isAnimationFinished, setAnimationFinished] = useState(false);
  const [isShaderAnimationComplete, setShaderAnimationComplete] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const animationStartTime = useRef(null);

  useEffect(() => {
    const handleShaderAnimationComplete = () => {
      setShaderAnimationComplete(true);
      setStartAnimation(true);
      animationStartTime.current = Date.now();
    };

    window.addEventListener("shaderAnimationComplete", handleShaderAnimationComplete);

    return () => {
      window.removeEventListener(
        "shaderAnimationComplete",
        handleShaderAnimationComplete
      );
    };
  }, []);

  useEffect(() => {
    if (isShaderAnimationComplete) {
      camera.position.set(0, cameraHeight, 0);
      camera.lookAt(cube1Position);
      positionRef.current.copy(camera.position);
      setTarget(cube1Position);
    }
  }, [isShaderAnimationComplete]);

  const resetCamera = () => {
    positionRef.current.set(0, cameraHeight, 0);
    rotationRef.current.copy(initialCameraRotation);
    setTarget(cube1Position);
    isCameraAtInitialPosition.current = true;
  };

  const handleCubeClickRef = useRef();
  handleCubeClickRef.current = useCallback(
    (index) => {
      if (activeCube !== null) {
        return;
      }
      setCameraSpeed(0.035);

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
        positionRef.current.x += 0.7;
        positionRef.current.y -= 2.5;
        setTarget(cubePosition);
        lastClickedCube.current = index;
        isCameraAtInitialPosition.current = false;
      }
    },
    [activeCube, setActiveCube, rotation]
  );

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, cameraSpeed);
      camera.position.lerp(positionRef.current, cameraSpeed);
      camera.lookAt(targetRef.current);

      if (camera.position.distanceTo(positionRef.current) < cameraSpeed) {
        setAnimationFinished(true);
      } else {
        setAnimationFinished(false);
      }
    }

    if (startAnimation) {
      const currentTime = Date.now();
      const duration = 5000; // Duración en milisegundos
      let progress = (currentTime - animationStartTime.current) / duration;
      progress = easeOutCubic(progress);

      if (progress <= 1) {
        const initialPosition = new Vector3(0, cameraHeight + 25, 0);
        const finalPosition = new Vector3(0, cameraHeight, 0);

        camera.position.lerpVectors(initialPosition, finalPosition, progress);
        camera.lookAt(targetRef.current);
      } else {
        setStartAnimation(false);
      }
    }
  });

  const handleScroll = (e) => {
    if (activeCube !== null) {
      return;
    }
    setRotation(rotation + e.deltaY * 0.001);
  };

  useEffect(() => {
    if (activeCube === null) {
      window.addEventListener("wheel", handleScroll);
    } else {
      window.removeEventListener("wheel", handleScroll);
    }
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [rotation, activeCube]);

  return {
    handleCubeClick: handleCubeClickRef.current,
    isAnimationFinished,
    resetCamera,
  };
}
