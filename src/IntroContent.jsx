import "./styles/intro.css";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

function IntroContent() {
  const appTitle = useRef(null);

  // state for the array of lines found after running Splitting
  const [lines, setLines] = useState([]);
  useEffect(() => {
    if (appTitle) {
      // run the SplittingJS magic here, using 'lines' as the splitting technique
      let split_res = Splitting({
        by: "chars",
      });
      // finding the first block of text and its lines - then assigning it to our state defined above
      setLines(split_res[0].lines);
    }

    Splitting();
  }, [appTitle]);

  // Efecto de entrada
  useEffect(() => {
    const chars = gsap.utils.toArray(
      appTitle.current.querySelectorAll("span.line span.char")
    );
    chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

    const tl = gsap.timeline(); // crea un nuevo timeline

    // Agrega la primera animación al timeline
    tl.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        opacity: 0.5,
        rotateX: () => gsap.utils.random(-180, 180),
        z: () => gsap.utils.random(-1000, 1000),
      },
      {
        ease: "power5",
        duration: 1.7,
        opacity: 1,
        rotateX: 0,
        z: 0,
        stagger: 0.02,
      }
    );

    // Define los settings iniciales
    const settings = { wdth: 100, wght: 200 };

    // Agrega la segunda animación al timeline
    tl.to(settings, {
      duration: 1,
      wdth: 800,
      wght: 100,
      onUpdate: () => {
        // se llama en cada actualización de la animación
        appTitle.current.style.fontVariationSettings = `'wdth' ${settings.wdth}, 'wght' ${settings.wght}`;
      },
    });
  }, []);

  // Botón start
  const handleClick = () => {
    const event = new CustomEvent("startButtonClick");
    window.dispatchEvent(event);
  };

  return (
    <>
      <h1 data-splitting ref={appTitle}>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
        <span className="line">RODRISPECTIVE</span>
      </h1>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <p>
        Few people know about this, but I’ve been making music for as long as I can
        remember. Under different names, in collaboration but mostly solo, in the darkness
        of my bedroom. Always unreleased.
      </p>
      <button id="start-button" onClick={handleClick}>
        Explore
      </button>
    </>
  );
}

export default IntroContent;
