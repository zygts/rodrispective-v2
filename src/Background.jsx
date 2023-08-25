import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";
import LastImageShader from "./background/LastImageShader.jsx";
import BackgroundPlane from "./background/BackgroundPlane.jsx";
import BackgroundStars from "./background/BackgroundStars.jsx";
import Blob from "./Blob.jsx";

export function BackgroundCanvas({ scrollableRef }) {
  return (
    <Canvas
      id="background-canvas"
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
        pointerEvents: "none",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Suspense fallback={null}>
        {/* <ParticlesGrid /> */}
        <BackgroundStars />
        <Blob scrollableRef={scrollableRef} />
        <Images scrollableRef={scrollableRef} />
        <LastImageShader scrollableRef={scrollableRef} />
        <BackgroundPlane scrollableRef={scrollableRef} />
      </Suspense>
    </Canvas>
  );
}
