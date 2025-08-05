import { useEffect } from "react";
import { useBreakpoint } from "./useBreakpoint";

export const usePreventTouchGestures = () => {
  const { isTablet, isMobile } = useBreakpoint();

  useEffect(() => {
    if (!isTablet && !isMobile) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length > 1) {
        // Prevenir zoom con doble tap
        e.preventDefault();
      }

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const target = e.target;

      // Permitir scroll si está dentro de un contenedor marcado como scrollable
      const isScrollable = target.closest("[data-scrollable]");
      if (!isScrollable) {
        e.preventDefault();
      }

      // Prevenir swipe de navegación (iOS)
      const diffX = startX - e.touches[0].clientX;
      const diffY = startY - e.touches[0].clientY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isTablet, isMobile]);
};
