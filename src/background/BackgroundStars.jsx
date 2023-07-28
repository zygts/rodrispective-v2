import { useMemo, useRef } from "react";
import { useThree, extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import StarrySkyShader from "./StarrySkyShader";

extend({ StarrySkyShader });

const BackgroundStars = () => {
  const { scene } = useThree();
  const skyDomeRadius = 500.01;

  const skyDomeRef = useRef();

  const sphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          skyRadius: { value: skyDomeRadius },
          env_c1: { value: new THREE.Color("#281C35") },
          env_c2: { value: new THREE.Color("#6D3A23") },
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
    skyDomeRef.current = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(skyDomeRef.current);

    // Limpia para eliminar skyDome de la escena cuando el componente se desmonte
    return () => {
      scene.remove(skyDomeRef.current);
      skyDomeRef.current.geometry.dispose();
      skyDomeRef.current.material.dispose();
    };
  }, [scene, sphereGeometry, sphereMaterial]);

  // Agrega una rotación a skyDome en cada fotograma
  useFrame(() => {
    if (skyDomeRef.current) {
      skyDomeRef.current.rotation.y += 0.0001; // Ajusta la velocidad de rotación aquí
    }
  });

  return null;
};

export default BackgroundStars;
