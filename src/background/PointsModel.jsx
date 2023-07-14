import React, { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { BufferAttribute, Points, PointsMaterial } from "three";

import { createNoise3D } from "simplex-noise";

function Model() {
  const gltf = useGLTF("./model/angel.glb", false);
  const mesh = gltf.scene.children[0];

  // Crear una función de ruido 3D
  const noise3D = createNoise3D(Math.random);

  // Obtener el atributo de posición (que contiene los vértices)
  const positionAttribute = mesh.geometry.getAttribute("position");

  // Crear un nuevo array para almacenar las posiciones modificadas
  const newPositionArray = new Float32Array(positionAttribute.count * 3);

  for (let i = 0; i < positionAttribute.count; i++) {
    // Obtener el vértice en la posición i
    const x = positionAttribute.getX(i);
    const y = positionAttribute.getY(i);
    const z = positionAttribute.getZ(i);

    // Aplicar el ruido al vértice
    const noise = noise3D(x, y, z) * 0.95;

    // Almacenar el vértice modificado en el nuevo array
    newPositionArray[i * 3] = x + noise;
    newPositionArray[i * 3 + 1] = y;
    newPositionArray[i * 3 + 2] = z;
  }

  // Reemplazar el atributo de posición con los nuevos datos
  mesh.geometry.setAttribute("position", new BufferAttribute(newPositionArray, 3));

  let pointsMaterial = new PointsMaterial({ color: 0xff0000, size: 0.01 });

  let points = new Points(mesh.geometry, pointsMaterial);

  return (
    <primitive
      object={points}
      position={[0, 0.5, 0]}
      rotation={[0.2, 0.5, 0]}
      scale={[3.6, 3.6, 3.6]}
    />
  );
}

export function PointsModel() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[-10, 0, 5]} intensity={0.15} />
        <Model />
      </Suspense>
    </Canvas>
  );
}
