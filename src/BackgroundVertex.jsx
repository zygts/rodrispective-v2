import React, { useEffect, useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  TextureLoader,
  ShaderMaterial,
  PointsMaterial,
} from "three";
import vertexShader from "./shaders/points.vert";
import fragmentShader from "./shaders/points.frag";
import { randFloat } from "three/src/math/MathUtils";

function ParticlesGrid() {
  const geometry = new BufferGeometry();
  const materialRef = useRef(); // Nuevo useRef para el material

  const multiplier = 18;
  const nbColumns = 16 * multiplier;
  const nbLines = 9 * multiplier;

  const vertices = [];
  const initPositions = [];

  for (let i = 0; i < nbColumns; i++) {
    for (let j = 0; j < nbLines; j++) {
      const point = [i, j, 0];
      const initPoint = [i - nbColumns / 2, j - nbLines / 2, randFloat(0, 300)];

      vertices.push(...point);
      initPositions.push(...initPoint);
    }
  }

  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("./img/kitten.jpeg", (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);

  const totalVertices = new Float32Array(vertices, 3);
  const totalInitPositions = new Float32Array(initPositions, 3);

  geometry.setAttribute("position", new BufferAttribute(totalVertices, 3));
  geometry.setAttribute("initPosition", new BufferAttribute(totalInitPositions, 3));
  geometry.center();
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uPointSize: {
        value: 5,
      },
      uTexture: { type: "t", value: texture },
      uNbLines: { value: nbLines },
      uNbColumns: { value: nbColumns },
      uProgress: { value: 0 },
      uFrequency: { value: 0.5 },
      uTime: { value: 0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  materialRef.current = material; // Asignar el material al ref

  const mesh = new Points(geometry, material);

  // Animación de entrada
  gsap.fromTo(
    material.uniforms.uProgress,
    {
      value: 0,
    },
    {
      value: 1,
      duration: 2.5,
      ease: "Power4.easeOut",
    }
  );

  // Añadir useFrame para forzar la actualización del material
  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Utiliza Math.sin y clock.elapsedTime para animar uFrequency
      //   materialRef.current.uniforms.uFrequency.value = Math.sin(clock.elapsedTime);
      materialRef.current.uniforms.uTime.value = clock.elapsedTime * 5;
      materialRef.current.needsUpdate = true;
    }
  });

  return (
    <primitive
      object={mesh}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    />
  );
}

export function BackgroundVertex() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 1,
        far: 400,
        zoom: 0.03,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#15151a"]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[-10, 0, 5]} intensity={0.15} />
        <ParticlesGrid />
      </Suspense>
    </Canvas>
  );
}
