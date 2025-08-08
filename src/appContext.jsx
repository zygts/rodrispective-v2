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

  const [globalAudio, setGlobalAudio] = useState(null);
  const [playingCubeIndex, setPlayingCubeIndex] = useState(null);
  const audioContextRef = useRef(null);

  // AÑADIR: Función para detener cualquier audio que esté reproduciéndose
  const stopAllAudio = () => {
    if (globalAudio && globalAudio.element) {
      globalAudio.element.pause();
      globalAudio.element.currentTime = 0;
    }
    setIsPlaying(false);
    setPlayingCubeIndex(null);
  };

  // AÑADIR: Función para reproducir audio de un cubo específico
  const playAudio = (cubeIndex, audioData) => {
    // Detener cualquier audio anterior
    stopAllAudio();
    
    // Reproducir el nuevo audio
    setGlobalAudio(audioData);
    setIsPlaying(true);
    setPlayingCubeIndex(cubeIndex);
    
    if (audioData && audioData.element) {
      audioData.element.play().catch(error => {
        console.warn("Audio play failed:", error);
        setIsPlaying(false);
        setPlayingCubeIndex(null);
      });
    }
  };

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
        globalAudio,
        setGlobalAudio,
        isPlaying,
        playingCubeIndex,
        setPlayingCubeIndex,
        audioContextRef,
        stopAllAudio,
        playAudio,
        ...value,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
