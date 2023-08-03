import "./styles/intro.css";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function IntroContent() {
  const appTitle = useRef(null);

  // Efecto de entrada
  useEffect(() => {
    const tl = gsap.timeline();

    // selecciona todas las líneas
    const lines = gsap.utils.toArray(appTitle.current.querySelectorAll("span.line"));
    const offset = window.innerHeight / (lines.length - 1);

    tl.from(appTitle.current, {
      opacity: 0,
      delay: 1,
      duration: 4,
    });

    // Define los settings iniciales
    const settings = { wdth: 100, wght: 200 };

    // Agrega la segunda animación al timeline
    tl.to(settings, {
      duration: 1,
      delay: 1,
      wdth: 800,
      wght: 100,
      onUpdate: () => {
        // se llama en cada actualización de la animación
        appTitle.current.style.fontVariationSettings = `'wdth' ${settings.wdth}, 'wght' ${settings.wght}`;
      },
    });

    ScrollTrigger.create({
      trigger: "h1",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // movemos cada línea según el progreso del scroll
        lines.forEach((line, i) => {
          gsap.to(line, {
            y: progress * (i * offset - window.innerHeight / 2),
            immediateRender: true,
          });
        });
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
