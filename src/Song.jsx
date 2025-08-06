import { useRef, useEffect, useMemo, useState, useContext, useCallback } from "react";
import { Vector2, Vector3, BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

import CubeAnimations from "./Helpers/CubeAnimations";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { AppContext } from "./appContext";
import { useBreakpoint } from "./hooks/useBreakpoint";

export default function Cube({
  index,
  onClick,
  radius,
  texture,
  content,
  isAnimationFinished,
  onBackClick,
  resetCamera,
  instructionsAnimationComplete, // Nueva prop necesaria
}) {
  const { isTabletTouch } = useBreakpoint();

  const angle = (index / 25) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const position = new Vector3(x, 0, z);

  const materialRef = useRef();
  const meshRef = useRef();
  const buttonPlayRef = useRef();

  const [initialRotation, setInitialRotation] = useState(null);
  const [showHtml, setShowHtml] = useState(false);
  const [hasInitialAnimationRun, setHasInitialAnimationRun] = useState(false); // Para controlar la animación inicial en móvil
  
  const {
    setCursorState,
    activeCube,
    setAudio,
    audio,
    isPlaying,
    setIsPlaying,
    cursorPosition,
  } = useContext(AppContext);

  const handleLinkEnter = useCallback(() => {
    setCursorState("large--filled-red");
  }, [setCursorState]);

  const handleLinkLeave = useCallback(() => {
    setCursorState("default");
  }, [setCursorState]);

  const [audioCtx, setAudioCtx] = useState(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(new Vector3(0, 0, 0));
      setInitialRotation(meshRef.current.rotation.z);
    }
  }, []);

  // Animación inicial para móvil/tablet - aparece después de 6 segundos de completarse Instructions
  useEffect(() => {
    if (isTabletTouch && !hasInitialAnimationRun && instructionsAnimationComplete) {
      // En móvil/tablet, hacer visible el div desde el inicio
      setIsDivVisible(true);
      
      const timer = setTimeout(() => {
        if (titleRef.current && authorRef.current && yearRef.current) {
          gsap.to([titleRef.current, authorRef.current, yearRef.current], {
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
          });
          setHasInitialAnimationRun(true);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isTabletTouch, hasInitialAnimationRun, instructionsAnimationComplete]);

  // Click en la canción
  const handleClick = useCallback((event) => {
    event.stopPropagation();
    onClick(index);

    // Crear o reanudar el AudioContext en respuesta al clic del usuario
    if (!audioCtx) {
      const newAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(newAudioCtx);
      setAudio(newAudioCtx);
    } else if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    gsap.to([titleRef.current, authorRef.current, yearRef.current], {
      opacity: 0,
      duration: 0.3,
    });
  }, [index, onClick, audioCtx, isTabletTouch]);

  // Retrasa la aparición del HTML para evitar flash
  useEffect(() => {
    let timeout;
    if (activeCube === index && isAnimationFinished) {
      timeout = setTimeout(() => setShowHtml(true), 100);
    } else {
      setShowHtml(false);
    }
    return () => clearTimeout(timeout);
  }, [activeCube, index, isAnimationFinished]);

  // Shaders
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uFrequency: { value: new Vector2(9, 9) },
      uDistortCircular: { value: 0 },
      uRadius: { value: 0.3 },
      noiseScale: { value: 5.0 },
      noiseStrength: { value: 0.0 },
      uDarken: { value: 1.0 },
    }),
    [texture]
  );

  // Estado para controlar la visibilidad del div
  const [isDivVisible, setIsDivVisible] = useState(false);

  // Referencias para los elementos de la preview
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const yearRef = useRef(null);
  const elementRef = useRef(null);
  
  // Animación de Preview
  let tlPreview = useRef(null);

  const createTimeline = () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      // En móvil/tablet, no cambiar la opacidad en hover
      if (isTabletTouch) {
        tlPreview.current = gsap
          .timeline({ paused: true })
          .to([titleRef.current, authorRef.current, yearRef.current], {
            x: 20,
            duration: 0.3,
            stagger: 0.12,
            ease: "power3.inOut",
          });
      } else {
        // Comportamiento original para desktop
        tlPreview.current = gsap
          .timeline({ paused: true })
          .to([titleRef.current, authorRef.current, yearRef.current], {
            opacity: 1,
            x: 20,
            duration: 0.3,
            stagger: 0.12,
            ease: "power3.inOut",
          });
      }
    }
  };

  const cubeHover = () => {
    if (!isTabletTouch) {
      // En desktop, controlar la visibilidad normalmente
      setIsDivVisible(true);
    }
    // En móvil/tablet, el div ya está visible, solo ejecutar la animación
    createTimeline();
    if (tlPreview.current) {
      tlPreview.current.play();
    }
  };

  const cubeLeave = () => {
    if (tlPreview.current) {
      if (!isTabletTouch) {
        // En desktop, ocultar el div cuando termine la animación
        tlPreview.current.eventCallback("onReverseComplete", () => {
          setIsDivVisible(false);
        });
      }
      tlPreview.current.reverse();
    }
  };

  // Escuchar la posición del cursor y actualizar la posición del elemento
  useEffect(() => {
    if (elementRef.current) {
      const x = cursorPosition.x * window.innerWidth * 0.1;
      const y = -cursorPosition.y * window.innerHeight * 0.1;

      gsap.to(elementRef.current, {
        x: x,
        y: y,
        ease: "power4.out",
        duration: 0.15,
      });
    }
  }, [cursorPosition]);

  // Función al hacer click en Play
  const spin = () => {
    setIsPlaying(!isPlaying);

    // Al hacer click en Play, ocultar todos los detalles
    document.querySelectorAll(".song-details").forEach((el) => {
      el.style.display = "none";
    });

    if (!isPlaying) {
      if (audio && audio.element) {
        audio.element.play();
      }

      gsap.to(meshRef.current.rotation, {
        duration: 8,
        z: "-=6.29*Math.PI",
        repeat: -1,
        ease: "linear",
        overwrite: "none",
      });
    } else {
      if (audio && audio.element) {
        audio.element.pause();
        audio.element.currentTime = 0;
      }
    }
  };

  // Utiliza setAudio para almacenar tu objeto de audio
  useEffect(() => {
    if (audioCtx) {
      const audioElement = document.createElement("audio");
      audioElement.src = content.audioFileUrl;
      const track = audioCtx.createMediaElementSource(audioElement);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      track.connect(analyser);
      track.connect(audioCtx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);

      function getAverageVolume() {
        analyser.getByteFrequencyData(data);
        let values = 0;
        let length = data.length;
        for (let i = 0; i < length; i++) {
          values += data[i];
        }
        return values / length;
      }

      setAudio({
        element: audioElement,
        getAverageVolume,
      });
    }
  }, [audioCtx, content, setAudio]);

  // Este efecto se ejecuta cada vez que cambia "isPlaying"
  useEffect(() => {
    if (materialRef && materialRef.current) {
      gsap.to(materialRef.current.uniforms.uDarken, {
        value: isPlaying ? 0.5 : 1,
        duration: 0.5,
      });

      let finalValue = isPlaying ? 1 : 0;
      gsap.to(materialRef.current.uniforms.uDistortCircular, {
        duration: 1.2,
        value: finalValue,
        ease: "power4.out",
      });

      gsap
        .timeline()
        .to(materialRef.current.uniforms.noiseStrength, {
          duration: 0.4,
          value: 0.06,
          ease: "power1.in",
        })
        .to(materialRef.current.uniforms.noiseStrength, {
          duration: 0.1,
          value: 0.0,
          ease: "power1.out",
        });
    }
    
    if (meshRef && meshRef.current) {
      if (isPlaying) {
        if (audio) {
          audio.element.play();
        }
        gsap.to(meshRef.current.rotation, {
          duration: 8,
          z: "-=6.29*Math.PI",
          repeat: -1,
          ease: "linear",
          overwrite: "none",
        });
      } else {
        if (audio) {
          audio.element.pause();
          audio.element.currentTime = 0;
        }
        gsap.killTweensOf(meshRef.current.rotation);
        if (initialRotation !== null) {
          gsap.to(meshRef.current.rotation, {
            duration: 1,
            z: initialRotation,
            ease: "power4.out",
          });
        }
      }
    }
  }, [isPlaying, initialRotation]);

  // Leve distorsión animada constante
  useFrame((_, delta) => {
    materialRef.current.uniforms.uTime.value += delta;
  });

  // Modifica los eventos para controlar la interactividad
  const handleEvent = (event, action) => {
    if (!isAnimationFinished) {
      event.stopPropagation();
      return;
    }
    action();
  };

  return (
    <mesh
      ref={meshRef}
      position={position.toArray()}
      onClick={handleClick}
      rotation={[0, 0, 0]}
      onPointerEnter={() => {
        if (activeCube === null) {
          setCursorState("large");
          cubeHover();
        }
      }}
      onPointerLeave={() => {
        setCursorState("default");
        cubeLeave();
      }}
    >
      <planeGeometry
        ref={(geoRef) => {
          if (geoRef) {
            const count = geoRef.attributes.position.count;
            const randoms = new Float32Array(count);

            for (let i = 0; i < count; i++) {
              randoms[i] = Math.random();
            }

            geoRef.setAttribute("aRandom", new BufferAttribute(randoms, 1));
          }
        }}
        args={[1, 1, 32, 32]}
      />

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />

      <Html
        position={[-0.04, 0.87, 0]}
        className={!isAnimationFinished ? "no-pointer-events" : ""}
      >
        <div
          ref={elementRef}
          className={`song-details ${isDivVisible ? "visible" : ""}`}
          style={{ 
            display: (isDivVisible || isTabletTouch) ? "block" : "none" 
          }}
        >
          <p ref={titleRef} style={{ opacity: 0 }}>
            {content.title}
          </p>
          <p ref={authorRef} style={{ opacity: 0 }}>
            By {content.author}
          </p>
          <p ref={yearRef} style={{ opacity: 0 }}>
            {content.year}
          </p>
        </div>
      </Html>

      <Html
        position={[0, 0, 0]}
        center
        scaleFactor={1}
        className={!isAnimationFinished ? "no-pointer-events" : ""}
        style={{ display: showHtml ? "block" : "none" }}
      >
        <div
          className={`song-wrapper ${
            activeCube === index && isAnimationFinished ? "active" : ""
          }`}
        >
          <div className="song-preview">
            <h2>{content.title}</h2>
            <h3>by {content.author}</h3>
            <div className="song-info">
              <p>{content.paragraph}</p>
              <div className="song-credits">
                <span>Album:</span>
                <span>{content.album}</span>
                <span>Year:</span>
                <span>{content.year}</span>
              </div>
              <a
                href={content.songUrl}
                target="blank"
                className="btn-goto"
                onPointerEnter={handleLinkEnter}
                onPointerLeave={handleLinkLeave}
              >
                Listen to it
              </a>
            </div>
          </div>

          <button ref={buttonPlayRef} className="btn-play" onClick={spin}>
            <span className="play-icon play-icon-mobile">{isPlaying ? "■" : "▶"}</span>
            <span className="play-text">{isPlaying ? "Stop playing" : "Play preview"}</span>
          </button>
          <button
            className="btn-back"
            onPointerEnter={handleLinkEnter}
            onPointerLeave={handleLinkLeave}
            onClick={() => {
              onBackClick();
              setIsPlaying(false);

              // Solo restaurar visibilidad de song-details en tablet o móvil
              if (isTabletTouch) {
                document.querySelectorAll(".song-details").forEach((el) => {
                  el.style.display = "block";
                  gsap.to(el.children, {
                    opacity: 1,
                    duration: 0.3,
                  });
                });
              }

              setTimeout(() => {
                resetCamera();
              }, 500);
            }}
          >
            Back to Catalogue
          </button>

        </div>
      </Html>

      <CubeAnimations isAnimationFinished={isAnimationFinished} isPlaying={isPlaying} />
    </mesh>
  );
}