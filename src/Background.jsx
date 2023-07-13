import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticlesGrid from "./ParticlesGrid.jsx";

export function Background() {
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
