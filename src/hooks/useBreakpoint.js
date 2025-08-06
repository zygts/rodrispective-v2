import { useWindowSize } from "./useWindowSize";
import { useMemo, useState, useEffect } from "react";

export const useBreakpoint = () => {
  const { width } = useWindowSize();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => (
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
    setIsTouchDevice(checkTouchDevice());
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1366;
  const isDesktop = width >= 1366;

  const isTouch = isTouchDevice && (isMobile || isTablet);
  const isTabletTouch = isTouchDevice && isTablet;

  return useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isTabletTouch,
  }), [isMobile, isTablet, isDesktop, isTouch, isTabletTouch]);
};
