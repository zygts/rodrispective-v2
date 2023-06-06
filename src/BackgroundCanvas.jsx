import { useEffect, useRef } from "react";

export function BackgroundCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;

    // Aquí puedes configurar y utilizar el canvas

    return () => {
      // Aquí puedes realizar cualquier limpieza necesaria
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        height: "100vh",
        width: "100vw",
      }}
    />
  );
}
