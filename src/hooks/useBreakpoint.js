import { useWindowSize } from "./useWindowSize";
import { useMemo, useState, useEffect } from "react";

export const useBreakpoint = () => {
  const { width } = useWindowSize();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        "ontouchstart" in window || 
        navigator.maxTouchPoints > 0 || 
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouchDevice(checkTouchDevice());
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1366;
  const isDesktop = width >= 1366;

  const isTouch = isTouchDevice && (isMobile || isTablet);

  return useMemo(
    () => ({
      isMobile,
      isTablet,
      isDesktop,
      isTouch, // ✅ Nuevo: true solo si es touch + tamaño mobile/tablet
    }),
    [isMobile, isTablet, isDesktop, isTouchDevice]
  );
};
