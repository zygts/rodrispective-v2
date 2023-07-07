import { useState, useContext } from "react";
import CubeGroup from "./SongCollection.jsx";
import { CameraManager } from "./Helpers/CameraManager.jsx";
import { AppContext } from "./appContext.jsx";

export default function Experience() {
  const radius = 6;
  const numCubes = 25;
  const { activeCube, setActiveCube } = useContext(AppContext);
  const [rotation, setRotation] = useState(0);

  const { isAnimationFinished, handleCubeClick, resetCamera } = CameraManager({
    radius,
    numCubes,
    rotation,
    setRotation,
  });

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
