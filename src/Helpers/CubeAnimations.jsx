import { useEffect } from "react";
import { gsap } from "gsap";

function CubeAnimations({ isAnimationFinished, isPlaying }) {
  // Animación al abrir canción
  // useEffect(() => {
  //   if (isAnimationFinished) {
  //     const showInfoTL = gsap.timeline();
  //     showInfoTL
  //       .set([".song-preview", ".song-info"], {
  //         opacity: 0,
  //       })
  //       .to(".song-preview", { opacity: 1, y: 0, duration: 2 });
  //   }
  // }, [isAnimationFinished]);

  useEffect(() => {
    if (isAnimationFinished) {
      const showInfoTL2 = gsap.timeline();
      showInfoTL2.fromTo(
        ".song-preview",
        { opacity: 0, y: "25vh", x: -100, duration: 2 },
        {
          opacity: 1,
          y: "25vh",
          x: 0,
        }
      );
    }
  }, [isAnimationFinished]);

  // Animación al reproducir
  useEffect(() => {
    const tl = gsap.timeline();
    if (isPlaying) {
      tl.fromTo(
        ".song-preview",
        {
          y: "25vh",
        },
        {
          y: "0",
        }
      ).to(".song-info", {
        opacity: 1,
      });
    } else {
      tl.to(".song-info", {
        opacity: 0,
      }).fromTo(
        ".song-preview",
        {
          y: "0",
        },
        {
          y: "25vh",
        }
      );
    }
  }, [isPlaying]);

  return null;
}

export default CubeAnimations;
