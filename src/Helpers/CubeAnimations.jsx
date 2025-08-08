import { useEffect } from "react";
import { gsap } from "gsap";

function CubeAnimations({ isAnimationFinished, isPlaying, isLeaving }) {

  useEffect(() => {
    if (isAnimationFinished) {
      const showInfoTL = gsap.timeline();
      showInfoTL.fromTo(
        ".song-preview",
        { opacity: 0, y: "25vh", x: -100 },
        {
          opacity: 1,
          y: "25vh",
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      ).fromTo(".btn-play", {
        opacity: 0,
      }, {
        opacity: 1,
        duration: 0.2,
      }, "<");
    }
  }, [isAnimationFinished]);

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
          duration: 0.5,
          ease: "power3.out",
        }
      ).to(".song-info", {
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      }, "<");
    } else {
      tl.to(".song-info", {
        opacity: 0,
        duration: 0.2,
        ease: "power3.inOut",
      }).to(
        ".song-preview",
        {
          y: "25vh",
          duration: 0.5,
          ease: "power3.in",
        },
        "<"
      );
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isLeaving) {
      const tl = gsap.timeline();
      tl.to(".song-preview", {
        opacity: 0,
        x: -100,
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(".btn-play", {
        opacity: 0,
        duration: 0.2,
      });
    }
  }, [isLeaving]);

  return null;
}

export default CubeAnimations;
