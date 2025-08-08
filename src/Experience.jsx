import "./styles/experience.css";

import { useState, useContext, useEffect, useMemo } from "react";

import CubeGroup from "./SongCollection.jsx";
import { CameraManager } from "./Helpers/CameraManager.jsx";
import { AppContext } from "./appContext.jsx";

export default function Experience({ onLoaded }) {
  const radius = 7;
  const numCubes = 25;
  const { activeCube, setActiveCube } = useContext(AppContext);
  const [rotation, setRotation] = useState(0);

  // Optimización: Memoizar propiedades del camera manager
  const cameraManagerProps = useMemo(() => ({
    radius,
    numCubes,
    rotation,
    setRotation,
  }), [radius, numCubes, rotation]);

  const { isAnimationFinished, handleCubeClick, resetCamera } = CameraManager(cameraManagerProps);

  useEffect(() => {
    const handleResourcesLoaded = () => {
      console.log("Resources loaded event received"); // Para debug
      onLoaded();
    };
    
    // Escuchar ambos eventos para mayor compatibilidad
    window.addEventListener("resourcesLoaded", handleResourcesLoaded);
    window.addEventListener("allTexturesReady", handleResourcesLoaded);
    
    return () => {
      window.removeEventListener("resourcesLoaded", handleResourcesLoaded);
      window.removeEventListener("allTexturesReady", handleResourcesLoaded);
    };
  }, [onLoaded]);

  // Optimización: Memoizar grupo para evitar re-renders innecesarios
  const cubeGroup = useMemo(() => (
    <CubeGroup
      setActiveCube={setActiveCube}
      activeCube={activeCube}
      radius={radius}
      handleCubeClick={handleCubeClick}
      isAnimationFinished={isAnimationFinished}
      resetCamera={resetCamera}
    />
  ), [activeCube, handleCubeClick, isAnimationFinished, resetCamera, setActiveCube]);

  return (
    <group rotation={[0, rotation, 0]}>
      {cubeGroup}
    </group>
  );
}
