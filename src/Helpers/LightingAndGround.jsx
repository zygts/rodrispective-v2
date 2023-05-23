import { Environment, Lightformer } from "@react-three/drei";

export default function LightingAndGround() {
  return (
    <>
      <Environment>
        <Lightformer
          form="rect" // circle | ring | rect (optional, default = rect)
          intensity={1} // power level (optional = 1)
          color="white" // (optional = white)
          scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
          target={[0, 0, 0]} // Target position (optional = undefined)
        />
      </Environment>
    </>
  );
}
