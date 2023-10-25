import "./styles/intro.css";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

import { ScrollTrigger } from "gsap/ScrollTrigger";

function IntroContent() {
  const appTitle = useRef(null);
  const scrollDownDiv = useRef(null);
  const paragraphs = useRef([]);
  const displacementScaleRef = useRef(null);
  const firstLine = useRef(null);

  // Botón start
  const handleClick = () => {
    const event = new CustomEvent("startButtonClick");
    window.dispatchEvent(event);
  };

  useEffect(() => {
    //Animación de entrada
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
        "<0.75"
      )
      .to({}, { duration: 1 }) // añade una pausa de 2 segundos usando un objeto vacío
      .to(words.slice(2), {
        duration: 0.8,
        opacity: 1,
        stagger: 0.5,
      });
  }, []);

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

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter
          id="filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="linearRGB"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01 0.05"
            numOctaves="2"
            seed="2"
            stitchTiles="noStitch"
            result="turbulence"
          />
          <feDisplacementMap
            ref={displacementScaleRef}
            in="SourceGraphic"
            in2="turbulence"
            scale="0"
            xChannelSelector="G"
            yChannelSelector="A"
            result="displacementMap"
          />
        </filter>
      </svg>

      <p id="hello-text">
        Hello there. Welcome to a <span id="hello-title-1">retrospective </span>
        <span id="hello-title-2">Rodrispective </span>of the music I have been working on
        for almost a lifetime
      </p>
      <p>Yes, a lifetime.</p>
      <p>A lifetime of hope and unfulfilled dreams.</p>
      <p>
        Working under different names. In collaboration but mostly solo, from the darkness
        of my bedroom.
        <p>Always unreleased.</p>
      </p>
      <p>The time has come to pause, reflect and open up.</p>
      <button>Start exploring</button>
      <div ref={scrollDownDiv} className="scroll-down">
        Please scroll down to begin
      </div>
    </>
  );
}

export default IntroContent;
