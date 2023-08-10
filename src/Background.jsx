import React from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { gsap } from "gsap";
import { TextureLoader } from 'three';

// import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";
import BackgroundPlane from "./background/BackgroundPlane.jsx";
import BackgroundStars from "./background/BackgroundStars.jsx";
import Blob from "./Blob.jsx";

export function BackgroundCanvas({ scrollableRef }) {
  const noiseTexture = useLoader(TextureLoader, 'background/noise.jpg');

  return (
    <Canvas
      camera={{
        fov: 15,
        near: 0.1,
        far: 600,
        zoom: 0.055,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        // pointerEvents: "none",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Suspense fallback={null}>
        <BackgroundStars />
        <Blob scrollableRef={scrollableRef}/>
        <Images scrollableRef={scrollableRef} />
        <BackgroundPlane scrollableRef={scrollableRef} />
      </Suspense>
    </Canvas>
  );
}
