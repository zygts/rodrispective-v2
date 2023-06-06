import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

function SphereComponent() {
  useFrame(({ clock }) => {
    // Puedes usar esto para animar la esfera o cualquier otra cosa que necesites
  });

  return (
    <mesh position={[4, 0, 1.6]}>
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial attach="material" color="green" />
      </Sphere>
    </mesh>
  );
}

export function BackgroundCanvas() {
  return (
    <Canvas
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
        <color attach="background" args={["#15151a"]} />
        <SphereComponent />
      </Suspense>
    </Canvas>
  );
}
