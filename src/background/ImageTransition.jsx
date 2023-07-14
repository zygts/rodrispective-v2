import { useState, useEffect } from "react";
import { TextureLoader } from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import vertexShader from "./images.vert";
import fragmentShader from "./images.frag";

const Images = () => {
  const [textures, setTextures] = useState([null, null, null, null, null]);
  const [uniforms, setUniforms] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = (event) => {
      setScrollY((prevScrollY) => Math.max(0, prevScrollY + event.deltaY * 2));
    };

    window.addEventListener("wheel", onScroll);

    return () => {
      window.removeEventListener("wheel", onScroll);
    };
  }, []);

  useEffect(() => {
    const loader = new TextureLoader();
    const textureFiles = [
      "frame1.jpg",
      "frame2.jpg",
      "frame3.jpg",
      "frame4.jpg",
      "frame5.jpg",
    ];

    const promises = textureFiles.map(
      (file) =>
        new Promise((resolve) => {
          loader.load(`./img/homepage/${file}`, resolve);
        })
    );

    Promise.all(promises).then((loadedTextures) => {
      setTextures(loadedTextures);
      setUniforms({
        currentTexture: { type: "t", value: loadedTextures[0] },
        nextTexture: { type: "t", value: loadedTextures[1] },
        mixValue: { value: 0.0 },
        uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
        uAspectRatio: { value: window.innerWidth / window.innerHeight },
      });
    });
  }, []);

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

  useFrame(() => {
    if (!uniforms) {
      return;
    }

    const totalImages = textures.length;

    // Esto asume que tu página tiene una altura máxima de 5000px. Ajusta según sea necesario.
    const scrollPerImage = 35000 / 5;

    // Calcula el índice de la textura basado en la posición de scroll.
    const textureIndex = Math.floor(scrollY / scrollPerImage);

    uniforms.currentTexture.value = textures[textureIndex % 5];
    uniforms.nextTexture.value = textures[(textureIndex + 1) % 5];

    // Aquí aplicamos la función de aceleración a mixValue.
    const t = (scrollY % scrollPerImage) / scrollPerImage; // t va de 0 a 1
    uniforms.mixValue.value = Math.pow(t, 4); // t^2 crea una curva de aceleración
  });

  if (!uniforms) {
    return null;
  }

  return (
    <mesh position={[0, 0, 4]}>
      <planeGeometry args={[60, 38]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Images;
