import "./style.css";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContextProvider } from "./appContext";
import { BackgroundCanvas } from "./Background";
import LoadingScreen from "./LoadingScreen";
import IntroContent from "./IntroContent";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const scrollableRef = useRef(null);

  useEffect(() => {
    const setRef = () => {
      // Establece scrollableRef aquí cuando el DOM está completamente cargado.
      scrollableRef.current = document.getElementById("scrollable");
    };

    // Espera a que el DOM esté completamente cargado.
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", setRef);
    } else {
      // En caso de que el DOM ya esté cargado (porque useEffect se ejecutó después de que se completó la carga), llama a setRef directamente.
      setRef();
    }

    // Remueve el listener cuando se desmonte el componente.
    return () => {
      document.removeEventListener("DOMContentLoaded", setRef);
    };
  }, []);

  useEffect(() => {
    // Revisar si la referencia está siendo capturada.
    console.log(scrollableRef.current);
  }, [scrollableRef.current]);

  useEffect(() => {
    const handleStartButtonClick = () => {
      setShowIntro(false);
    };

    window.addEventListener("startButtonClick", handleStartButtonClick);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
    };
  }, []);

  return (
    <AppContextProvider value={{ showIntro, setShowIntro }}>
      {/* <LoadingScreen /> */}
      <div id="scrollable" ref={scrollableRef}>
        <IntroContent />
      </div>
      <div
        className="app-wrapper"
        style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <Canvas
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
      <CustomCursor />
      <BackgroundCanvas scrollableRef={scrollableRef} />
    </AppContextProvider>
  );
};

console.log("App renderizado");
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
