import { useState, useEffect, useRef } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";

import vertexShader from "./images.vert";
import fragmentShader from "./images.frag";

gsap.registerPlugin(ScrollTrigger);

const Images = ({ scrollableRef }) => {
  const [textures, setTextures] = useState([null, null, null, null, null]);
  const [displacementTexture, setDisplacementTexture] = useState(null);
  const [uniforms, setUniforms] = useState(null);
  const scrollableHeight = useRef(null);
  const { camera } = useThree();

  // Carga las imágenes como texturas
  useEffect(() => {
    const loader = new TextureLoader();
    const textureFiles = [
      "frame0.jpg",
      "frame4.jpg",
      "frame5.jpg",
      "frame2.jpg",
      "frame3.jpg",
      "frame1.jpg",
    ];

    const promises = textureFiles.map(
      (file) =>
        new Promise((resolve) => {
          loader.load(`./img/homepage/${file}`, resolve);
        })
    );

    // Carga la textura extra
    const displacementPromise = new Promise((resolve) => {
      loader.load(`./img/homepage/displacement.jpg`, resolve);
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
      });
    });

    // Getting the height of the scrollable div.
    if (scrollableRef.current) {
      scrollableHeight.current = scrollableRef.current.scrollHeight;
    }
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
  useEffect(() => {
    let scrollAnimation = null;

    if (!uniforms || !textures[0] || !scrollableRef.current) {
      return;
    }
    const numImages = textures.length;
    const imageShowTime = 0.8; // 80% del tiempo
    const transitionTime = 0.2; // 20% del tiempo
    const scrollStartOffset = 0.15;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollableRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          let adjustedScroll =
            (self.progress - scrollStartOffset) / (1.0 - scrollStartOffset);
          adjustedScroll = gsap.utils.clamp(0.0, 1.0, adjustedScroll);
          uniforms.uScroll.value = adjustedScroll;

          const numImages = textures.length;
          const index = Math.min(
            Math.floor((progress / (imageShowTime + transitionTime)) * numImages),
            numImages - 1
          );
          const imageProgress = progress * numImages - index;

          if (imageProgress <= imageShowTime) {
            uniforms.currentTexture.value = textures[index];
            uniforms.nextTexture.value = textures[index];
            uniforms.mixValue.value = 0;
            uniforms.uGlitch.value = 0;
          } else if (index < numImages - 1) {
            // Evita la transición si es la última textura
            const transitionProgress = (imageProgress - imageShowTime) / transitionTime;
            uniforms.currentTexture.value = textures[index];
            uniforms.nextTexture.value = textures[index + 1];
            uniforms.mixValue.value = transitionProgress;
            const glitchTransitionProgress = Math.min(transitionProgress * 2, 1);
            uniforms.uGlitch.value = Math.sin(glitchTransitionProgress * Math.PI) * 0.1;
          }
        },
        onStart: () => {
          uniforms.currentTexture.value = textures[0];
          uniforms.nextTexture.value = textures[1];
          uniforms.mixValue.value = 0;
          uniforms.uGlitch.value = 0;
        },
      },
    });

    if (camera) {
      timeline.add(
        gsap.to(camera, {
          zoom: 0.04,
          ease: "power1.inOut",
          onUpdate: () => camera.updateProjectionMatrix(),
        }),
        0
      );
    }

    scrollAnimation = timeline;

    return () => {
      if (scrollAnimation) {
        scrollAnimation.kill();
      }
    };
  }, [textures, uniforms, scrollableRef.current, camera]);

  if (!uniforms) {
    return null;
  }

  return (
    <mesh position={[0, 5, 3.7]}>
      <planeGeometry args={[60, 38]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
      />
    </mesh>
  );
};

export default Images;
