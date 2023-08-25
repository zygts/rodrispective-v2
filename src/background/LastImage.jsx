import React, { useRef, useState, useEffect } from "react";
import {
  TextureLoader,
  BufferGeometry,
  PlaneGeometry,
  Mesh,
  Vector3,
  BufferAttribute,
  ShaderMaterial,
} from "three";
import gsap from "gsap";
import * as dat from "dat.gui";

import { useLastImageScrollAnimation } from "./useLastImageScrollAnimation";
import vertexShader from "./lastImage.vert";
import fragmentShader from "./lastImage.frag";

const LastImage = ({ scrollableRef }) => {
  const [texture, setTexture] = useState(null);
  const [triangles, setTriangles] = useState([]);
  const lastImageRef = useRef();
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  // Carga solo la última imagen como textura
  useEffect(() => {
    const loader = new TextureLoader();
    const textureFile = "frame1-2.jpg";

    loader.load(`./img/homepage/${textureFile}`, (texture) => {
      setTexture(texture);
    });
  }, []);

  useLastImageScrollAnimation(lastImageRef, scrollableRef, isTextureLoaded);

  // Descompone la geometría en triángulos y crea Meshes individuales
  useEffect(() => {
    if (texture) {
      const geometry = new PlaneGeometry(14, 8.5, 28, 17).toNonIndexed();
      const individualTriangles = [];

      for (let i = 0; i < geometry.attributes.position.count; i += 3) {
        const vertices = [
          new Vector3().fromBufferAttribute(geometry.attributes.position, i),
          new Vector3().fromBufferAttribute(geometry.attributes.position, i + 1),
          new Vector3().fromBufferAttribute(geometry.attributes.position, i + 2),
        ];

        const uv = [
          new Vector3().fromBufferAttribute(geometry.attributes.uv, i),
          new Vector3().fromBufferAttribute(geometry.attributes.uv, i + 1),
          new Vector3().fromBufferAttribute(geometry.attributes.uv, i + 2),
        ];

        const triangleGeometry = new BufferGeometry().setFromPoints(vertices);
        triangleGeometry.setAttribute("uv", new BufferAttribute(new Float32Array(6), 2));

        triangleGeometry.attributes.uv.setXY(0, uv[0].x, uv[0].y);
        triangleGeometry.attributes.uv.setXY(1, uv[1].x, uv[1].y);
        triangleGeometry.attributes.uv.setXY(2, uv[2].x, uv[2].y);

        const mesh = new Mesh(
          triangleGeometry,
          new ShaderMaterial({
            uniforms: {
              uTexture: { type: "t", value: texture },
              uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
              uAspectRatio: { value: window.innerWidth / window.innerHeight },
              u_opacity: { value: 0.0 },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
          })
        );
        // Establecer la posición inicial de cada triángulo
        mesh.position.set(0, 1.5, 3);
        individualTriangles.push(mesh);
      }
      // Asigna el último triángulo al imageRef
      lastImageRef.current = individualTriangles[individualTriangles.length - 1];

      setTriangles(individualTriangles);
    }
  }, [texture]);

  // Configura dat.gui
  useEffect(() => {
    const gui = new dat.GUI();
    const reversedTriangles = [...triangles].reverse();
    const animateTornado = () => {
      reversedTriangles.forEach((triangle, index) => {
        gsap.to(triangle.position, {
          delay: index * 0.002, // Añade un retraso basado en el índice
          duration: 1.5,
          ease: "power2.out",
          x: `+=${3.5 * Math.cos(index * 0.05 + gsap.ticker.time)}`, // Desplazamiento más sutil en el eje x
          z: `+=${0.005 * Math.sin(index * 0.005 + gsap.ticker.time)}`, // Limita el desplazamiento en el eje z
          onUpdate: function () {
            triangle.rotation.y += 0.1;
            triangle.rotation.z += 0.1;
          },
        });
      });
    };
    // Asocia la función animateTornado al botón "start"
    const controls = {
      start: animateTornado,
    };
    gui.add(controls, "start");

    // Cleanup
    return () => {
      gui.destroy();
    };
  }, [triangles]);

  return (
    <>
      {triangles.map((triangle, index) => (
        <primitive key={index} object={triangle} />
      ))}
    </>
  );
};

export default LastImage;
