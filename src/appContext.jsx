import { createContext, useState, useRef, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children, value }) => {
  const [cursorState, setCursorState] = useState("default");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeCube, setActiveCube] = useState(null);
  const buttonPlayRef = useRef();
  const [cubeHover, setCubeHover] = useState(() => () => {});
  const [audio, setAudio] = useState(null);
  const [introOn, setIntroOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [canStartIntroAnimations, setCanStartIntroAnimations] = useState(false);
  const [introAnimationsPlayed, setIntroAnimationsPlayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        cursorState,
        setCursorState,
        cursorPosition,
        setCursorPosition,
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
        isPlaying,
        setIsPlaying,
        showIntro,
        setShowIntro,
        startButtonClicked,
        setStartButtonClicked,
        canStartIntroAnimations,
        setCanStartIntroAnimations,
        introAnimationsPlayed,
        setIntroAnimationsPlayed,
        ...value,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
