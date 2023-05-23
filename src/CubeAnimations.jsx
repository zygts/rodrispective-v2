import React, { useEffect } from "react";
import { gsap } from "gsap";

function CubeAnimations({ isAnimationFinished }) {
  useEffect(() => {
    if (isAnimationFinished) {
      const tl = gsap.timeline();
      tl.fromTo(
        ".cube-content h1",
        { opacity: 0, y: -120 },
        { opacity: 1, y: 0, duration: 2 }
      );
    }
  }, [isAnimationFinished]);

  return null; // Este componente no necesita renderizar nada
}

export default CubeAnimations;
