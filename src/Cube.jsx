import { useRef, useEffect, useMemo } from "react";
import { Vector2, Vector3, BufferAttribute } from "three";
import { useFrame } from "@react-three/fiber";
import { Html, Float } from "@react-three/drei";

import "./cube.css";

import CubeAnimations from "./CubeAnimations";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default function Cube({
  index,
  radius,
  onClick,
  isActive,
  texture,
  content,
  isAnimationFinished,
}) {
  const angle = (index / 15) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const position = new Vector3(x, 0, z);

  const materialRef = useRef();
  const meshRef = useRef();

  // Animación al activarse
  // const { scale } = useSpring({
  //   scale: isActive ? [1.2, 1.2, 1.2] : [1, 1, 1],
  //   config: { mass: 1.5, tension: 130, friction: 50 },
  // });

  // Orienta los elementos hacia la cámara
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(new Vector3(0, 0, 0));
    }
  }, []);

  // Click en el elemento
  const handleClick = () => {
    onClick(!isActive);
  };

  // Shaders
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uFrequency: { value: new Vector2(8, 8) },
    }),
    [texture]
  );

  // Animación constante
  useFrame((state, delta) => {
    materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={meshRef} position={position.toArray()} onClick={handleClick}>
      <planeGeometry
        ref={(geoRef) => {
          if (geoRef) {
            const count = geoRef.attributes.position.count;
            const randoms = new Float32Array(count);

            for (let i = 0; i < count; i++) {
              randoms[i] = Math.random();
            }

            geoRef.setAttribute("aRandom", new BufferAttribute(randoms, 1));
          }
        }}
        args={[1, 1, 32, 32]}
      />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
      <Html
        position={[0, 0, 0]}
        center
        scaleFactor={10}
        style={{ display: isActive && isAnimationFinished ? "block" : "none" }}
      >
        <div className="cube-content">
          <h1>{content.title}</h1>
          <p>{content.paragraph}</p>
          <button>{content.buttonText}</button>
        </div>
      </Html>
      <CubeAnimations isAnimationFinished={isAnimationFinished} />
    </mesh>
  );
}
