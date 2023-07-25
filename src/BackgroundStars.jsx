import { Stars } from "@react-three/drei";

export const BackgroundStars = () => {
  return (
    <>
      <color attach="background" args={["#15151a"]} />
      <Stars
        radius={20} // El radio del espacio estrellado.
        depth={90} // La profundidad del espacio estrellado.
        count={500} // La cantidad de estrellas.
        factor={2} // Factor de tamaño de las estrellas.
        saturation={0.5} // Saturación de color de las estrellas.
        fade // Suaviza los bordes de las estrellas.
      />
    </>
  );
};
