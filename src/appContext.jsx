import { createContext, useState, useRef, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [cursorState, setCursorState] = useState("default");
  const [activeCube, setActiveCube] = useState(null);
  const buttonPlayRef = useRef();
  const [cubeHover, setCubeHover] = useState(() => () => {});
  const [audio, setAudio] = useState(null);
  const [introOn, setIntroOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        cursorState,
        setCursorState,
        buttonPlayRef,
        activeCube,
        setActiveCube,
        cubeHover,
        setCubeHover,
        audio,
        setAudio,
        introOn,
        setIntroOn,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
