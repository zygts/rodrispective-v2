import { useEffect, useState } from "react";
import { TextureLoader } from "three";
import Cube from "./Cube";

export default function CubeGroup({ active, radius, handleCubeClick }) {
  const [textures, setTextures] = useState([]);
  const [cubeContents, setCubeContents] = useState([]);

  useEffect(() => {
    const texturePaths = [
      "./img/t1.jpg",
      "./img/t2.jpg",
      "./img/t3.jpg",
      "./img/t4.jpg",
      "./img/t5.jpg",
      "./img/t6.jpg",
      "./img/t7.jpg",
      "./img/t8.jpg",
      "./img/t9.jpg",
      "./img/t10.jpg",
      "./img/t11.jpg",
      "./img/t12.jpg",
      "./img/t13.jpg",
      "./img/t14.jpg",
      "./img/t15.jpg",
    ];

    const loader = new TextureLoader();
    const loadedTextures = texturePaths.map((path) => loader.load(path));
    setTextures(loadedTextures);

    const contents = [
      { title: "Título 1", paragraph: "Párrafo 1", buttonText: "Botón 1" },
      { title: "Título 2", paragraph: "Párrafo 2", buttonText: "Botón 2" },
      // ...
    ];
    setCubeContents(contents);
  }, []);

  return textures.map((texture, index) => (
    <Cube
      key={index}
      index={index}
      radius={radius}
      isActive={index === active}
      texture={textures[index]}
      content={cubeContents[index]}
      onClick={() => handleCubeClick(index)}
    />
  ));
}
