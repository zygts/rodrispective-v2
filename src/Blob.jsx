import React, { useMemo, useRef } from "react";
import vertexShader from "./blob.vert";
import fragmentShader from "./blob.frag";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { useBlobScrollAnimation } from './useBlobScrollAnimation';

const Blob = ({ scrollableRef }) => {
  const meshRef = useRef();
  const hover = useRef(false);
  const uniforms = useMemo(() => {
    return {
      u_time: { value: 0 },
      u_intensity: { value: 0.2 },
    };
  });

  useBlobScrollAnimation(meshRef, scrollableRef);

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
        meshRef.current.material.uniforms.u_time.value =
        0.3 * clock.getElapsedTime();

        meshRef.current.material.uniforms.u_intensity.value = MathUtils.lerp(
            meshRef.current.material.uniforms.u_intensity.value,
        hover.current ? 0.6 : 0.2,
        0.02
      );
    }
  });
  return (
    <mesh
      ref={meshRef}
      scale={1}
      position={[0, 0, 3]}
      onPointerOver={() => (hover.current = true)}
      onPointerOut={() => (hover.current = false)}
    >
      <icosahedronBufferGeometry args={[1, 20]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default Blob;