import { useEffect, useState } from "react";
import "./OrientationWarning.css";

const OrientationWarning = () => {
  const [showWarning, setShowWarning] = useState(false);

  const checkOrientation = () => {
    const isMobile = window.innerWidth <= 1024;
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;

    setShowWarning(isMobile && isPortrait);
  };

  useEffect(() => {
    checkOrientation(); // check on mount

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="orientation-warning">
      <div className="orientation-warning__content">
        <p>
          Please rotate your phone to landscape mode. For the full experience, consider using a desktop device.
        </p>
        <img
          src="./mobile-landscape-mode-icon.svg"
          alt="Rotate your device"
          className="orientation-icon"
        />
      </div>
    </div>
  );
};

export default OrientationWarning;
