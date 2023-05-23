import Cube from "./Cube";

export default function CubeGroup({ active, radius, textures, handleCubeClick }) {
  return textures.map((texture, index) => (
    <Cube
      key={index}
      index={index}
      radius={radius}
      isActive={index === active}
      onClick={() => handleCubeClick(index)}
      texture={texture}
    />
  ));
}
