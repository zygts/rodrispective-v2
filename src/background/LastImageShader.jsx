import { TextureLoader, BufferAttribute, ShaderMaterial, PlaneGeometry } from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber"; // Asegúrate de importar useFrame
import gsap from "gsap";
import dat from "dat.gui";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";

import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImageShader = ({ scrollableRef }) => {
  const [texture, setTexture] = useState(null);
  const planeRef = useRef();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  // Asumiendo que estás usando una geometría de tipo PlaneGeometry
  const geometry = new PlaneGeometry(14, 8.5, 28, 17).toNonIndexed();

  // Carga solo la última imagen como textura
  useEffect(() => {
    const loader = new TextureLoader();
    const textureFile = "frame1-2.jpg";
    loader.load(`./img/homepage/${textureFile}`, (texture) => {
      setTexture(texture);
      setIsTextureLoaded(true);
    });
  }, []);

  useLastImageScrollAnimation(planeRef, scrollableRef, isTextureLoaded);

  const triangleIDs = new Float32Array(geometry.attributes.position.count);

  for (let i = 0; i < geometry.attributes.position.count; i += 3) {
    triangleIDs[i] = i / 3;
    triangleIDs[i + 1] = i / 3;
    triangleIDs[i + 2] = i / 3;
  }

  geometry.setAttribute("triangleID", new BufferAttribute(triangleIDs, 1));

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTexture: { type: "t", value: texture },
          uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
          uAspectRatio: { value: window.innerWidth / window.innerHeight },
          u_opacity: { value: 0.0 },
          uDisplacementFactor: { value: 0.0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      }),
    [texture]
  );

  // Estado para saber si el botón "start" ha sido pulsado
  const [startButtonClicked, setStartButtonClicked] = useState(false);

  useEffect(() => {
    const handleStartButtonClick = () => {
      setStartButtonClicked(true);
    };

    window.addEventListener("startButtonClick", handleStartButtonClick);

    return () => {
      window.removeEventListener("startButtonClick", handleStartButtonClick);
    };
  }, []);

  useEffect(() => {
    if (startButtonClicked) {
      // Ejecuta la animación aquí
      console.log("start");
      gsap.to(material.uniforms.uDisplacementFactor, {
        value: 10,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          console.log(
            "uDisplacementFactor:",
            material.uniforms.uDisplacementFactor.value
          );
        },
      });
    }
  }, [startButtonClicked]);

  return (
    <mesh ref={planeRef} geometry={geometry} material={material} position={[0, 1.5, 3]} />
  );
};

export default LastImageShader;
