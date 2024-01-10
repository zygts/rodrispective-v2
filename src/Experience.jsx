import "./styles/experience.css";

import { useState, useContext, useEffect } from "react";

import CubeGroup from "./SongCollection.jsx";
import { CameraManager } from "./Helpers/CameraManager.jsx";
import { AppContext } from "./appContext.jsx";

export default function Experience({ onLoaded }) {
  const radius = 7;
  const numCubes = 25;
  const { activeCube, setActiveCube } = useContext(AppContext);
  const [rotation, setRotation] = useState(0);

  const { isAnimationFinished, handleCubeClick, resetCamera } = CameraManager({
    radius,
    numCubes,
    rotation,
    setRotation,
  });

  useEffect(() => {
    // Aquí debes determinar cuándo todos los recursos están cargados.
    // Esto podría ser después de cargar modelos, texturas, etc.
    // Por ejemplo, si CubeGroup carga recursos, deberías esperar hasta que esos recursos estén listos.
    // Supongamos que CubeGroup notifica cuando está listo:

    const handleResourcesLoaded = () => {
      onLoaded(); // Llama a esta función una vez que todos los recursos estén cargados
    };

    // Debes tener una forma de recibir esta notificación desde CubeGroup u otros subcomponentes
    // Esto podría ser a través de un evento, una promesa, un callback, etc.

    // Suponiendo que usamos un evento para este ejemplo
    window.addEventListener("resourcesLoaded", handleResourcesLoaded);

    // Limpieza
    return () => {
      window.removeEventListener("resourcesLoaded", handleResourcesLoaded);
    };
  }, [onLoaded]);

  return (
    <>
      <group rotation={[0, rotation, 0]}>
        <CubeGroup
          setActiveCube={setActiveCube}
          activeCube={activeCube}
          radius={radius}
          handleCubeClick={handleCubeClick}
          isAnimationFinished={isAnimationFinished}
          resetCamera={resetCamera}
        />
      </group>
    </>
  );
}
