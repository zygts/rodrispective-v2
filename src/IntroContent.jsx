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
