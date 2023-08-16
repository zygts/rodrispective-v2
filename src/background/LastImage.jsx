import React, { useRef, useState, useEffect } from "react";
import { PlaneGeometry, TextureLoader } from "three";
import { useLastImageScrollAnimation } from './useLastImageScrollAnimation';
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImage = ({ scrollableRef }) => {
    const [texture, setTexture] = useState(null);
    const lastImageRef = useRef();
    const [isTextureLoaded, setIsTextureLoaded] = useState(false);

    // Carga solo la última imagen como textura
    useEffect(() => {
      const loader = new TextureLoader();
      const textureFile = "frame1-2.jpg"; // Nombre del archivo de la última imagen
    
      loader.load(`./img/homepage/${textureFile}`, (texture) => {
        setTexture(texture);
        setIsTextureLoaded(true); // actualiza el estado una vez que la textura esté cargada
      });
    }, []);

    useLastImageScrollAnimation(lastImageRef, scrollableRef, isTextureLoaded);
    
    if (!texture) {
      return null;
    }
  
    return (
      <mesh ref={lastImageRef} scale={[1, 1, 1]} position={[0, 1.5, 3]} rotation={[0, 0, 0]}>
        <planeGeometry args={[14, 8.5]} />
        <shaderMaterial
            uniforms={{
                uTexture: { type: "t", value: texture },
                uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
                uAspectRatio: { value: window.innerWidth / window.innerHeight },
                u_opacity: {value: 0.0}
            }}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent={true}
            // wireframe={true}
            />
      </mesh>
    );
};
  
export default LastImage;
