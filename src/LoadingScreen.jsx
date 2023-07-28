import React, { useState, useEffect } from "react";

function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 3000); // 3 segundos
    return () => clearTimeout(timeout); // Limpiar el timeout si el componente se desmonta
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        zIndex: 1000,
        color: "black",
        fontSize: "3em",
        textAlign: "center",
      }}
    >
      <p>Cargando...</p>
      <p>0 %</p>
    </div>
  );
}

export default LoadingScreen;
