import "./styles/global.css";
import "./styles/about-page.css";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { AppContextProvider } from "./appContext";
import { BackgroundCanvas } from "./Background";
import IntroContent from "./IntroContent";
import Instructions from "./Instructions";
import Loader from "./Loader";
import Header from "./header.jsx";
import AboutPage from "./aboutPage.jsx";
import ContactPage from "./contactPage.jsx";
import { useBreakpoint } from "./hooks/useBreakpoint";
import OrientationWarning from "./OrientationWarning";

const MainContent = () => {
  const { isDesktop } = useBreakpoint();
  const [showIntro, setShowIntro] = useState(true);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [removeScrollable, setRemoveScrollable] = useState(false);

  const scrollableRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleStartButtonClick = () => {
    setStartButtonClicked(true);

    setTimeout(() => {
      setRemoveScrollable(true);
    }, 5000); 
  };

  const handleShaderAnimationComplete = () => {
    setShowIntro(false);
    setStartAnimation(true);
  };

  const handleExperienceLoaded = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    window.addEventListener("startButtonClick", handleStartButtonClick);
    window.addEventListener("shaderAnimationComplete", handleShaderAnimationComplete);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
      window.removeEventListener("shaderAnimationComplete", handleShaderAnimationComplete);
    };
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {isDesktop && <CustomCursor />}
      <OrientationWarning />
      <Header />
      <AboutPage />
      <ContactPage />

      {!removeScrollable && (
        <div id="scrollable" ref={scrollableRef}>
          <IntroContent isLoading={isLoading} />
        </div>
      )}

      <div className="app-wrapper" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
        <Instructions isVisible={!showIntro} animate={startAnimation} />
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
            <Experience onLoaded={handleExperienceLoaded} />
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
