import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { gsap } from "gsap";
import { AppContext } from "./appContext";
import { Vector2 } from "three";

const CustomCursor = () => {
  const {
    buttonPlayRef,
    cursorState,
    activeCube,
    setCubeHover,
    setCursorPosition,
  } = useContext(AppContext);

  const cursorRef = useRef(null);
  const buttonCenterRef = useRef(new Vector2());

  // 🧠 Función que se asigna para el hover en un cubo
  const handleCubeHover = useCallback(() => {
    console.log("hover");
  }, []);

  // 🧠 Actualiza posición del botón de play en espacio normalizado (-1 a 1)
  const updateButtonPosition = useCallback(() => {
    const btn = buttonPlayRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
    const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1;

    buttonCenterRef.current.set(x, y);
  }, [buttonPlayRef]);

  // 🖱 Evento de movimiento del ratón
  const onMouseMove = useCallback(
    (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      const currentPos = new Vector2(x, y);

      setCursorPosition({ x, y });

      const distance = currentPos.distanceTo(buttonCenterRef.current);
      const isNearButton = distance < 0.09 && activeCube !== null;
      const cursorSize = isNearButton ? "120px" : "12px";

      const targetX = isNearButton
        ? (buttonCenterRef.current.x * window.innerWidth) / 2 + window.innerWidth / 2
        : e.clientX;

      const targetY = isNearButton
        ? (-(buttonCenterRef.current.y - 1) * window.innerHeight) / 2
        : e.clientY;

      const cursorEl = cursorRef.current;

      // Actualiza tamaño
      cursorEl.style.width = cursorSize;
      cursorEl.style.height = cursorSize;

      // Clase actualizada
      cursorEl.className = `custom-cursor ${cursorState}`;

      // Movimiento animado
      gsap.to(cursorEl, {
        left: `${targetX}px`,
        top: `${targetY}px`,
        ease: "power4.out",
        duration: 0.17,
      });
    },
    [cursorState, activeCube, setCursorPosition]
  );

  // ⛓️ Setup
  useEffect(() => {
    setCubeHover(() => handleCubeHover);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", updateButtonPosition);

    // Inicializa posición del botón al montar
    updateButtonPosition();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", updateButtonPosition);
    };
  }, [handleCubeHover, onMouseMove, updateButtonPosition, setCubeHover]);

  return <div ref={cursorRef} className={`custom-cursor ${cursorState}`} />;
};

export default CustomCursor;
