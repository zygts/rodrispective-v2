import { useRef, useMemo } from "react";
import { PointsMaterial, BufferGeometry, BufferAttribute } from "three";

const Stars = () => {
  const starsRef = useRef();

  //   useEffect(() => {
  //     if (starsRef.current) {
  //       const gui = new dat.GUI();
  //       const posFolder = gui.addFolder("Position");
  //       posFolder.add(starsRef.current.position, "x", -10, 10);
  //       posFolder.add(starsRef.current.position, "y", -10, 10);
  //       posFolder.add(starsRef.current.position, "z", -10, 10);
  //       posFolder.open();

  //       const rotFolder = gui.addFolder("Rotation");
  //       rotFolder.add(starsRef.current.rotation, "x", -Math.PI, Math.PI);
  //       rotFolder.add(starsRef.current.rotation, "y", -Math.PI, Math.PI);
  //       rotFolder.add(starsRef.current.rotation, "z", -Math.PI, Math.PI);
  //       rotFolder.open();
  //     }
  //   }, []);

  // Crea las partículas
  const { position, material } = useMemo(() => {
    const numStars = 100; // Cantidad de estrellas que quieres crear
    const positions = new Float32Array(numStars * 3);
    const colors = new Float32Array(numStars * 3);

    for (let i = 0; i < numStars; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10; // 10 es la escala de tu escena, ajusta según sea necesario
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      colors[i3] = Math.random();
      colors[i3 + 1] = Math.random();
      colors[i3 + 2] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.012, // Tamaño de las partículas, ajusta según sea necesario
      vertexColors: true,
    });

    return { position: geometry, material: material };
  }, []);

  return (
    <points
      ref={starsRef}
      position={[4, 0, 1.6]}
      rotation={[-1, -2, 1]}
      geometry={position}
      material={material}
    />
  );
};

export default Stars;
