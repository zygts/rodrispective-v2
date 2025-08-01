import {
  TextureLoader,
  BufferAttribute,
  ShaderMaterial,
  PlaneGeometry,
} from "three";
import { useRef, useEffect, useMemo, useContext } from "react";
import gsap from "gsap";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";
import { AppContext } from "../appContext";
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImageShader = ({ scrollableRef }) => {
  const textureRef = useRef(null);
  const planeRef = useRef();
  const shaderMaterialRef = useRef();
  const isTextureLoadedRef = useRef(false);
  const geometryRef = useRef();

  const { setStartButtonClicked } = useContext(AppContext);

  // Carga la textura
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("./img/homepage/lastimage.jpg", (tex) => {
      textureRef.current = tex;
      isTextureLoadedRef.current = true;
      shaderMaterialRef.current.uniforms.uTexture.value = tex;
    });
  }, []);

  // Genera geometría una sola vez
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(14 * 1.04, 9 * 1.04, 40, 18).toNonIndexed();
    const triangleIDs = new Float32Array(geo.attributes.position.count);

    for (let i = 0; i < triangleIDs.length; i += 3) {
      const id = i / 3;
      triangleIDs[i] = triangleIDs[i + 1] = triangleIDs[i + 2] = id;
    }

    geo.setAttribute("triangleID", new BufferAttribute(triangleIDs, 1));
    geometryRef.current = geo;
    return geo;
  }, []);

  // Material y uniforms
  const material = useMemo(() => {
    const uniforms = {
      uTexture: { type: "t", value: null },
      uResolution: {
        value: { x: window.innerWidth, y: window.innerHeight },
      },
      uAspectRatio: {
        value: window.innerWidth / window.innerHeight,
      },
      u_opacity: { value: 0.0 },
      uDisplacementFactor: { value: 0.0 },
    };

    const mat = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    shaderMaterialRef.current = mat;
    return mat;
  }, []);

  // Actualiza resolución al redimensionar
  useEffect(() => {
    const handleResize = () => {
      if (!shaderMaterialRef.current) return;
      const { uniforms } = shaderMaterialRef.current;
      uniforms.uResolution.value.x = window.innerWidth;
      uniforms.uResolution.value.y = window.innerHeight;
      uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll animation
  useLastImageScrollAnimation(planeRef, scrollableRef, isTextureLoadedRef.current);

  // Botón de inicio
  useEffect(() => {
    const handleStart = () => {
      setStartButtonClicked(true);

      gsap.to(shaderMaterialRef.current.uniforms.uDisplacementFactor, {
        value: 3,
        duration: 3,
        ease: "power2.in",
        onComplete: () => {
          window.dispatchEvent(new CustomEvent("shaderAnimationComplete"));
        },
      });
    };

    window.addEventListener("startButtonClick", handleStart);
    return () => window.removeEventListener("startButtonClick", handleStart);
  }, [setStartButtonClicked]);

  return (
    <mesh
      ref={planeRef}
      geometry={geometry}
      material={material}
      position={[0, 1.45, 4]}
    />
  );
};

export default LastImageShader;
