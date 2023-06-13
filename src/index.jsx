import "./style.css";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { CursorContextProvider } from "./cursorContext";
import { BackgroundVertex } from "./BackgroundVertex.jsx";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleStart = () => {
    setShowIntro(false);
  };

  return (
    <CursorContextProvider>
      <div className="app-wrapper">
        {showIntro ? (
          <div className="intro-screen">
            <h1>Titulo</h1>
            <p>Texto introductorio.</p>
            <button onClick={handleStart}>Empezar</button>
          </div>
        ) : (
          <>
            <Canvas
              style={{
                zIndex: 1,
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
          </>
        )}
      </div>
      <CustomCursor />
      <BackgroundVertex />
    </CursorContextProvider>
  );
};

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(<App />);
