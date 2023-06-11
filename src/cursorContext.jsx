import { createContext, useState, useRef } from "react";

export const CursorContext = createContext();

export const CursorContextProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState("default");
  const [activeCube, setActiveCube] = useState(null);
  const buttonPlayRef = useRef();
  const [cubeHover, setCubeHover] = useState(() => () => {}); // Definimos un estado para myFunction
  const [audio, setAudio] = useState(null); // Nuevo estado para el audio

  return (
    <CursorContext.Provider
      value={{
        cursorState,
        setCursorState,
        buttonPlayRef,
        activeCube,
        setActiveCube,
        cubeHover,
        setCubeHover,
        audio, // Agregamos audio al valor del proveedor
        setAudio, // Permitir cambiar el audio desde otros componentes
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
