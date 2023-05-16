export default function LightingAndGround() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[19, 15, 29]} angle={0.7} penumbra={1} castShadow />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={"gray"} />
      </mesh>
    </>
  );
}
