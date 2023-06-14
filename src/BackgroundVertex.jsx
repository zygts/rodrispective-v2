import React, { useEffect, useState, useRef, useContext, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  TextureLoader,
  ShaderMaterial,
  Vector2,
} from "three";
import { randFloat } from "three/src/math/MathUtils";

import vertexShader from "./shaders/points.vert";
import fragmentShader from "./shaders/points.frag";
import { AppContext } from "./appContext";

function ParticlesGrid() {
  const { audio, introOn, isLoading, cursorPosition, showIntro } = useContext(AppContext);
  const geometry = new BufferGeometry();
  const materialRef = useRef();

  const [uProgress, setUProgress] = useState(0);

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

  const totalVertices = new Float32Array(vertices, 3);
  const totalInitPositions = new Float32Array(initPositions, 3);

  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("./img/rodri.jpg", (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);

  geometry.setAttribute("position", new BufferAttribute(totalVertices, 3));
  geometry.setAttribute("initPosition", new BufferAttribute(totalInitPositions, 3));
  geometry.center();
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uPointSize: {
        value: 10,
      },
      uTexture: { type: "t", value: texture },
      uNbLines: { value: nbLines },
      uNbColumns: { value: nbColumns },
      uProgress: { value: uProgress },
      uFrequency: { value: 0.5 },
      uTime: { value: 0 },
      uSoundVolume: { value: 0.0 },
      uIntensity: { value: 0.25 },
      uMousePos: { value: cursorPosition },
      uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uAspectRatio: { value: window.innerWidth / window.innerHeight },
      uShowIntro: { value: showIntro ? 1.0 : 0.0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new Points(geometry, material);
  materialRef.current = material;

  // Animación de entrada
  useEffect(() => {
    if (!isLoading) {
      const animationObj = { progress: 0 };
      gsap.to(animationObj, {
        progress: 1,
        duration: 2.5,
        ease: "Power4.easeOut",
        onUpdate: () => setUProgress(animationObj.progress),
      });
    }
  }, [isLoading]);

  // Detectar el volumen de la música
  useFrame(({ clock }) => {
    if (material) {
      material.uniforms.uTime.value = clock.elapsedTime * 5;

      if (audio && audio.getAverageVolume) {
        const volume = audio.getAverageVolume();
        material.uniforms.uSoundVolume.value = volume / 255;
      }
      material.needsUpdate = true;
    }
  });

  // Actualiza resolución
  useEffect(() => {
    const onResize = () => {
      material.uniforms.uResolution.value.x = window.innerWidth;
      material.uniforms.uResolution.value.y = window.innerHeight;
      material.uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (materialRef.current && materialRef.current.uniforms.uShowIntro) {
      materialRef.current.uniforms.uShowIntro.value = showIntro ? 1.0 : 0.0;
    }
  }, [showIntro]);

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
        zoom: 0.028,
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
        <ParticlesGrid />
      </Suspense>
    </Canvas>
  );
}
