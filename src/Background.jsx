import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";
import BackgroundPlane from "./background/BackgroundPlane.jsx";
import BackgroundStars from "./background/BackgroundStars.jsx";

export function BackgroundCanvas({ scrollableRef }) {
  return (
    <Canvas
      camera={{
        fov: 15,
        near: 1,
        far: 600,
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
        <BackgroundStars />
        <Images scrollableRef={scrollableRef} />
        <BackgroundPlane scrollableRef={scrollableRef} />
      </Suspense>
    </Canvas>
  );
}
