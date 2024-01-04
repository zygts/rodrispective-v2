import React, { useState, useEffect, useContext, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import gsap from "gsap";

import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";
import LastImageShader from "./background/LastImageShader.jsx";
import BackgroundPlane from "./background/BackgroundPlane.jsx";
import BackgroundStars from "./background/BackgroundStars.jsx";
import Stars from "./background/NewStars.jsx";

import { AppContext } from "./appContext";

export function BackgroundCanvas({ scrollableRef }) {
  const [isAnimationComplete, setAnimationComplete] = useState(false);
  const animationContainerRef = useRef(); // Referencia al contenedor de animación
  const { startButtonClicked } = useContext(AppContext);

  useEffect(() => {
    const handleShaderAnimationComplete = () => {
      setAnimationComplete(true);
    };

    window.addEventListener("shaderAnimationComplete", handleShaderAnimationComplete);

    return () => {
      console.log("complete"),
        window.removeEventListener(
          "shaderAnimationComplete",
          handleShaderAnimationComplete
        );
    };
  }, []);

  useEffect(() => {
    if (startButtonClicked && animationContainerRef.current) {
      gsap.to(animationContainerRef.current, {
        filter: "blur(7px)",
        scale: 1.6,
        duration: 2.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(animationContainerRef.current, {
            filter: "blur(0px)",
            scale: 1,
            duration: 0.6,
            ease: "power2.inOut",
          });
        },
      });
    }
  }, [startButtonClicked]);

  return (
    <Canvas
      ref={animationContainerRef}
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
        backgroundColor: "#0E0C0C",
      }}
    >
      <Suspense fallback={null}>
        {isAnimationComplete ? (
          <ParticlesGrid />
        ) : (
          <>
            {/* <BackgroundStars /> */}
            <Stars starCount={15000} />
            <Images scrollableRef={scrollableRef} />
            <LastImageShader scrollableRef={scrollableRef} />
            <BackgroundPlane scrollableRef={scrollableRef} />
          </>
        )}
      </Suspense>
    </Canvas>
  );
}
