import { useEffect, useRef, useContext } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useTextLinesReveal from "./useTextLinesReveal";
import { AppContext } from "./appContext";
import { useBreakpoint } from "./hooks/useBreakpoint"; 

import "./styles/contact.css";

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const { isTabletTouch } = useBreakpoint();
  const { setCursorState } = useContext(AppContext);
  
  const containerRef = useRef(null);
  const previewRef = useRef(null);
  const gridRef = useRef(null);
  const backCtrlRef = useRef(null);
  const contentRef = useRef(null);
  const textRefs = useRef({});
  const gridTimeline = useRef(null);

  const { animateIn, animateOut } = useTextLinesReveal(textRefs);

    // Función para calcular la transformación inicial de las imágenes en la cuadrícula
    const calculateInitialTransform = (element, offsetDistance = 150, maxRotation = 100, maxZTranslation = 800) => {
      const viewportCenter = { width: window.innerWidth / 2, height: window.innerHeight / 2 };
      const elementCenter = { 
        x: element.getBoundingClientRect().left + element.offsetWidth / 2, 
        y: element.getBoundingClientRect().top + element.offsetHeight / 2 
      };
    
      const angle = Math.atan2(
        Math.abs(viewportCenter.height - elementCenter.y), 
        Math.abs(viewportCenter.width - elementCenter.x)
      );
    
      const translateX = Math.abs(Math.cos(angle) * offsetDistance);
      const translateY = Math.abs(Math.sin(angle) * offsetDistance);
      const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));
      const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));
      const distanceFactor = currentDistance / maxDistance;
    
      return {
        x: elementCenter.x < viewportCenter.width ? -translateX * 0.6 : translateX * 0.6,
        y: elementCenter.y < viewportCenter.height ? -translateY * 0.6 : translateY * 0.6,
        z: maxZTranslation * distanceFactor * 0.5,
        rotateX: ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor * 0.5),
        rotateY: ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor * 0.5)
      };
    };    
  
    // Animación de entrada de la cuadrícula
    const animateFourthGrid = () => {
      const grid = gridRef.current;
      const gridImages = grid.querySelectorAll('.grid__img');
  
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (gridTimeline.current) gridTimeline.current.kill();
  
      // Asegurar que la opacidad y la escala estén en los valores iniciales ANTES de animar
      gsap.set(gridImages, { autoAlpha: 0, scale: 0.7 });
  
      gridTimeline.current = gsap.timeline({
        defaults: { ease: "expo" },
        scrollTrigger: {
          trigger: grid,
          start: "center center",
          end: "+=200%",
          pin: grid.parentNode,
          scrub: 0.2,
        },
      })
      .set(grid, { perspective: 1000 })
      .fromTo(
        gridImages,
        {
          x: (_, el) => calculateInitialTransform(el).x,
          y: (_, el) => calculateInitialTransform(el).y,
          z: (_, el) => calculateInitialTransform(el).z * 0.8,
          rotateX: (_, el) => calculateInitialTransform(el).rotateX * 0.5,
          rotateY: (_, el) => calculateInitialTransform(el).rotateY * 0.5,
          autoAlpha: 0, // Forzar la opacidad a 0
          scale: 0.7, // Forzar la escala a 0.1
        },
        {
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          autoAlpha: 1, // Asegurar que la opacidad llega a 1
          scale: 1, // Asegurar que la escala llega a 1
          stagger: { amount: 0.2, from: "center", grid: [4, 9] },
          onComplete: () => ScrollTrigger.refresh(), // Forzar actualización después de la animación
        }
      );
    };

  // Animación de salida de la cuadrícula
  const reverseAnimateFourthGrid = () => {
    const grid = gridRef.current;
    const gridImages = grid.querySelectorAll('.grid__img');

    gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 1 },
      onComplete: () => {
        gsap.set(gridImages, { autoAlpha: 0, scale: 0.7, y: 50 });
        ScrollTrigger.refresh();
      }
    })
    .to(gridImages, {
      x: (_, el) => calculateInitialTransform(el).x,
      y: (_, el) => calculateInitialTransform(el).y,
      z: (_, el) => calculateInitialTransform(el).z * 0.8,
      rotateX: (_, el) => calculateInitialTransform(el).rotateX * 0.5,
      rotateY: (_, el) => calculateInitialTransform(el).rotateY * 0.5,
      autoAlpha: 0,
      scale: 0.7,
      stagger: { amount: 0.35, from: "center", grid: [4, 9] }
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    const preview = previewRef.current;
    const grid = gridRef.current;
    const backCtrl = backCtrlRef.current;
    const content = contentRef.current;
    const triggerButton = document.querySelector(".about-link");

    const overlayRows = container.querySelectorAll(".overlay__row");
    const innerElements = preview.querySelectorAll(".oh__inner");
    const previewImage = preview.querySelector(".preview__img");
    const previewImageInner = preview.querySelector(".preview__img-inner");

    const openPreview = () => {
      window.scrollTo({ top: 0, behavior: "instant" });

      container.style.removeProperty("display");

      gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } })
        .add(() => {
          content.classList.add("content--hidden");
          animateFourthGrid();
        }, "start")
        .set([innerElements, backCtrl], { opacity: 0 }, "start")
        .to(overlayRows, { scaleY: 1 }, "start")
        .add(() => {
          container.classList.add("preview-visible");
          preview.classList.add("preview--current");
          animateIn.current();
        }, "start+=0.6")
        .to([previewImage, previewImageInner], { y: "0%" }, "start+=0.6")
        .to(innerElements, { yPercent: 0, opacity: 1 }, "start+=0.9")
        .to(backCtrl, { opacity: 1 }, "start+=1");
    };

    const closePreview = () => {
      gsap.timeline({ defaults: { duration: 1, ease: "power3.inOut" } })
        .to(innerElements, { yPercent: -101, opacity: 0 }, "start")
        .to(backCtrl, { opacity: 0 }, "start")
        .to(previewImage, { y: "101%" }, "start")
        .to(previewImageInner, { y: "-101%" }, "start")
        .add(() => {
          animateOut.current();
          reverseAnimateFourthGrid();
        }, "start+=0.6")
        .to(overlayRows, {
          scaleY: 0,
          onComplete: () => {
            preview.classList.remove("preview--current");
            container.classList.remove("preview-visible");
            content.classList.remove("content--hidden");
            container.style.display = "none";
            ScrollTrigger.refresh();
          },
        }, "start+=0.6");
    };

    triggerButton.addEventListener("click", openPreview);
    backCtrl.addEventListener("click", closePreview);

    return () => {
      triggerButton.removeEventListener("click", openPreview);
      backCtrl.removeEventListener("click", closePreview);
    };
  }, [animateIn, animateOut]);

  return (
    <main style={{ display: "none" }} id="about-page" ref={containerRef} data-scrollable>
      <div className="content" ref={contentRef}>
      </div>
      <div className="overlay">
        <div className="overlay__row"></div>
        <div className="overlay__row"></div>
      </div>
      <section className="previews">
        <div className="preview" ref={previewRef}>
          <button className="unbutton preview__back" ref={backCtrlRef} 
          onPointerEnter={() => setCursorState("large")}
          onPointerLeave={() => setCursorState("default")}>
            <svg width="100px" height="18px" viewBox="0 0 50 9">
              <path vectorEffect="non-scaling-stroke" d="m0 4.5 5-3m-5 3 5 3m45-3h-77"></path>
            </svg>
          </button>
          <div className="preview__img">
            <div className="preview__img-inner" style={{ backgroundImage: "url(img/about-page/bg.jpg)" }}></div>
          </div>
          <h2 className="preview__title oh">
            <span className="oh__inner">My Story</span>
          </h2>
          <div className="preview__column preview__column--start">
            <span className="preview__column-title preview__column-title--main oh">
              <span className="oh__inner">From raw home recordings to digital landscapes</span>
            </span>
            {[
              "Music has always been a big part of my life. Since I was a kid, I’ve been making up melodies, turning thoughts and feelings into songs, even before I fully understood what I was doing.",
              "At around 18 years old, I started recording at home with whatever equipment I could get my hands on—an old computer and a secondhand microphone. It wasn’t much, but it was enough to bring my ideas to life. For the next two decades, I continued making music—not for recognition, but because I couldn’t imagine not doing it. The songs kept coming, even when no one was listening.",
              "Life, as it often does, took me down other roads. But the creative spark never faded—it simply found new forms: web design, development, and art. In a way, they all feel connected, different ways of building and expressing ideas.",
              "This website is a mix of all those things—a place where my interests in music, art, and digital creation come together.",
              "A little homage to myself and the creative work I’ve pursued for most of my life.",
            ].map((text, i) => (
              <p key={i} ref={(el) => (textRefs.current[i] = el)}>
                {text}
              </p>
            ))}
          </div>
          {!isTabletTouch && (
            <section className="images-content images-content--padded images-content--full">
              <div className="grid grid--spaced grid--small" ref={gridRef} data-grid-fourth>
                {Array.from({ length: 36 }).map((_, i) => {
                  const fileNumber = (i + 1).toString().padStart(2, "0"); // "01", "02", ..., "36"
                  return (
                    <div
                      key={i}
                      className="grid__img"
                      style={{ backgroundImage: `url(img/about-page/rodri_${fileNumber}.jpg)` }}
                    ></div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
