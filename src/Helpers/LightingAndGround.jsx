import { Environment, Lightformer } from "@react-three/drei";

export default function LightingAndGround() {
  return (
    <>
      <color attach="background" args={["#15151a"]} />
      <hemisphereLight intensity={0.04} />
      <Environment resolution={512}>
        <Lightformer intensity={1} position={[-20, 15, -15]} scale={[10, 10, 10]} />
      </Environment>
    </>
  );
}
