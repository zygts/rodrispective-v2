import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import StarrySkyShader from "./StarrySkyShader";

const BackgroundStars = () => {
  const skyDomeRadius = 500.01;
  const meshRef = useRef();

  const sphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          skyRadius: { value: skyDomeRadius },
          env_c1: { value: new THREE.Color("#281C35") },
          env_c2: { value: new THREE.Color("#6D3A23") },
          noiseOffset: { value: new THREE.Vector3(1.01, 1.01, 1.01) },
          starSize: { value: 0.003 },
          starDensity: { value: 0.09 },
          clusterStrength: { value: 0.001 },
          clusterSize: { value: 0.1 },
        },
        vertexShader: StarrySkyShader.vertexShader,
        fragmentShader: StarrySkyShader.fragmentShader,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Agregar la rotación en cada fotograma
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[0, 0, 0]}
      geometry={new THREE.SphereGeometry(skyDomeRadius, 10, 10)}
      material={sphereMaterial}
    />
  );
};

export default BackgroundStars;
