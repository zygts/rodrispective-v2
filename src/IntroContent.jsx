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

      <h1>Rodrispective</h1>
      <p id="hello-text">
        Hello there. Welcome to a <span>retrospective</span> of the music I have been
        working on for almost a lifetime
      </p>
      <div ref={scrollDownDiv} className="scroll-down">
        Please scroll down to begin
      </div>
      <p>Yes, a lifetime. </p>
      <p>Yes, a lifetime. </p>
      <p>Yes, a lifetime. </p>
      <p>Yes, a lifetime. </p>
      <p>Yes, a lifetime. </p>
    </>
  );
}

export default IntroContent;
