import { useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Vector3, TextureLoader } from "three";
import CubeGroup from "./CubeGroup.jsx";
import LightingAndGround from "./LightingAndGround.jsx";
import { CameraManager } from "./CameraManager";

export default function Experience() {
  const { camera } = useThree();
  const radius = 10;
  const numCubes = 15;
  const cameraHeight = 2;
  const [active, setActive] = useState(null);
  const [rotation, setRotation] = useState(0);

  const cube1Position = new Vector3(
    radius * Math.cos((1 / numCubes) * 2 * Math.PI),
    0,
    radius * Math.sin((1 / numCubes) * 2 * Math.PI)
  );

  const { handleCubeClick } = CameraManager({
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
        />
      </group>
    </>
  );
}
