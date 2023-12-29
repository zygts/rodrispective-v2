import "./styles/intro.css";
import React, { useEffect, useRef, useContext, useState } from "react";
import { gsap } from "gsap";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

import { AppContext } from "./appContext";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

function IntroContent() {
  const { setCursorState } = useContext(AppContext);
  const scrollDownDiv = useRef(null);
  const startButtonEvent = new CustomEvent("startButtonClick");
  const startButton = document.querySelector(".start-btn");

  // Botón start
  const handleClick = () => {
    window.dispatchEvent(startButtonEvent);
  };

  // Change event
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  useEffect(() => {
    const handleStartButtonClick = () => {
      setStartButtonClicked(true);
    };

    window.addEventListener("startButtonClick", handleStartButtonClick);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
    };
  }, []);

  useEffect(() => {
    if (startButtonClicked) {
      startButton.classList.add("inactive");

      gsap.fromTo(
        startButton,
        {
          scale: 1,
          filter: "brightness(100%) blur('0px')",
        },
        {
          scale: 0,
          filter: "brightness(150%) blur('10px')",
          duration: 2,
          ease: "power2.in",
        }
      );
    }
  }, [startButtonClicked]);

  useEffect(() => {
    // Animación de entrada
    const helloText = document.querySelector("#hello-text");
    const split = Splitting({ target: helloText, by: "words" })[0];
    const words = split.words;

    const tl = gsap.timeline({
      onComplete: () => {
        startSecondAnimation();
      },
    });

    gsap.set(words, { opacity: 0 });

    tl.to(words[0], {
      duration: 0.8,
      opacity: 1,
    })
      .to(
        words[1],
        {
          duration: 0.8,
          opacity: 1,
        },
        "+0.4"
      )
      .to({}, { duration: 1 }) // añade una pausa de 2 segundos usando un objeto vacío
      .to(words.slice(2), {
        duration: 0.8,
        opacity: 1,
        stagger: 0.35,
      });

    const startSecondAnimation = () => {
      // Animación alternando títulos
      const span1 = document.querySelector("#hello-title-1");
      const span2 = document.querySelector("#hello-title-2");

      gsap.set(span2, { display: "none" });

      const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1 }); // crea una línea de tiempo que se repite indefinidamente

      tl.to(span1, {
        duration: 1,
        display: "none",
      }).to(span2, {
        duration: 1,
        display: "inline",
      });
    };

    const scroll = () => {
      const fx17Titles = document.querySelectorAll("[data-effect17]");

      fx17Titles.forEach((title) => {
        Splitting({ target: "[data-effect17]", by: "chars" });
        const chars = title.querySelectorAll(".char");

        chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

        gsap.fromTo(
          chars,
          {
            "will-change": "opacity, transform",
            opacity: 1,
            rotateX: 0,
            z: 0,
          },
          {
            ease: "none",
            opacity: 0,
            rotateX: () => gsap.utils.random(-120, 120),
            z: () => gsap.utils.random(-200, 200),

            stagger: 0.02,
            scrollTrigger: {
              trigger: title,
              start: "top 60%",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    };

    // Animación de opacidad para scrollDownDiv
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#scrollable",
        start: "800px top",
        end: "90% center",
        scrub: true,
      },
    });

    scrollTimeline
      .fromTo(scrollDownDiv.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      .to({}, { duration: 2 }) // Agrega un tiempo de espera de 2 segundos
      .to(scrollDownDiv.current, {
        opacity: 0,
        duration: 0.2,
        immediateRender: false,
      });

    scroll();
  }, []);

  return (
    <>
      <p id="hello-text">
        Hello there. Welcome to a <span id="hello-title-1">retrospective </span>
        <span id="hello-title-2">Rodrispective </span>of the music I have been working on
        for almost a lifetime
      </p>
      <p className="content__title" data-splitting data-effect17>
        Yes, a lifetime.
      </p>
      <p className="content__title" data-splitting data-effect17>
        A lifetime of hope and unfulfilled dreams.
      </p>
      <p className="content__title" data-splitting data-effect17>
        Working under different names. In collaboration but mostly solo, from the darkness
        of my bedroom.
      </p>
      <p className="content__title" data-splitting data-effect17>
        Always unreleased.
      </p>
      <p className="content__title" data-splitting data-effect17>
        The time has come to pause, reflect and open up.
      </p>
      <div ref={scrollDownDiv} className="scroll-down">
        Keep scrolling down
      </div>
      <div id="start-container">
        <button
          className="start-btn loader__item"
          data-target-loader="landing"
          data-allow-audio="true"
          data-audio-play="background"
          data-message="Click here to enter with audio"
          onClick={handleClick}
          onPointerEnter={() => setCursorState("large--filled")}
          onPointerLeave={() => setCursorState("default")}
        >
          <svg
            className="loader__svg"
            viewBox="0 0 306.5 306.5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="loader__loaded" style={{ opacity: 1 }}>
              <g className="loaded__circles">
                <circle
                  className="loaded__circle"
                  cx="153.2"
                  cy="153.2"
                  r="152.5"
                  vectorEffect="non-scaling-stroke"
                  data-svg-origin="153.1999969482422 153.1999969482422"
                  transform="matrix(1,0,0,1,0,0)"
                  style={{ transformOrigin: "0px 0px" }}
                ></circle>
                <circle
                  className="loaded__circle"
                  cx="153.2"
                  cy="153.2"
                  r="152.5"
                  vectorEffect="non-scaling-stroke"
                  data-svg-origin="153.1999969482422 153.1999969482422"
                  transform="matrix(0.97,0,0,0.97,4.596,4.596)"
                  style={{ transformOrigin: "0px 0px" }}
                ></circle>
                <circle
                  className="loaded__circle"
                  cx="153.2"
                  cy="153.2"
                  r="152.5"
                  vectorEffect="non-scaling-stroke"
                  data-svg-origin="153.1999969482422 153.1999969482422"
                  transform="matrix(0.94,0,0,0.94,9.192,9.192)"
                  style={{ transformOrigin: "0px 0px" }}
                ></circle>
                <circle
                  className="loaded__circle"
                  cx="153.2"
                  cy="153.2"
                  r="152.5"
                  vectorEffect="non-scaling-stroke"
                  data-svg-origin="153.1999969482422 153.1999969482422"
                  transform="matrix(0.91,0,0,0.91,13.788,13.788)"
                  style={{ transformOrigin: "0px 0px" }}
                ></circle>
                <circle
                  className="loaded__circle"
                  cx="153.2"
                  cy="153.2"
                  r="152.5"
                  vectorEffect="non-scaling-stroke"
                  data-svg-origin="153.1999969482422 153.1999969482422"
                  transform="matrix(0.88,0,0,0.88,18.384,18.384)"
                  style={{ transformOrigin: "0px 0px" }}
                ></circle>
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
