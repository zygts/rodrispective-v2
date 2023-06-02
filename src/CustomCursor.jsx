import { useState, useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { CursorContext } from "./cursorContext";
import { Vector2 } from "three";
import "./cube.css";

const CustomCursor = () => {
  const { buttonPlayRef, cursorState, activeCube, setCubeHover } =
    useContext(CursorContext);
  const [buttonPosition, setButtonPosition] = useState(new Vector2());
  const cursorRef = useRef(null);

  useEffect(() => {
    // Función hover sobre cubo
    const cubeHover = () => {
      console.log("Cursor function executed");
    };
    setCubeHover(() => cubeHover);

    // Recoje la posición del botón de play
    const updateButtonPosition = () => {
      if (!buttonPlayRef.current) return;
      const rect = buttonPlayRef.current.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
      const y = (-(rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;
      setButtonPosition(new Vector2(x, y));
    };

    // Mueve el ratón
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", updateButtonPosition);
    updateButtonPosition();
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, [buttonPlayRef, cursorState, activeCube]);

  // Función para detener el cursor sobre el botón de play
  const onMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    const cursorPos = new Vector2(x, y);
    const distance = cursorPos.distanceTo(buttonPosition);
    const isNearButton = distance < 0.07 && activeCube !== null; // check if a cube is active
    const cursorSize = isNearButton ? "110px" : "12px";

    cursorRef.current.style.width = cursorSize;
    cursorRef.current.style.height = cursorSize;
    cursorRef.current.className = `custom-cursor ${cursorState}`;

    if (isNearButton) {
      gsap.to(cursorRef.current, {
        left: `${(buttonPosition.x * window.innerWidth) / 2 + window.innerWidth / 2}px`,
        top: `${(-(buttonPosition.y - 1) * window.innerHeight) / 2}px`,
        ease: "power4.out",
        duration: 0.15,
      });
    } else {
      gsap.to(cursorRef.current, {
        left: `${e.clientX}px`,
        top: `${e.clientY}px`,
        ease: "power4.out",
        duration: 0.15,
      });
    }
  };

  // Devuelve el cursor con su clase aplicada
  return <div ref={cursorRef} className={`custom-cursor ${cursorState}`} />;
};

export default CustomCursor;
