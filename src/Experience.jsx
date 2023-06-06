import { useState, useContext } from "react";
import CubeGroup from "./CubeGroup.jsx";
import LightingAndGround from "./Helpers/LightingAndGround.jsx";
import { CameraManager } from "./Helpers/CameraManager.jsx";
import { CursorContext } from "./cursorContext";
import Stars from "./Stars";

export default function Experience() {
  const radius = 5;
  const numCubes = 15;
  const { activeCube, setActiveCube } = useContext(CursorContext);
  const [rotation, setRotation] = useState(0);

  const { isAnimationFinished, handleCubeClick, resetCamera } = CameraManager({
    radius,
    numCubes,
    rotation,
    setRotation,
  });

  return (
    <>
      <LightingAndGround />
      <Stars />
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
