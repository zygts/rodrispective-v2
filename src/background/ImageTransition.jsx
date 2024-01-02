import { useState, useEffect, useRef } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";

import vertexShader from "./images.vert";
import fragmentShader from "./images.frag";
import { useScrollAnimation } from "../useScrollTriggerAnimation";

gsap.registerPlugin(ScrollTrigger);

const Images = ({ scrollableRef }) => {
  const [textures, setTextures] = useState([null, null, null, null, null]);
  const [displacementTexture, setDisplacementTexture] = useState(null);
  const [uniforms, setUniforms] = useState({
    currentTexture: { type: "t", value: null },
    nextTexture: { type: "t", value: null },
    mixValue: { value: 0.0 },
    uGlitch: { value: 0.0 },
    uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    uAspectRatio: { value: window.innerWidth / window.innerHeight },
    uDisplacement: { type: "t", value: null },
    uScroll: { value: 0 },
  });
  const { camera } = useThree();
  const glitchAnimationRef = useRef(null);
  const meshRef = useRef();

  const randomValues = {
    r: Math.random() * 0.1 - 0.05, // Valor aleatorio entre -0.05 y 0.05
    g: Math.random() * 0.1 - 0.05,
    b: Math.random() * 0.1 - 0.05,
  };

  // Animación entrada imagenes
  const props = useSpring({
    scale: [1, 1, 1],
    position: [0, 1.5, 3], // posicion objetivo
    rotation: [0, 0, 0], // rotacion objetivo
    from: {
      scale: [0.3, 0.3, 0.3],
      position: [-2, 5, 1], // posicion inicial
      rotation: [0.5, 0.9, 0.5], // rotacion inicial
    },
    config: {
      tension: 35,
      friction: 55,
    },
  });

  // Carga las imágenes como texturas
  useEffect(() => {
    const loader = new TextureLoader();
    const textureFiles = [
      "frame0-2.jpg",
      "frame8.jpg",

      "frame10.jpg",
      "frame7.jpg",
      "frame1-2.jpg",
      "frame2-2.jpg",
      "frame6.jpg",

      "frame8.jpg",
      "frame9.jpg",
      "frame4-2.jpg",
      "frame3-2.jpg",
    ];

    const promises = textureFiles.map(
      (file) =>
        new Promise((resolve) => {
          loader.load(`./img/homepage/${file}`, resolve);
        })
    );

    // Carga la textura extra
    const displacementPromise = new Promise((resolve) => {
      loader.load(`./img/homepage/disp2.jpg`, resolve);
    });

    Promise.all([...promises, displacementPromise]).then((loadedTextures) => {
      const displacementTexture = loadedTextures.pop();
      setTextures(loadedTextures);
      setDisplacementTexture(displacementTexture);
      setUniforms({
        currentTexture: { type: "t", value: loadedTextures[0] },
        nextTexture: { type: "t", value: loadedTextures[1] },
        mixValue: { value: 0.0 },
        uGlitch: { value: 0.0 },
        uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
        uAspectRatio: { value: window.innerWidth / window.innerHeight },
        uDisplacement: { type: "t", value: displacementTexture },
        uScroll: { value: 0 },
        uRandomValues: { value: randomValues },
        u_opacity: { value: 1.0 },
      });
    });
  }, []);

  // Actualiza su resolución
  useEffect(() => {
    const onResize = () => {
      if (uniforms) {
        uniforms.uResolution.value.x = window.innerWidth;
        uniforms.uResolution.value.y = window.innerHeight;
        uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [uniforms]);

  // Animación en scroll
  useScrollAnimation(uniforms, textures, scrollableRef, camera, glitchAnimationRef);

  // Animación de glitch
  useEffect(() => {
    if (!uniforms || !uniforms.uRandomValues) {
      return; // Retorna temprano si uniforms o uniforms.uRandomValues no están definidos
    }
    // Defer the execution of the animation by 7 seconds
    const timeoutId = setTimeout(() => {
      const tl = gsap.timeline({ repeat: -1 });

      const addRandomAnimation = () => {
        const glitchDuration = Math.random() * 0.18 + 0.1;
        const targetGlitchValue = Math.random() * 0.1 + 0.1;

        // Define los valores objetivo de uRandomValues
        const targetRandomValues = {
          r: Math.random() * 0.1 - 0.05,
          g: Math.random() * 0.1 - 0.05,
          b: Math.random() * 0.1 - 0.05,
        };

        // Anima uGlitch y uRandomValues simultáneamente
        tl.to(uniforms.uGlitch, {
          duration: glitchDuration,
          value: targetGlitchValue,
          ease: "steps(3)",
          onUpdate: () => {
            // Durante la animación, actualiza uRandomValues
            uniforms.uRandomValues.value = {
              r:
                uniforms.uRandomValues.value.r +
                (targetRandomValues.r - uniforms.uRandomValues.value.r) * 0.5,
              g:
                uniforms.uRandomValues.value.g +
                (targetRandomValues.g - uniforms.uRandomValues.value.g) * 0.5,
              b:
                uniforms.uRandomValues.value.b +
                (targetRandomValues.b - uniforms.uRandomValues.value.b) * 0.5,
            };
          },
        });

        tl.to(uniforms.uGlitch, {
          duration: glitchDuration,
          ease: "steps(3)",
          value: 0, // Regresa a 0 después de cada glitch
        });
      };

      const addRandomPause = () => {
        const duration = Math.random() * 3 + 1; // Pausa más larga
        tl.to({}, { duration });
      };

      for (let i = 0; i < 100; i++) {
        addRandomAnimation();
        addRandomPause();
      }

      glitchAnimationRef.current = tl;
    }, 7000); // 7 seconds

    // Make sure to clear the timeout if the component unmounts before the timeout finishes
    return () => {
      clearTimeout(timeoutId);
      if (glitchAnimationRef.current) {
        glitchAnimationRef.current.kill();
      }
    };
  }, [uniforms]);

  if (!uniforms.currentTexture.value) {
    return null;
  }

  return (
    <a.mesh
      ref={meshRef}
      scale={props.scale}
      position={props.position}
      rotation={props.rotation}
    >
      <planeGeometry args={[14, 9.5]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </a.mesh>
  );
};

export default Images;
