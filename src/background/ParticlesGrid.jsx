import { useContext, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { AppContext } from "../appContext";
import { a } from "@react-spring/three";
import gsap from "gsap";
import ParticlesLogic from "./ParticlesLogic.jsx";

export default function ParticlesGrid() {
  const { audio, isLoading, cursorPosition, showIntro, isPlaying } =
    useContext(AppContext);

  const { position, rotation, mesh, material, setUProgress } =
    ParticlesLogic(isPlaying, audio, cursorPosition, showIntro, isLoading);

  // Animación de entrada
  useEffect(() => {
    if (!isLoading) {
      const animationObj = { progress: 0 };
      gsap.to(animationObj, {
        progress: 1,
        duration: 2.5,
        ease: "Power4.easeOut",
        onUpdate: () => setUProgress(animationObj.progress),
      });
    }
  }, [isLoading]);

  // Detectar el volumen de la música
  useFrame(({ clock }) => {
    if (material) {
      material.uniforms.uTime.value = clock.elapsedTime * 5;

      if (audio && audio.getAverageVolume) {
        const volume = audio.getAverageVolume();
        material.uniforms.uSoundVolume.value = volume / 255;
      }
      material.needsUpdate = true;
    }
  });

  // Actualiza resolución
  useEffect(() => {
    const onResize = () => {
      material.uniforms.uResolution.value.x = window.innerWidth;
      material.uniforms.uResolution.value.y = window.innerHeight;
      material.uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Efecto cursor solo en la intro
  // useEffect(() => {
  //   if (material && material.uniforms.uShowIntro) {
  //     material.uniforms.uShowIntro.value = showIntro ? 1.0 : 0.0;
  //   }
  // }, [showIntro]);

  return (
    <a.primitive
      object={mesh}
      position={position}
      rotation={rotation}
      scale={[1, 1, 1]}
    />
  );
}
