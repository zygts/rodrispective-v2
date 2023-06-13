import "./style.css";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContextProvider } from "./appContext";
import { BackgroundVertex } from "./BackgroundVertex.jsx";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setShowIntro(false);
  };

  return (
    <AppContextProvider>
      <div className="app-wrapper">
        <div className={`intro-screen ${showIntro ? "" : "hide"}`}>
          <h1>Titulo</h1>
          <p>Texto introductorio.</p>
          <button onClick={handleStart}>Empezar</button>
        </div>
        <Canvas
          style={{
            zIndex: 1,
            visibility: showIntro ? "hidden" : "visible",
          }}
          camera={{
            fov: 45,
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
      <BackgroundVertex uProgress={progress} />
    </AppContextProvider>
  );
};
console.log("App renderizado");
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
