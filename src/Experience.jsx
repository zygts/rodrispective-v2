import { useState } from "react";
import CubeGroup from "./CubeGroup.jsx";
import LightingAndGround from "./Helpers/LightingAndGround.jsx";
import { CameraManager } from "./Helpers/CameraManager.jsx";

export default function Experience() {
  const radius = 5;
  const numCubes = 15;
  const [active, setActive] = useState(null);
  const [rotation, setRotation] = useState(0);

  const { isAnimationFinished, handleCubeClick } = CameraManager({
    active,
    setActive,
    radius,
    numCubes,
    rotation,
    setRotation,
  });

  return (
    <>
      <LightingAndGround />
      <group rotation={[0, rotation, 0]}>
        <CubeGroup
          setActive={setActive}
          active={active}
          radius={radius}
          handleCubeClick={handleCubeClick}
          isAnimationFinished={isAnimationFinished}
        />
      </group>
    </>
  );
}
