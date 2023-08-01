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

  console.log(appTitle.current);
  // Efecto de entrada
  useEffect(() => {
    const chars = gsap.utils.toArray(appTitle.current.querySelectorAll("span.char"));
    chars.forEach((char) => gsap.set(char.parentNode, { perspective: 1000 }));

    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        transformOrigin: "50% 100%",
        opacity: 0,
        rotationX: 90,
      },
      {
        ease: "power4",
        duration: 2,
        delay: 1,
        opacity: 1,
        stagger: {
          each: 0.2,
          from: "random",
        },
        rotationX: 0,
      }
    );
  }, []);

  // Botón start
  const handleClick = () => {
    const event = new CustomEvent("startButtonClick");
    window.dispatchEvent(event);
  };

  return (
    <>
      <h1 data-splitting ref={appTitle}>
        RODRISPECTIVE
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
