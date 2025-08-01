import { useState, useEffect, useRef, useMemo } from "react";
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
  const { camera } = useThree();
  const meshRef = useRef();
  const glitchAnimationRef = useRef(null);

  const [textures, setTextures] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const uniforms = useRef({
    currentTexture: { type: "t", value: null },
    nextTexture: { type: "t", value: null },
    mixValue: { value: 0.0 },
    uGlitch: { value: 0.0 },
    uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    uAspectRatio: { value: window.innerWidth / window.innerHeight },
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

  const springProps = useSpring({
    scale: [1, 1, 1],
    position: [0, 1.4, 3],
    rotation: [0, 0, 0],
    from: {
      scale: [0.3, 0.3, 0.3],
      position: [-2, 5, 1],
      rotation: [0.5, 0.9, 0.5],
    },
    config: { tension: 35, friction: 55 },
    delay: 1200,
  });

  // 🖼️ Cargar texturas y displacement
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
          (file) => new Promise((res) => loader.load(`./img/homepage/${file}`, res))
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

  // 📐 Resize
  useEffect(() => {
    const handleResize = () => {
      uniforms.current.uResolution.value.x = window.innerWidth;
      uniforms.current.uResolution.value.y = window.innerHeight;
      uniforms.current.uAspectRatio.value = window.innerWidth / window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧱 Ajuste del plano según aspecto
  useEffect(() => {
    const adjustPlaneSize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const imageAspect = 20 / 9;
      const plane = meshRef.current;

      if (!plane) return;

      if (aspect > imageAspect) {
        plane.scale.x = aspect / imageAspect;
        plane.scale.y = 1;
      } else {
        plane.scale.x = 1;
        plane.scale.y = imageAspect / aspect;
      }
    };

    adjustPlaneSize();
    window.addEventListener("resize", adjustPlaneSize);
    return () => window.removeEventListener("resize", adjustPlaneSize);
  }, []);

  // 🎞️ Scroll animation
  useScrollAnimation(uniforms.current, textures, scrollableRef, camera, glitchAnimationRef);

  // 🔁 Glitch animation
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

  return (
    <a.mesh
      ref={meshRef}
      scale={springProps.scale}
      position={springProps.position}
      rotation={springProps.rotation}
    >
      <planeGeometry args={[14, 9]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </a.mesh>
  );
};

export default Images;
