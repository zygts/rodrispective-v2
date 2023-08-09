import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import vertexShader from './core.vert';
import fragmentShader from './core.frag';

export function Core({ noiseTexture }) {
    const mesh = useRef();
  
    const uniforms = useMemo(() => ({
      time: { value: 0 },
      noiseTex: { value: noiseTexture }
    }), [noiseTexture]);
  
    useFrame((state, delta) => {
      if (mesh.current) {
        uniforms.time.value += delta;
      }
    });
  
    return (
        <mesh ref={mesh} position={[0, 1.5, 0.5]} rotation={[0, 2, 0]} scale={[3.2, 3, 3]}>
            <octahedronGeometry args={[1, 12]} />
                <rawShaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
      );
      
  }
  
