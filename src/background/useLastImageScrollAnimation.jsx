import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export const useLastImageScrollAnimation = (imageRef, scrollableRef, isTextureLoaded) => {
  useEffect(() => {
    if (!isTextureLoaded) {
      return;
    }

    if (!imageRef || !imageRef.current || !scrollableRef || !scrollableRef.current) {
      return;
    }

    const imageTl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollableRef.current,
        start: "70% top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    imageTl
      .set(imageRef.current.material.uniforms.u_opacity, {
        value: 0,
      })
      .to(imageRef.current.position, {
        z: 2.91,
        duration: 0.2,
      })
      .to(imageRef.current.material.uniforms.u_opacity, {
        value: 1,
        duration: 0.2,
      });

    return () => {
      imageTl.kill(); // Limpia la animación al desmontar
    };
  }, [imageRef, scrollableRef, isTextureLoaded]);
};
