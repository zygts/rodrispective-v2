import "./styles/intro.css";
import React, {
  useEffect,
  useRef,
  useContext,
  useState,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { AppContext } from "./appContext";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function IntroContent({ isLoading }) {
  const { setCursorState } = useContext(AppContext);

  const scrollDownRef = useRef(null);
  const helloTextRef = useRef(null);
  const startButtonRef = useRef(null);
  const [startButtonClicked, setStartButtonClicked] = useState(false);

  // Eventos del cursor
  const handlePointerEnter = useCallback(() => {
    setCursorState("large--filled-exlusion");
  }, [setCursorState]);

  const handlePointerLeave = useCallback(() => {
    setCursorState("default");
  }, [setCursorState]);

  // Disparar evento personalizado
  const handleClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("startButtonClick"));
  }, []);

  // Escuchar el evento personalizado
  useEffect(() => {
    const handleStartButtonClick = () => setStartButtonClicked(true);
    window.addEventListener("startButtonClick", handleStartButtonClick);
    return () =>
      window.removeEventListener("startButtonClick", handleStartButtonClick);
  }, []);

  // Animación botón al hacer click
  useEffect(() => {
    if (startButtonClicked && startButtonRef.current) {
      const btn = startButtonRef.current;
      btn.classList.add("inactive");
      gsap.fromTo(
        btn,
        { scale: 1, filter: "brightness(100%) blur(0px)" },
        {
          scale: 0,
          filter: "brightness(150%) blur(10px)",
          duration: 2,
          ease: "power2.in",
        }
      );
    }
  }, [startButtonClicked]);

  // Animación de entrada + scroll-trigger
  useEffect(() => {
    const helloText = helloTextRef.current;
    const split = Splitting({ target: helloText, by: "words" })[0];
    const words = split.words;

    const span1 = document.querySelector("#hello-title-1");
    const span2 = document.querySelector("#hello-title-2");

    gsap.set(words, { opacity: 0 });
    gsap.set(span2, { display: "none" });

    const introTl = gsap.timeline({
  onComplete: () => {
    const switchTitles = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 });
    switchTitles
      .to(span1, { duration: 1, display: "none" })
      .to(span2, { duration: 1, display: "inline" });
  },
});

gsap.set(words, { opacity: 0 });

// Reproduce cada palabra con ritmo
introTl
  .to(words[0], { duration: 0.6, opacity: 1 }, "+=2.4")     // Mostrar "Hello"
  .to(words[1], { duration: 0.6, opacity: 1 }, "+=0.01")     // Mostrar "there."
  .to({}, { duration: 0.4 })                                // Pequeña pausa
  .to(words.slice(2), {
    duration: 0.6,
    opacity: 1,
    stagger: 0.275,
  });


    // Scroll animado de títulos
    const titles = document.querySelectorAll("[data-effect17]");
    Splitting({ target: "[data-effect17]", by: "chars" });

    titles.forEach((title) => {
      const chars = title.querySelectorAll(".char");
      chars.forEach((char) =>
        gsap.set(char.parentNode, { perspective: 1000 })
      );

      gsap.fromTo(
        chars,
        {
          opacity: 1,
          rotateX: 0,
          z: 0,
        },
        {
          opacity: 0,
          rotateX: () => gsap.utils.random(-120, 120),
          z: () => gsap.utils.random(-200, 200),
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: title,
            start: "top 60%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    // Scroll Down aparece y desaparece
    gsap.set(scrollDownRef.current, { opacity: 0 });

    gsap.to(scrollDownRef.current, {
      opacity: 1,
      delay: 5,
      duration: 0.2,
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#scrollable",
        start: "top center",
        end: "90% center",
        scrub: true,
      },
    }).to({}, { duration: 2 })
      .to(scrollDownRef.current, {
        opacity: 0,
        duration: 0.2,
        immediateRender: false,
      });
  }, []);

  return (
    <>
      <p id="hello-text" ref={helloTextRef}>
        Hello there. Welcome to a{" "}
        <span id="hello-title-1">retrospective </span>
        <span id="hello-title-2">Rodrispective </span>
        of the music I have been working on for nearly a lifetime
      </p>
      <p className="content__title" data-splitting data-effect17>
        Yes, a lifetime.
      </p>
      <p className="content__title" data-splitting data-effect17>
       Years and years of sound. Not always heard.
      </p>
      <p className="content__title" data-splitting data-effect17>
        Created under different names. In collaboration, but mostly alone, in the darkness
of my bedroom.
      </p>
      <p className="content__title" data-splitting data-effect17>
        Always unreleased.
      </p>
      <p className="content__title" data-splitting data-effect17>
        Now, the time has come to pause, reflect, and open up.
      </p>

      <div ref={scrollDownRef} className="scroll-down">
        Please scroll down
      </div>

      <div id="start-container">
        <button
          ref={startButtonRef}
          className="start-btn loader__item"
          data-target-loader="landing"
          data-allow-audio="true"
          data-audio-play="background"
          data-message="Click here to enter with audio"
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <svg
            className="loader__svg"
            viewBox="0 0 306.5 306.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="loader__loaded" style={{ opacity: 1 }}>
              <g className="loaded__circles">
                {[0, 1, 2, 3, 4].map((i) => (
                  <circle
                    key={i}
                    className="loaded__circle"
                    cx="153.2"
                    cy="153.2"
                    r="152.5"
                    vectorEffect="non-scaling-stroke"
                    data-svg-origin="153.2 153.2"
                    transform={`matrix(${1 - i * 0.03},0,0,${1 - i * 0.03},${i *
                      4.596},${i * 4.596})`}
                    style={{ transformOrigin: "0px 0px" }}
                  />
                ))}
              </g>
            </g>
          </svg>
          <span>Begin</span>
        </button>
      </div>
    </>
  );
}

export default IntroContent;
