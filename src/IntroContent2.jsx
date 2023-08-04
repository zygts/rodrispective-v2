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

  // Efecto de entrada
  useEffect(() => {
    const tl = gsap.timeline();

    // selecciona todas las líneas
    const lines = gsap.utils.toArray(appTitle.current.querySelectorAll("span.line"));
    const offset = window.innerHeight / (lines.length - 1);

    gsap.set(scrollDownDiv.current, {
      opacity: 0,
    });
    gsap.to(scrollDownDiv.current, {
      opacity: 1,
      duration: 2,
      delay: 4,
    });

    tl.from(
      appTitle.current,
      {
        opacity: 0,
        duration: 4,
      },
      0
    );

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
      start: "0.1% top",
      end: "50% top",
      // markers: true,
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

        // Solo desvanece el div si el scroll ha comenzado
        if (self.isActive) {
          gsap.to(scrollDownDiv.current, {
            opacity: 1 - progress * 2,
            immediateRender: true,
            overwrite: true,
          });
        }
      },
    });

    ScrollTrigger.create({
      trigger: "h1",
      start: "1% top",
      end: "bottom top",
      // markers: true,
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;

        // rota cada línea según el progreso del scroll
        lines.forEach((line, i) => {
          gsap.to(line, {
            rotationZ: progress * 180,
            transformOrigin: "50% 50%", // establece el origen de la transformación
            immediateRender: true,
          });
        });
      },
    });
  }, []);

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
      <h1 ref={appTitle}>
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
      <div ref={scrollDownDiv} className="scroll-down">
        Start scrolling down to begin
      </div>
      <p data-splitting ref={(el) => (paragraphs.current[0] = el)}>
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
        Explore
      </button>
    </>
  );
}

export default IntroContent;
