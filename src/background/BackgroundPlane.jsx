import React, { useState, useEffect } from "react";
import { a } from "@react-spring/three";

const BackgroundPlane = () => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      let scrollPosition = window.scrollY;
      let newOpacity = 1 - scrollPosition / 500;
      newOpacity = Math.max(newOpacity, 0);
      setOpacity(newOpacity);
      console.log(newOpacity);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <a.mesh position={[0, 0, 0]} scale={[50, 50]}>
      <planeGeometry attach="geometry" args={[10, 10]} />
      <a.meshBasicMaterial attach="material" transparent={true} opacity={opacity} color="#ffffff" />
    </a.mesh>
  );
};

export default BackgroundPlane;
