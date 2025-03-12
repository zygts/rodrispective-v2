import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

/**
 * Función para envolver líneas de texto en elementos con una clase específica.
 */
const wrapLines = (arr, wrapType, wrapClass) => {
  arr.forEach((el) => {
    const wrapEl = document.createElement(wrapType);
    wrapEl.classList.add(wrapClass);
    el.replaceWith(wrapEl); // Reemplazar directamente en el DOM sin crear ciclos
    wrapEl.appendChild(el);
  });
};

/**
 * Hook para animar líneas de texto con GSAP y SplitType.
 */
const useTextLinesReveal = (textRefs) => {
  const animateIn = useRef(() => {});
  const animateOut = useRef(() => {});

  useEffect(() => {
    if (!textRefs.current || textRefs.current.length === 0) return;

    // Convertir en array y filtrar referencias no válidas
    const textElements = Object.values(textRefs.current).filter((el) => el !== null);

    const splitInstances = textElements.map((textEl) => {
      const splitInstance = new SplitType(textEl, { types: "lines" });
      wrapLines(splitInstance.lines, "div", "oh");
      gsap.set(textEl, { opacity: 0 }); // Asegurar que estén ocultos inicialmente
      return { textEl, splitInstance };
    });

    // Animación de entrada
    animateIn.current = () => {
      splitInstances.forEach(({ textEl, splitInstance }) => {
        gsap.set(splitInstance.lines, { yPercent: 105 });
        gsap.to(textEl, { opacity: 1, duration: 0.2 });
        gsap.to(splitInstance.lines, {
          yPercent: 0,
          stagger: 0.05,
          duration: 1.1,
          ease: "power4.inOut",
        });
      });
    };

    // Animación de salida
    animateOut.current = () => {
      splitInstances.forEach(({ textEl, splitInstance }) => {
        gsap.to(splitInstance.lines, {
          yPercent: -105,
          stagger: 0.05,
          duration: 1.1,
          ease: "power4.inOut",
        });
        gsap.to(textEl, { opacity: 0, duration: 0.2, delay: 0.8 });
      });
    };

    return () => {
      splitInstances.forEach(({ splitInstance }) => splitInstance.revert());
    };
  }, [textRefs]);

  return { animateIn, animateOut };
};

export default useTextLinesReveal;
