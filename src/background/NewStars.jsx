import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const Stars = ({ starCount = 45000 }) => {
  const starsRef = useRef();
  const { scene, camera } = useThree();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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
      size: 0.25,
      transparent: true,
      opacity: 0.6,
    });
  }, []);

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x000000, 0.001);
  }, [scene]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMouse({
        x: ((event.clientX / window.innerWidth) * 2 - 1) * 0.2,
        y: (-(event.clientY / window.innerHeight) * 2 + 1) * 0.2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += 0.00025;
      starsRef.current.rotation.y += 0.00025;
    }

    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
  });

  return <points ref={starsRef} args={[starsGeometry, starsMaterial]} />;
};

export default Stars;
