import "./styles/global.css";
import React, { useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContext, AppContextProvider } from "./appContext";
import { BackgroundCanvas } from "./Background";
import IntroContent from "./IntroContent2";

const MainContent = () => {
  const { showIntro, setShowIntro } = useContext(AppContext);
  const scrollableRef = useRef(null);

  useEffect(() => {
    const handleStartButtonClick = () => {
      setShowIntro(false);
    };

    window.addEventListener("startButtonClick", handleStartButtonClick);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
    };
  }, [setShowIntro]);

  return (
    <>
      <CustomCursor />
      <div id="scrollable" ref={scrollableRef} style={{
            zIndex: 1,
            visibility: showIntro ? "visible" : "hidden",
          }}>
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

console.log("App renderizado");
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
