// En CustomCursor.jsx
import { useState, useEffect, useContext } from "react";
import { CursorContext } from "./cursorContext";
import { Vector2 } from "three";
import "./cube.css";

const CustomCursor = () => {
  const { hovered, buttonPlayRef } = useContext(CursorContext);
  const [position, setPosition] = useState({ left: "0px", top: "0px" });
  const [buttonPosition, setButtonPosition] = useState(new Vector2());
  const [cursorSize, setCursorSize] = useState("12px");
  const [cursorClasses, setCursorClasses] = useState("custom-cursor");

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
    const isNearButton = distance < 0.12; // Ajusta este valor como necesites

    // Ajusta el tamaño del cursor en función de si está cerca del botón
    setCursorSize(isNearButton ? "110px" : "12px");
    setCursorClasses(
      `custom-cursor ${hovered ? "hovered" : ""} ${isNearButton ? "near-button" : ""}`
    );

    // Si el cursor está cerca del botón, establece su posición para que coincida con la del botón
    if (isNearButton) {
      setPosition({
        left: `${(buttonPosition.x * window.innerWidth) / 2 + window.innerWidth / 2}px`,
        top: `${(-(buttonPosition.y - 1) * window.innerHeight) / 2}px`,
      });
    } else {
      setPosition({
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
      });
    }
  };

  return (
    <div
      className={cursorClasses}
      style={{ ...position, width: cursorSize, height: cursorSize }}
    />
  );
};

export default CustomCursor;
