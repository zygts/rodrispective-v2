import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Stars = ({ starCount = 45000 }) => {
  const starsRef = useRef();
  const { scene, camera } = useThree();

  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = Math.random() * 2000 - 1000;
      positions[i * 3 + 1] = Math.random() * 2000 - 1000;
      positions[i * 3 + 2] = Math.random() * 2000 - 1000;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [starCount]);

  const starsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.2,
      transparent: true,
      opacity: 0.5,
    });
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.0005;
      starsRef.current.rotation.y += 0.0005;
    }
  });

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x000000, 0.0003);
  }, [scene]);

  return <points ref={starsRef} args={[starsGeometry, starsMaterial]} />;
};

export default Stars;
