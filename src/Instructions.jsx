import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import { useBreakpoint } from "./hooks/useBreakpoint";

const Instructions = ({ isVisible, animate }) => {
  const helloTextRef = useRef(null);
  const helloTextRef2 = useRef(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { isMobile, isTablet } = useBreakpoint();
  const isTouchDevice = isMobile || isTablet;

  useEffect(() => {
    if (animate && helloTextRef.current) {
      const p1 = Splitting({ target: helloTextRef.current, by: "chars" })[0];
      const p2 = Splitting({ target: helloTextRef2.current, by: "chars" })[0];

      const chars1 = p1.chars;
      const chars2 = p2.chars;

      const tlOne = gsap.timeline({
      onComplete: () => {
        setIsAnimationComplete(true);
        // Disparar evento personalizado cuando la animación termine
        window.dispatchEvent(new CustomEvent('instructionsAnimationComplete'));
      },
    });

      gsap.set([chars1, chars2], { opacity: 0 });
      tlOne
        .to(chars1, {
          duration: 0.5,
          opacity: 1,
          stagger: {
            each: 0.04,
            ease: "power2.out",
          },
        })
        .to(chars1, {
          delay: 1,
          duration: 0.25,
          opacity: 0,
          stagger: {
            from: "end",
            each: 0.04,
            ease: "power2.out",
          },
        })
        .to(
          chars2,
          {
            duration: 0.5,
            opacity: 1,
            stagger: {
              each: 0.04,
              ease: "power2.out",
            },
          },
          "-=0.5"
        )
        .to(chars2, {
          delay: 1,
          duration: 0.5,
          opacity: 0,
          stagger: {
            from: "start",
            each: 0.04,
            ease: "power2.out",
          },
        });
    }
  }, [animate]);

  // Si la animación se ha completado o si 'isVisible' es falso, no renderizar el div
  if (isAnimationComplete || !isVisible) return null;

  return (
    <div
      className="instructions"
      style={{
        zIndex: 2,
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      {isTouchDevice ? (
        <>
          <p ref={helloTextRef}>swipe sideways to spin the wheel</p>
          <p ref={helloTextRef2}>tap on any song to select</p>
        </>
      ) : (
        <>
          <p ref={helloTextRef}>scroll up or down to spin the wheel</p>
          <p ref={helloTextRef2}>click on any song to select</p>
        </>
      )}
    </div>
  );
};

export default Instructions;
