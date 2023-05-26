import { useRef, useEffect, useMemo, useState } from "react";
import { Vector2, Vector3, BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { gsap } from "gsap";

import "./cube.css";
import CubeAnimations from "./CubeAnimations";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default function Cube({
  index,
  radius,
  onClick,
  isActive,
  texture,
  content,
  isAnimationFinished,
  onBackClick,
  resetCamera,
}) {
  const angle = (index / 15) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const position = new Vector3(x, 0, z);

  const materialRef = useRef();
  const meshRef = useRef();

  const [isPlaying, setIsPlaying] = useState(false);
  const [initialRotation, setInitialRotation] = useState(null);

  // Animación al activarse
  // const { scale } = useSpring({
  //   scale: isActive ? [1.2, 1.2, 1.2] : [1, 1, 1],
  //   config: { mass: 1.5, tension: 130, friction: 50 },
  // });

  // Orienta los elementos hacia la cámara
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
  const handleClick = () => {
    onClick(!isActive);
  };

  // Shaders
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uFrequency: { value: new Vector2(8, 8) },
      uDistortCircular: { value: 0 },
      uRadius: { value: 0.3 },
    }),
    [texture]
  );

  // Función al hacer click en Play
  const spin = () => {
    setIsPlaying(!isPlaying); // Esto cambiará el valor de isPlaying
  };

  // Este efecto se ejecuta cada vez que cambia "isPlaying"
  useEffect(() => {
    if (materialRef && materialRef.current) {
      // Decide el valor final en función de isPlaying
      let finalValue = isPlaying ? 1 : 0;

      // Crea una animación GSAP para cambiar uDistortCircular.value a finalValue
      gsap.to(materialRef.current.uniforms.uDistortCircular, {
        duration: 1.2, // Ajusta esto para cambiar la duración de la animación
        value: finalValue,
        ease: "power4.out", // Puedes experimentar con diferentes funciones de suavizado
      });
    }

    if (meshRef && meshRef.current) {
      // Usamos gsap para animar la rotación del cubo
      if (isPlaying) {
        console.log("Antes de la animación, rotación z: ", meshRef.current.rotation.z);
        gsap.to(meshRef.current.rotation, {
          duration: 19,
          z: "-=9*Math.PI",
          repeat: -1,
          ease: "linear",
          overwrite: "none",
        });
      } else {
        gsap.killTweensOf(meshRef.current.rotation); // Termina la animación en curso
        if (initialRotation !== null) {
          gsap.to(meshRef.current.rotation, {
            duration: 1, // Ajusta este valor según tu preferencia
            z: initialRotation,
            ease: "power4.out",
          });
        }
      }
    }
  }, [isPlaying, initialRotation]);

  // Animación constante
  useFrame((_, delta) => {
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh
      ref={meshRef}
      position={position.toArray()}
      onClick={handleClick}
      rotation={[0, 0, 0]}
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
        position={[0, 0, 0]}
        center
        scaleFactor={1}
        style={{ display: isActive && isAnimationFinished ? "block" : "none" }}
      >
        <div className="song-wrapper">
          <div className="song-preview">
            <h1>{content.title}</h1>
            <h2>
              by <span className="artist">Incierto</span>
            </h2>
          </div>
          <div className="song-info">
            <p>{content.paragraph}</p>
            <h3>Year:</h3>
            <span className="song-date"></span>
            <h3>Credits:</h3>
            <p className="song-credits">Created and recorded by Rodrigo Núñez</p>
            <button className="btn-goto">Go to song</button>
          </div>
          <button className="btn-play" onClick={spin}>
            Play Song
          </button>
          <button
            className="btn-back"
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
      <CubeAnimations isAnimationFinished={isAnimationFinished} isPlaying={isPlaying} />
    </mesh>
  );
}
