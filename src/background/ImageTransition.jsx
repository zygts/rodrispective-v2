// Images.jsx
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";

import vertexShader from "./images.vert";      // <-- sin corrección de aspecto
import fragmentShader from "./images.frag";
import { useScrollAnimation } from "../useScrollTriggerAnimation";
import { useBreakpoint } from "../hooks/useBreakpoint";

gsap.registerPlugin(ScrollTrigger);

const Images = ({ scrollableRef }) => {
  const { isMobile, isTabletTouch } = useBreakpoint();
  const { camera, size } = useThree(); // tamaño real del canvas

  // Grupo padre para spring; mesh hijo para ajustar aspecto
  const groupRef = useRef();
  const meshRef = useRef();
  const glitchAnimationRef = useRef(null);

  const [textures, setTextures] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Uniforms (sin tocar aspecto en el vertex)
  const uniforms = useRef({
    currentTexture: { type: "t", value: null },
    nextTexture: { type: "t", value: null },
    mixValue: { value: 0.0 },
    uGlitch: { value: 0.0 },
    uResolution: { value: { x: size.width, y: size.height } },
    uAspectRatio: { value: size.width / size.height },
    uDisplacement: { type: "t", value: null },
    uScroll: { value: 0 },
    uRandomValues: {
      value: {
        r: Math.random() * 0.1 - 0.05,
        g: Math.random() * 0.1 - 0.05,
        b: Math.random() * 0.1 - 0.05,
      },
    },
    u_opacity: { value: 1.0 },
  });

  // Spring SOLO para el grupo (escala uniforme / posición / rotación)
  const springProps = useSpring({
    scale: [1, 1, 1], // el boost se aplica más abajo sobre este valor
    position: isMobile ? [0, 1.65, 3] : isTabletTouch ? [0, 1.5, 3] : [0, 1.4, 3],
    rotation: [0, 0, 0],
    from: {
      scale: [0.3, 0.3, 0.3],
      position: [-2, 5, 1],
      rotation: [0.5, 0.9, 0.5],
    },
    config: { tension: 40, friction: 50 },
    delay: 1200,
  });

  // Carga de texturas y displacement (no depende de breakpoints)
  useEffect(() => {
    const loader = new TextureLoader();
    const textureFiles = [
      "frame0-3.jpg",
      "frame8.jpg",
      "frame7-2.jpg",
      "frame11.jpg",
      "frame13.jpg",
      "frame15.jpg",
      "frame6.jpg",
      "frame10.jpg",
      "frame14.jpg",
    ];

    const loadTextures = async () => {
      const textures = await Promise.all(
        textureFiles.map(
          (file) =>
            new Promise((res) => loader.load(`./img/homepage/${file}`, res))
        )
      );

      const displacement = await new Promise((res) =>
        loader.load(`./img/homepage/disp2.jpg`, res)
      );

      uniforms.current.currentTexture.value = textures[0];
      uniforms.current.nextTexture.value = textures[1];
      uniforms.current.uDisplacement.value = displacement;

      setTextures(textures);
      setIsLoaded(true);
    };

    loadTextures();
  }, []);

  // Mantén uResolution/uAspectRatio actualizados desde el tamaño del canvas
  useEffect(() => {
    uniforms.current.uResolution.value.x = size.width;
    uniforms.current.uResolution.value.y = size.height;
    uniforms.current.uAspectRatio.value = size.width / size.height;

    // Si usas ScrollTrigger, refresca cuando cambie el canvas
    ScrollTrigger.refresh();
  }, [size.width, size.height]);

  // Ajuste de aspecto del plano en el mesh (sin boost, sin spring)
  useEffect(() => {
  const plane = meshRef.current;
  if (!plane) return;
  const fixX = (20/9) / (14/9); // = 20/14 = 10/7
  plane.scale.set(fixX, 1, 1);
}, []);

  // Animación de scroll (transiciones de texturas, cámara, etc.)
  useScrollAnimation(
    uniforms.current,
    textures,
    scrollableRef,
    camera,
    glitchAnimationRef
  );

  // Glitch animation (igual que tenías)
  useEffect(() => {
    if (!isLoaded) return;

    const timeout = setTimeout(() => {
      const tl = gsap.timeline({ repeat: -1 });

      for (let i = 0; i < 100; i++) {
        const glitchDuration = Math.random() * 0.18 + 0.1;
        const glitchValue = Math.random() * 0.1 + 0.1;
        const pauseDuration = Math.random() * 3 + 7;

        const target = {
          r: Math.random() * 0.1 - 0.05,
          g: Math.random() * 0.1 - 0.05,
          b: Math.random() * 0.1 - 0.05,
        };

        tl.to(uniforms.current.uGlitch, {
          duration: glitchDuration,
          value: glitchValue,
          ease: "steps(3)",
          onUpdate: () => {
            const rv = uniforms.current.uRandomValues.value;
            rv.r += (target.r - rv.r) * 0.5;
            rv.g += (target.g - rv.g) * 0.5;
            rv.b += (target.b - rv.b) * 0.5;
          },
        });

        tl.to(uniforms.current.uGlitch, {
          duration: glitchDuration,
          value: 0,
          ease: "steps(3)",
        });

        tl.to({}, { duration: pauseDuration });
      }

      glitchAnimationRef.current = tl;
    }, 7000);

    return () => {
      clearTimeout(timeout);
      glitchAnimationRef.current?.kill();
    };
  }, [isLoaded]);

  if (!isLoaded) return null;

  // Boost solo en móvil (uniforme, multiplicando el spring del grupo)
  const boost = isMobile ? 1.375 : 1;

  return (
    <a.group
      ref={groupRef}
      scale={springProps.scale.to((x, y, z) => [x * boost, y * boost, z])}
      position={springProps.position}
      rotation={springProps.rotation}
    >
      <mesh ref={meshRef}>
        <planeGeometry args={[14, 9]} />
        <shaderMaterial
          uniforms={uniforms.current}
          vertexShader={vertexShader}   // sin corrección de aspecto
          fragmentShader={fragmentShader}
          transparent
        />
      </mesh>
    </a.group>
  );
};

export default Images;
