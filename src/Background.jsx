import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";

export function BackgroundCanvas({ scrollableRef }) {
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
        {/* <ParticlesGrid /> */}
        <Images scrollableRef={scrollableRef} />
      </Suspense>
    </Canvas>
  );
}
