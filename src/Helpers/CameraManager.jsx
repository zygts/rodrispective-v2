import { useThree, useFrame } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { AppContext } from "../appContext";

export function CameraManager({ radius, numCubes, rotation, setRotation }) {
  const { camera } = useThree();
  const { activeCube, setActiveCube } = useContext(AppContext);
  const touchStartX = useRef(null);
  const isDragging = useRef(false);

  const cameraHeight = 5;
  const cameraZoom = 0.5;

  const initialRotation = useMemo(
    () => new Quaternion().setFromEuler(new Euler(-0.5, 0, 0, "XYZ")),
    []
  );

  const cube1Position = useMemo(() => {
    const angle = (1 / numCubes) * 2 * Math.PI;
    return new Vector3(
      radius * Math.cos(angle),
      0,
      radius * Math.sin(angle)
    );
  }, [radius, numCubes]);

  const positionRef = useRef(new Vector3(0, cameraHeight, 0));
  const targetRef = useRef(new Vector3(0, 0, 10));
  const rotationRef = useRef(initialRotation.clone());
  const animationStartTime = useRef(null);
  const lastClickedCube = useRef(null);
  const isCameraAtInitialPosition = useRef(true);

  const [cameraSpeed, setCameraSpeed] = useState(0.009);
  const [target, setTarget] = useState(new Vector3(0, 0, -10));
  const [startAnimation, setStartAnimation] = useState(false);
  const [isAnimationFinished, setAnimationFinished] = useState(false);
  const [shaderReady, setShaderReady] = useState(false);

  // 🎬 Shader animation complete trigger
  useEffect(() => {
    const onShaderDone = () => {
      setShaderReady(true);
      setStartAnimation(true);
      animationStartTime.current = Date.now();
    };

    window.addEventListener("shaderAnimationComplete", onShaderDone);
    return () => window.removeEventListener("shaderAnimationComplete", onShaderDone);
  }, []);

  // 🎥 Position camera when shader is ready
  useEffect(() => {
    if (shaderReady) {
      camera.position.set(0, cameraHeight, 0);
      camera.lookAt(cube1Position);
      positionRef.current.copy(camera.position);
      setTarget(cube1Position);
    }
  }, [shaderReady, cube1Position, camera]);

  // 🔁 Main animation loop
  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, cameraSpeed);
      camera.position.lerp(positionRef.current, cameraSpeed);
      camera.lookAt(targetRef.current);

      setAnimationFinished(
        camera.position.distanceTo(positionRef.current) < cameraSpeed
      );
    }

    if (startAnimation) {
      const duration = 5000;
      const elapsed = Date.now() - animationStartTime.current;
      let t = Math.min(elapsed / duration, 1);
      t = 1 - Math.pow(1 - t, 3); // easeOutCubic

      const from = new Vector3(0, cameraHeight + 25, 0);
      const to = new Vector3(0, cameraHeight, 0);

      camera.position.lerpVectors(from, to, t);
      camera.lookAt(targetRef.current);

      if (t >= 1) setStartAnimation(false);
    }
  });

  // 🔁 Cube click handler
  const handleCubeClick = useCallback(
    (index) => {
      if (activeCube !== null) return;

      setCameraSpeed(0.035);

      const angle = (index / numCubes) * 2 * Math.PI;
      const cubePos = new Vector3(
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      ).applyAxisAngle(new Vector3(0, 1, 0), rotation);

      if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
        resetCamera();
      } else {
        const newPos = camera.position.clone().lerp(cubePos, cameraZoom);
        newPos.x += 0.7;
        newPos.y -= 2.5;

        positionRef.current.copy(newPos);
        setTarget(cubePos);
        lastClickedCube.current = index;
        isCameraAtInitialPosition.current = false;
      }

      setActiveCube(index);
    },
    [activeCube, numCubes, radius, rotation, camera, setActiveCube]
  );

  // 🔁 Scroll rotation handler
  const handleScroll = useCallback(
    (e) => {
      if (activeCube === null) {
        setRotation((prev) => prev + e.deltaY * 0.001);
      }
    },
    [activeCube, setRotation]
  );

  useEffect(() => {
  const handleTouchStart = (e) => {
    if (activeCube !== null || e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || activeCube !== null) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;
    touchStartX.current = currentX;

    // Convierte movimiento horizontal en rotación
    setRotation((prev) => prev - deltaX * 0.005);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  window.addEventListener("touchstart", handleTouchStart, { passive: true });
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("touchend", handleTouchEnd);

  return () => {
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };
}, [activeCube, setRotation]);


  useEffect(() => {
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [handleScroll]);

  // 🔁 Reset camera to initial state
  const resetCamera = useCallback(() => {
    positionRef.current.set(0, cameraHeight, 0);
    rotationRef.current.copy(initialRotation);
    setTarget(cube1Position);
    isCameraAtInitialPosition.current = true;
  }, [cube1Position, initialRotation]);

  return {
    handleCubeClick,
    isAnimationFinished,
    resetCamera,
  };
}
