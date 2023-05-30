import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import Experience from "./Experience.jsx";
import CustomCursor from "./CustomCursor";
import { CursorContextProvider } from "./cursorContext";

const root = ReactDOM.createRoot(document.querySelector("#root"));

const created = () => {};

root.render(
  <CursorContextProvider>
    <div className="app-wrapper">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        onCreated={created}
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>
      <CustomCursor />
    </div>
  </CursorContextProvider>
);
