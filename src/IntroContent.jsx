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

  // state for the array of lines found after running Splitting
  const [lines, setLines] = useState([]);

  useEffect(() => {
    paragraphs.current.forEach((paragraph, index) => {
      // run the SplittingJS magic here, using 'words' as the splitting technique
      let split_res = Splitting({
        target: paragraph,
        by: "words",
      });
      // finding the first block of text and its lines - then assigning it to our state defined above
      setLines((prevLines) => {
        const newLines = [...prevLines];
        newLines[index] = split_res[0].lines;
        return newLines;
      });
    });
  }, []);

  // Efecto scroll en párrafos
  useEffect(() => {
    paragraphs.current.forEach((paragraph) => {
      const words = gsap.utils.toArray(paragraph.querySelectorAll("span"));
      words.forEach((word) => gsap.set(word, { opacity: 0.1 }));

      const tl2 = gsap.timeline(); // crea un nuevo timeline

      // Agrega la primera animación al timeline
      tl2.to(words, {
        opacity: 1,
        y: -10,
        duration: 1,
        ease: "power5",
        stagger: 0.2,
        scrollTrigger: {
          trigger: paragraph,
          start: "top 65%",
          end: "top 35%",
          scrub: 1,
        },
      });
    });
  }, []);

  // Botón start
  const handleClick = () => {
    const event = new CustomEvent("startButtonClick");
    window.dispatchEvent(event);
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

      <div ref={scrollDownDiv} className="scroll-down">
        Please scroll down to begin
      </div>
      <p
        style={{ marginTop: "60vh" }}
        data-splitting
        ref={(el) => (paragraphs.current[0] = el)}
      >
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p data-splitting ref={(el) => (paragraphs.current[1] = el)}>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p data-splitting ref={(el) => (paragraphs.current[2] = el)}>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p data-splitting ref={(el) => (paragraphs.current[3] = el)}>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <button id="start-button" onClick={handleClick}>
        START EXPLORING
      </button>
    </>
  );
}

export default IntroContent;
