import React, { useState, useEffect } from "react";
import { a } from "@react-spring/three";

const BackgroundPlane = () => {
  const [opacity, setOpacity] = useState(1);
  const offset = 200; // Ajusta esto para cambiar cuándo comienza la animación

  useEffect(() => {
    const handleScroll = () => {
      let scrollPosition = Math.max(window.scrollY - offset, 0);
      let newOpacity = 1 - scrollPosition / 500;
      newOpacity = Math.max(newOpacity, 0);
      setOpacity(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  return (
    <a.mesh position={[0, 0, 0]} scale={[50, 50]}>
      <planeGeometry attach="geometry" args={[10, 10]} />
      <a.meshBasicMaterial
        attach="material"
        transparent
        opacity={opacity}
        color="#FFFFFF"
      />
    </a.mesh>
  );
};

export default BackgroundPlane;
