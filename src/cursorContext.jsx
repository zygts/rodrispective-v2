import { createContext, useState, useRef } from "react";

export const CursorContext = createContext();

export const CursorContextProvider = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  const buttonPlayRef = useRef();

  return (
    <CursorContext.Provider value={{ hovered, setHovered, buttonPlayRef }}>
      {children}
    </CursorContext.Provider>
  );
};
