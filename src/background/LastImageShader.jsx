import { TextureLoader, BufferAttribute, ShaderMaterial, PlaneGeometry } from "three";
import { useRef, useState, useEffect, useMemo, useContext } from "react";
import gsap from "gsap";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";
import { AppContext } from "../appContext";
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImageShader = ({ scrollableRef }) => {
  const [texture, setTexture] = useState(null);
  const planeRef = useRef();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  const geometry = new PlaneGeometry(14, 9.0, 28, 17).toNonIndexed();

  useEffect(() => {
    const loader = new TextureLoader();
    const textureFile = "frame4-2.jpg";
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

  const { startButtonClicked, setStartButtonClicked } = useContext(AppContext);

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
      gsap.to(material.uniforms.uDisplacementFactor, {
        value: 3,
        duration: 3,
        ease: "power2.in",
        onComplete: () => {
          const event = new CustomEvent("shaderAnimationComplete");
          window.dispatchEvent(event);
        },
      });
    }
  }, [startButtonClicked, material]);

  return (
    <mesh ref={planeRef} geometry={geometry} material={material} position={[0, 1.5, 5]} />
  );
};

export default LastImageShader;
