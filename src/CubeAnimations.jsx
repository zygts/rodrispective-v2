import { useEffect } from "react";
import { gsap } from "gsap";

function CubeAnimations({ isAnimationFinished }) {
  useEffect(() => {
    if (isAnimationFinished) {
      const tl = gsap.timeline();
      tl.set(".song-preview", {
        opacity: 0,
      });
      tl.to(".song-preview", { opacity: 1, y: 0, duration: 2 });
    }
  }, [isAnimationFinished]);

  return null; // Este componente no necesita renderizar nada
}

export default CubeAnimations;
