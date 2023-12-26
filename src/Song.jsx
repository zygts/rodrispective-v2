import { useRef, useEffect, useMemo, useState, useContext } from "react";
import { Vector2, Vector3, BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

import CubeAnimations from "./Helpers/CubeAnimations";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import { AppContext } from "./appContext";

export default function Cube({
  index,
  onClick,
  radius,
  texture,
  content,
  isAnimationFinished,
  onBackClick,
  resetCamera,
}) {
  const angle = (index / 25) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const position = new Vector3(x, 0, z);

  const materialRef = useRef();
  const meshRef = useRef();
  const buttonPlayRef = useRef();

  const [initialRotation, setInitialRotation] = useState(null);
  const [showHtml, setShowHtml] = useState(false);
  const { setCursorState, activeCube, setAudio, audio, isPlaying, setIsPlaying } =
    useContext(AppContext);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(new Vector3(0, 0, 0));
    }
  }, []);

  // Almacenamos la rotación inicial al montar el componente
  useEffect(() => {
    if (meshRef.current) {
      setInitialRotation(meshRef.current.rotation.z);
    }
  }, []);

  // Click en el elemento
  const handleClick = (event) => {
    event.stopPropagation(); // detén la propagación del evento para evitar el comportamiento inesperado
    onClick(index); // pasa el index al controlador de clics
  };

  // Retrasa la aparición del HTML para evitar flash
  useEffect(() => {
    if (activeCube === index && isAnimationFinished) {
      setTimeout(() => setShowHtml(true), 100);
    } else {
      setShowHtml(false);
    }
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
    }),
    [texture]
  );

  // Estado para controlar la visibilidad del div
  const [isDivVisible, setIsDivVisible] = useState(false);

  // Referencias para los elementos <p>
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const yearRef = useRef(null);

  // Timeline de GSAP para la animación
  let tl = useRef(null);

  const createTimeline = () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      tl.current = gsap
        .timeline({ paused: true })
        .to([titleRef.current, authorRef.current, yearRef.current], {
          opacity: 1,
          duration: 0.3,
          stagger: 0.12,
          ease: "power1.inOut",
        });
    }
  };

  const cubeHover = () => {
    setIsDivVisible(true); // Hacer visible el div
    createTimeline();
    tl.current.play(); // Reproducir la animación
  };

  const cubeLeave = () => {
    if (tl.current) {
      tl.current.reverse(); // Revertir la animación
    }
  };

  // Función al hacer click en Play
  const spin = () => {
    setIsPlaying(!isPlaying); // Alterna el valor de isPlaying

    if (!isPlaying) {
      const tl = gsap.timeline();
      tl.fromTo(
        ".song-info",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        }
      );
    }
  };

  // Utiliza setAudio para almacenar tu objeto de audio
  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
  }, [content]);

  // Este efecto se ejecuta cada vez que cambia "isPlaying"
  useEffect(() => {
    if (materialRef && materialRef.current) {
      // Cambia entre cuadrado y círculo
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
      // Reproduce música
      if (isPlaying) {
        if (audio) {
          audio.element.play();
        }
        gsap.to(meshRef.current.rotation, {
          // Gira indefinidamente
          duration: 8,
          z: "-=6.29*Math.PI",
          repeat: -1,
          ease: "linear",
          overwrite: "none",
        });
      } else {
        // Detiene música
        if (audio) {
          audio.element.pause();
          audio.element.currentTime = 0;
        }
        gsap.killTweensOf(meshRef.current.rotation); // Vuelve a su rotación inicial
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

      <Html position={[-0.04, 0.87, 0]}>
        <div
          className={`song-details ${isDivVisible ? "visible" : ""}`}
          style={{ display: isDivVisible ? "block" : "none" }}
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
        style={{ display: showHtml ? "block" : "none" }}
      >
        <div
          className={`song-wrapper ${
            activeCube === index && isAnimationFinished ? "active" : ""
          }`}
        >
          <div className="song-preview">
            <h2>{content.title}</h2>
            <h3>
              by <span className="artist">Incierto</span>
            </h3>
          </div>
          <div className="song-info">
            <p>{content.paragraph}</p>
            <h3>Year:</h3>
            <span className="song-date"></span>
            <h3>Credits:</h3>
            <p className="song-credits">Created and recorded by Rodrigo Núñez</p>
            <a
              href={content.songUrl}
              target="blank"
              className="btn-goto"
              onPointerEnter={() => setCursorState("large")}
              onPointerLeave={() => setCursorState("default")}
            >
              Go to Album
            </a>
          </div>
          <button ref={buttonPlayRef} className="btn-play" onClick={spin}>
            {isPlaying ? "Stop Playing" : "Play Song"}
          </button>
          <button
            className="btn-back"
            onPointerEnter={() => setCursorState("large")}
            onPointerLeave={() => setCursorState("default")}
            onClick={() => {
              onBackClick();
              resetCamera();
              setIsPlaying(false);
            }}
          >
            Back to Catalogue
          </button>
        </div>
      </Html>

      {/* Animaciones de entrada en el contenido de la canción */}
      <CubeAnimations isAnimationFinished={isAnimationFinished} isPlaying={isPlaying} />
    </mesh>
  );
}
