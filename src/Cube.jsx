import { useRef, useEffect } from "react";
import { Vector3 } from "three";

export default function Cube({ index, radius, onClick, isActive }) {
  const angle = (index / 15) * 2 * Math.PI;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const position = new Vector3(x, 0, z);

  const meshRef = useRef();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.lookAt(new Vector3(0, 0, 0));
    }
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position.toArray()}
      onClick={onClick}
      scale={isActive ? 1.5 : 1}
    >
      <boxGeometry args={[1, 1, 0.05]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
