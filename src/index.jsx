import "./styles/global.css";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContextProvider } from "./appContext";
import { BackgroundCanvas } from "./Background";
import IntroContent from "./IntroContent";

const MainContent = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const scrollableRef = useRef(null);

  // Recarga la página desde el comienzo
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Manejadores de eventos
  const handleStartButtonClick = () => {
    setStartButtonClicked(true); // Configura el inicio de la animación
  };

  const handleShaderAnimationComplete = () => {
    setShowIntro(false); // Oculta el contenido introductorio después de que la animación haya terminado
  };

  useEffect(() => {
    // Escucha los eventos
    window.addEventListener("startButtonClick", handleStartButtonClick);
    window.addEventListener("shaderAnimationComplete", handleShaderAnimationComplete);

    // Limpia los oyentes de eventos al desmontar
    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
      window.removeEventListener(
        "shaderAnimationComplete",
        handleShaderAnimationComplete
      );
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <div
        id="scrollable"
        ref={scrollableRef}
        style={{
          zIndex: 1,
          visibility: showIntro ? "visible" : "hidden",
        }}
      >
        <IntroContent />
      </div>
      <div
        className="app-wrapper"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <Canvas
          id="experience-canvas"
          style={{
            zIndex: 1,
            visibility: showIntro ? "hidden" : "visible",
          }}
          camera={{
            fov: 24,
            near: 0.1,
            far: 200,
          }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
      <BackgroundCanvas scrollableRef={scrollableRef} />
    </>
  );
};

const App = () => {
  return (
    <AppContextProvider>
      <MainContent />
    </AppContextProvider>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
