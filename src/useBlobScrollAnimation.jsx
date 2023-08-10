import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useBlobScrollAnimation = (meshRef, scrollableRef) => {
  useEffect(() => {
      
    if (!meshRef || !meshRef.current || !scrollableRef || !scrollableRef.current) {
        return;
      }

    const blobTl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollableRef.current,
        start: '80% top',
        end: 'bottom bottom',
        scrub: true,
      },
    });

    blobTl
    .from(meshRef.current.position, {
      z: 5, // Ajusta la posición final según lo que necesites
      duration: 1, // Duración de la animación en segundos
    })
    .from(
        meshRef.current.material.uniforms.u_intensity,
        { value: 1.0, 
            duration: 1 
        },
      );

    return () => {
        blobTl.kill(); // Limpia la animación al desmontar
    };
  }, [meshRef, scrollableRef]);
};
