import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { gsap } from "gsap";

// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import ParticlesGrid from "./background/ParticlesGrid.jsx";
import Images from "./background/ImageTransition.jsx";
import BackgroundPlane from "./background/BackgroundPlane.jsx";
import BackgroundStars from "./background/BackgroundStars.jsx";

export function BackgroundCanvas({ scrollableRef }) {
  // Animación glitch de la foto
  const [showEffectComposer, setShowEffectComposer] = useState(true);
  const scrollOffset = 0; // Ajusta esto para cambiar cuándo comienza la animación

  const [offset, setOffset] = useState([0.004, 0.004]);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    // Función para añadir una animación aleatoria a la línea de tiempo
    const addRandomAnimation = () => {
      const duration = Math.random() * 0.5;
      // Desplazamiento aleatorio (entre -0.002 y 0.002)
      const x = Math.random() * 0.004 - 0.002;
      const y = Math.random() * 0.004 - 0.002;
      tl.to(offset, {
        duration,
        x,
        y,
        onUpdate: () => setOffset([offset.x, offset.y]),
      });
    };

    // Función para añadir una pausa aleatoria a la línea de tiempo
    const addRandomPause = () => {
      const duration = Math.random();
      tl.to({}, { duration }); // Anima un objeto vacío para crear una pausa
    };

    for (let i = 0; i < 100; i++) {
      // Añade 100 animaciones y pausas a la línea de tiempo
      addRandomAnimation();
      addRandomPause();
    }

    return () => tl.kill();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let scrollPosition = window.scrollY;
      if (scrollPosition > scrollOffset) {
        setShowEffectComposer(false);
      } else {
        setShowEffectComposer(true);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollOffset]);

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
        {showEffectComposer && (
          <EffectComposer>
            <ChromaticAberration blendFunction={BlendFunction.MULTIPLY} offset={offset} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
