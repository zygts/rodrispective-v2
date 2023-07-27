import React, { useMemo } from "react";
import { useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import StarrySkyShader from "./StarrySkyShader";

extend({ StarrySkyShader });

const BackgroundStars = () => {
  const { scene } = useThree();
  const skyDomeRadius = 500.01;

  const sphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          skyRadius: { value: skyDomeRadius },
          env_c1: { value: new THREE.Color("#0d1a2f") },
          env_c2: { value: new THREE.Color("#0f8682") },
          noiseOffset: { value: new THREE.Vector3(10.01, 10.01, 10.01) },
          starSize: { value: 0.003 },
          starDensity: { value: 0.09 },
          clusterStrength: { value: 0.0 },
          clusterSize: { value: 0.1 },
        },
        vertexShader: StarrySkyShader.vertexShader,
        fragmentShader: StarrySkyShader.fragmentShader,
        side: THREE.DoubleSide,
      }),
    []
  );

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(skyDomeRadius, 10, 10),
    [skyDomeRadius]
  );

  // Add skyDome to scene
  useMemo(() => {
    const skyDome = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(skyDome);

    // Clean up function to remove skyDome from scene when component unmounts
    return () => {
      scene.remove(skyDome);
      skyDome.geometry.dispose();
      skyDome.material.dispose();
    };
  }, [scene, sphereGeometry, sphereMaterial]);

  return null;
};

export default BackgroundStars;
