import { useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AppContext } from "./appContext";

const Header = () => {
  const { setCursorState } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleStartButtonClick = () => {
      setIsVisible(true);
    };

    window.addEventListener("startButtonClick", handleStartButtonClick);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
    };
  }, []);

  useEffect(() => {
    if (isVisible && headerRef.current) {
      gsap.fromTo(headerRef.current, 
        { autoAlpha: 0, y: -50 },
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", delay: 4 }
      );
    }
  }, [isVisible]);

  return (
    <header ref={headerRef} className="header" style={{ visibility: isVisible ? "visible" : "hidden" }}>
      <nav>
        <span
          className="about-link"
          onPointerEnter={() => setCursorState("large--filled-red")}
          onPointerLeave={() => setCursorState("default")}
        >
          My Story
        </span>
        <span
          className="contact-link"
          onPointerEnter={() => setCursorState("large--filled-red")}
          onPointerLeave={() => setCursorState("default")}
        >
          Contact Me
        </span>
      </nav>
    </header>
  );
};

export default Header;
