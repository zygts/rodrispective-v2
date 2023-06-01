import { createContext, useState, useRef } from "react";

export const CursorContext = createContext();

export const CursorContextProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState("default");
  const buttonPlayRef = useRef();

  return (
    <CursorContext.Provider value={{ cursorState, setCursorState, buttonPlayRef }}>
      {children}
    </CursorContext.Provider>
  );
};
