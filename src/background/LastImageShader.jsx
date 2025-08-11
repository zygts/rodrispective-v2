import {
  TextureLoader,
  BufferAttribute,
  ShaderMaterial,
  PlaneGeometry,
} from "three";
import { useRef, useState, useEffect, useMemo, useContext } from "react";
import gsap from "gsap";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";
import { AppContext } from "../appContext";
import { useBreakpoint } from "../hooks/useBreakpoint";
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImageShader = ({ scrollableRef }) => {
  const { isMobile } = useBreakpoint();
  const { startButtonClicked, setStartButtonClicked } = useContext(AppContext);

  const [texture, setTexture] = useState(null);
  const planeRef = useRef();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  // 📐 Geometría con proporción 14:9 (fija)
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(14 * 1.04, 9 * 1.04, 40, 18).toNonIndexed();
    const triangleIDs = new Float32Array(geo.attributes.position.count);
    for (let i = 0; i < triangleIDs.length; i += 3) {
      const id = i / 3;
      triangleIDs[i] = triangleIDs[i + 1] = triangleIDs[i + 2] = id;
    }
    geo.setAttribute("triangleID", new BufferAttribute(triangleIDs, 1));
    return geo;
  }, []);

  // 🎨 Shader Material
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uTexture: { type: "t", value: null },
        uResolution: {
          value: { x: window.innerWidth, y: window.innerHeight },
        },
        uAspectRatio: {
          value: window.innerWidth / window.innerHeight,
        },
        u_opacity: { value: 0.0 },
        uDisplacementFactor: { value: 0.0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });
  }, []);

  // 🖼️ Carga textura
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("./img/homepage/lastimage.jpg", (tex) => {
      setTexture(tex);
      material.uniforms.uTexture.value = tex;
      setIsTextureLoaded(true);
    });
  }, [material]);

  // 🌀 Scroll animation
  useLastImageScrollAnimation(planeRef, scrollableRef, isTextureLoaded);

  // 📐 Actualiza uniforms de resolución/aspecto
  useEffect(() => {
    const handleResize = () => {
      const { uniforms } = material;
      uniforms.uResolution.value.x = window.innerWidth;
      uniforms.uResolution.value.y = window.innerHeight;
      uniforms.uAspectRatio.value =
        window.innerWidth / window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [material]);

  // ▶️ Shader animation trigger
  useEffect(() => {
    const handleStartButtonClick = () => {
      setStartButtonClicked(true);
    };
    window.addEventListener("startButtonClick", handleStartButtonClick);
    return () =>
      window.removeEventListener("startButtonClick", handleStartButtonClick);
  }, [setStartButtonClicked]);

  useEffect(() => {
    if (startButtonClicked) {
      gsap.to(material.uniforms.uDisplacementFactor, {
        value: 3,
        duration: 3,
        ease: "power2.in",
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("shaderAnimationComplete"));
        },
      });
    }
  }, [startButtonClicked, material]);

  // ✨ Escalado manual según dispositivo
  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;
    const boost = isMobile ? 1.375 : 1;
    plane.scale.set(boost, boost, 1);
  }, [isMobile]);

  return (
    <mesh
      ref={planeRef}
      geometry={geometry}
      material={material}
      position={[0, isMobile ? 1.75 : 1.45, 4]}
    />
  );
};

export default LastImageShader;
