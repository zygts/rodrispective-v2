import { createContext, useState, useRef } from "react";

export const CursorContext = createContext();

export const CursorContextProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState("default");
  const [activeCube, setActiveCube] = useState(null);
  const buttonPlayRef = useRef();

  return (
    <CursorContext.Provider
      value={{
        cursorState,
        setCursorState,
        buttonPlayRef,
        activeCube,
        setActiveCube,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
