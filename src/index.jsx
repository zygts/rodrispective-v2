import "./style.css";
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContextProvider } from "./appContext";
import { Background } from "./Background";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleStart = () => {
    setShowIntro(false);
  };

  return (
    <AppContextProvider value={{ showIntro, setShowIntro }}>
      <div className="app-wrapper">
        <div className={`intro-screen ${showIntro ? "" : "hide"}`}>
          <h1>Rodrispective</h1>
          <p>
            Welcome to our tribute super website, celebrating the profound impact and
            timeless work of a musician who truly left their mark on music history. Here,
            we delve into their career, explore their influential songs, and share
            personal stories that shaped their legacy. This site is a curated journey into
            their life and work, meant to inspire new and seasoned fans alike. Let's
            embark on this musical adventure together!.
          </p>
          <button onClick={handleStart}>Explore</button>
        </div>
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
      {/* <BackgroundVertex uProgress={progress} showIntro={showIntro} /> */}
      <Background />
    </AppContextProvider>
  );
};
console.log("App renderizado");
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
