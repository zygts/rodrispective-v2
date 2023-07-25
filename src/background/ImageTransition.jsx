import { useState, useEffect, useRef } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useThree } from "@react-three/fiber";

import vertexShader from "./images.vert";
import fragmentShader from "./images.frag";
import { useScrollAnimation } from "../useScrollTriggerAnimation";

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
  useScrollAnimation(uniforms, textures, scrollableRef, camera);

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
