import MyCameraHelper from "./CameraHelper.jsx";

import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Quaternion, Euler } from "three";
import { useState, useEffect, useRef } from "react";

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

  const cubes = Array(15)
    .fill()
    .map((_, index) => {
      const angle = (index / 15) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      return {
        position: new Vector3(x, 0, z),
        onClick: () => {
          if (lastClickedCube.current === index && !isCameraAtInitialPosition.current) {
            // Clicked on the same cube and the camera is not at its initial position, move the camera back
            positionRef.current.set(0, cameraHeight, 0);
            rotationRef.current.copy(initialCameraRotation);
            setTarget(cube1Position);
            isCameraAtInitialPosition.current = true;
          } else {
            // Clicked on a different cube or the camera is at its initial position, move the camera forward
            positionRef.current = camera.position
              .clone()
              .lerp(cubes[index].position, cameraZoom);
            setTarget(cubes[index].position);
            lastClickedCube.current = index;
            isCameraAtInitialPosition.current = false;
          }
        },
      };
    });

  // Update the camera's position and orientation on each frame
  useFrame(() => {
    if (target) {
      targetRef.current.lerp(target, 0.05);
      camera.position.lerp(positionRef.current, 0.05);
      camera.lookAt(targetRef.current);
    }
  });

  const [hovered, setHover] = useState(null);
  const [active, setActive] = useState(null);

  return (
    <>
      <MyCameraHelper />
      <ambientLight intensity={0.5} />
      <spotLight position={[19, 15, 29]} angle={0.7} penumbra={1} castShadow />
      {cubes.map((props, index) => (
        <mesh
          key={index}
          {...props}
          castShadow
          scale={active === index ? 1.5 : 1}
          onPointerOver={(event) => setHover(index)}
          onPointerOut={(event) => setHover(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={hovered === index ? "hotpink" : "orange"} />
        </mesh>
      ))}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"gray"} />
      </mesh>
    </>
  );
}
