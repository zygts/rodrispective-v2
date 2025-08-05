import { useEffect, useState, useContext } from "react";
import { AppContext } from "./appContext";
import "./OrientationWarning.css";

const OrientationWarning = () => {
  const { setCanStartIntroAnimations } = useContext(AppContext);
  const [isPortrait, setIsPortrait] = useState(false);

  const checkOrientation = () => {
    const portrait = window.innerHeight > window.innerWidth;
    setIsPortrait(portrait);
    setCanStartIntroAnimations(!portrait);
  };

  useEffect(() => {
    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <div className="orientation-warning">
      <div className="orientation-warning__content">
        <p>
          Please rotate your phone to landscape mode. For the best experience, consider using a desktop device.
        </p>
        <img
          src="./img/mobile-landscape-mode-icon.svg"
          alt="Rotate your device"
          className="orientation-icon"
        />
      </div>
    </div>
  );
};

export default OrientationWarning;
