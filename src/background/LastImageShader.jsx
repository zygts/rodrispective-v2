import { TextureLoader, BufferAttribute, ShaderMaterial, PlaneGeometry } from "three";
import { useRef, useState, useEffect, useMemo, useContext } from "react";
import gsap from "gsap";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";
import { AppContext } from "../appContext";
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";
import { useBreakpoint } from "../hooks/useBreakpoint";

const LastImageShader = ({ scrollableRef }) => {
  const { isMobile } = useBreakpoint();
  const { isTablet } = useBreakpoint();

  const [texture, setTexture] = useState(null);
  const planeRef = useRef();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  const baseWidth = 14 * 1.04;
  const baseHeight = 9 * 1.04;
  const scaleFactor = isTablet ? 1.3 : 1;
  const planeWidth = baseWidth * scaleFactor;
  const planeHeight = baseHeight * scaleFactor;

  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(planeWidth, planeHeight, 40, 18).toNonIndexed();
    const triangleIDs = new Float32Array(geo.attributes.position.count);

    for (let i = 0; i < triangleIDs.length; i += 3) {
      const id = i / 3;
      triangleIDs[i] = triangleIDs[i + 1] = triangleIDs[i + 2] = id;
    }

    geo.setAttribute("triangleID", new BufferAttribute(triangleIDs, 1));
    return geo;
  }, [planeWidth, planeHeight]);

  useEffect(() => {
    const loader = new TextureLoader();
    const textureFile = "lastimage.jpg";
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
    <mesh
      ref={planeRef}
      geometry={geometry}
      material={material}
      position={isTablet ? [0, 1.64, 4] : [0, 1.45, 4]}
    />
  );
};

export default LastImageShader;
