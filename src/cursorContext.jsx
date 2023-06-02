import { createContext, useState, useRef } from "react";

export const CursorContext = createContext();

export const CursorContextProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState("default");
  const [activeCube, setActiveCube] = useState(null);
  const buttonPlayRef = useRef();
  const [cubeHover, setCubeHover] = useState(() => () => {}); // Definimos un estado para myFunction

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
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
