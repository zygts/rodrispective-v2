import { useEffect } from "react";
import { gsap } from "gsap";

function CubeAnimations({ isAnimationFinished, isPlaying }) {
  useEffect(() => {
    if (isAnimationFinished) {
      const tl = gsap.timeline();
      tl.set(".song-preview", {
        opacity: 0,
      });
      tl.to(".song-preview", { opacity: 1, y: 0, duration: 2 });
    }
  }, [isAnimationFinished]);

  useEffect(() => {
    if (isPlaying) {
      // Aquí puedes definir tu nueva animación con gsap
      const tl = gsap.timeline();
      tl.fromTo(
        ".song-info",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 2,
        }
      );
    } else {
      gsap.to(".song-info", {
        opacity: 0,
        duration: 1,
      });
    }
  }, [isPlaying]);

  return null; // Este componente no necesita renderizar nada
}

export default CubeAnimations;
