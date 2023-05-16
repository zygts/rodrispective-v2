import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { CameraHelper } from "three";

export default function MyCameraHelper() {
  const { camera } = useThree();
  const helper = useRef();

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "p") {
        console.log("Camera position:", camera.position);
        console.log("Camera rotation:", camera.rotation);
      }
    });

    helper.current = new CameraHelper(camera);
    camera.add(helper.current);

    return () => {
      camera.remove(helper.current);
    };
  }, [camera]);

  useFrame(() => helper.current && helper.current.update());

  return null;
}
