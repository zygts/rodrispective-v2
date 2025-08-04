import { useWindowSize } from "./useWindowSize";
import { useMemo } from "react";

export const useBreakpoint = () => {
  const { width } = useWindowSize();

  return useMemo(() => ({
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  }), [width]);
};