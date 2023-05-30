// En CustomCursor.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { CursorContext } from "./cursorContext";
import { Vector2 } from "three";
import "./cube.css";

const CustomCursor = () => {
  const { hovered, buttonPlayRef } = useContext(CursorContext);
  const [position, setPosition] = useState({ left: "0px", top: "0px" });
  const [buttonPosition, setButtonPosition] = useState(new Vector2());
  const cursorRef = useRef(null);

  useEffect(() => {
    const updateButtonPosition = () => {
      if (!buttonPlayRef.current) return;

      const rect = buttonPlayRef.current.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = (-(rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      setButtonPosition(new Vector2(x, y));
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", updateButtonPosition);
    updateButtonPosition();
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, [buttonPlayRef]);

  const onMouseMove = (e) => {
    const x = (e.pageX / window.innerWidth) * 2 - 1;
    const y = -(e.pageY / window.innerHeight) * 2 + 1;
    const cursorPos = new Vector2(x, y);
    const distance = cursorPos.distanceTo(buttonPosition);
    const isNearButton = distance < 0.07; // Ajusta este valor como necesites

    const cursorSize = isNearButton ? "110px" : "12px";
    const cursorClasses = `custom-cursor ${hovered ? "hovered" : ""} ${
      isNearButton ? "near-button" : ""
    }`;

    if (isNearButton) {
      gsap.to(cursorRef.current, {
        left: `${(buttonPosition.x * window.innerWidth) / 2 + window.innerWidth / 2}px`,
        top: `${(-(buttonPosition.y - 1) * window.innerHeight) / 2}px`,
        ease: "power4.out",
        duration: 0.15,
      });
    } else {
      gsap.to(cursorRef.current, {
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
        ease: "power4.out",
        duration: 0.15,
      });
    }

    cursorRef.current.style.width = cursorSize;
    cursorRef.current.style.height = cursorSize;
    cursorRef.current.className = cursorClasses;
  };

  return <div ref={cursorRef} className="custom-cursor" style={position} />;
};

export default CustomCursor;
