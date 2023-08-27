import { useState, useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Points,
  TextureLoader,
  ShaderMaterial,
  Vector2,
} from "three";
import { useSpring } from "@react-spring/three";
import { randFloat } from "three/src/math/MathUtils";
import vertexShader from "./particles.vert";
import fragmentShader from "./particles.frag";

export default function ParticlesLogic(isPlaying, audio, cursorPosition, showIntro) {
  const geometry = new BufferGeometry();
  const materialRef = useRef();

  const [uProgress, setUProgress] = useState(0);

  const multiplier = 18;
  const vertices = [];
  const initPositions = [];
  const [gridSize, setGridSize] = useState({
    nbColumns: 16 * multiplier,
    nbLines: 9 * multiplier,
  });

  for (let i = 0; i < gridSize.nbColumns; i++) {
    for (let j = 0; j < gridSize.nbLines; j++) {
      const point = [i, j, 0];
      const initPoint = [
        i - gridSize.nbColumns / 2,
        j - gridSize.nbLines / 2,
        randFloat(0, 300),
      ];

      vertices.push(...point);
      initPositions.push(...initPoint);
    }
  }

  const totalVertices = new Float32Array(vertices, 3);
  const totalInitPositions = new Float32Array(initPositions, 3);

  const [texture, setTexture] = useState(null);
  useEffect(() => {
    const loader = new TextureLoader();
    loader.load("./img/rodri1.jpg", (loadedTexture) => {
      setTexture(loadedTexture);
    });
  }, []);

  geometry.setAttribute("position", new BufferAttribute(totalVertices, 3));
  geometry.setAttribute("initPosition", new BufferAttribute(totalInitPositions, 3));
  geometry.center();

  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uPointSize: {
        value: 10,
      },
      uTexture: { type: "t", value: texture },
      uNbLines: { value: gridSize.nbLines },
      uNbColumns: { value: gridSize.nbColumns },
      uProgress: { value: uProgress },
      uFrequency: { value: 0.1 },
      uTime: { value: 0 },
      uSoundVolume: { value: 0.0 },
      uIntensity: { value: 0.2 },
      uMousePos: { value: cursorPosition },
      uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
      uAspectRatio: { value: window.innerWidth / window.innerHeight },
      uShowIntro: { value: showIntro ? 1.0 : 0.0 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new Points(geometry, material);
  materialRef.current = material;

  const { position, rotation } = useSpring({
    position: isPlaying ? [20, 0, -45] : [0, 0, -30],
    rotation: isPlaying ? [0, Math.PI / 56, 0] : [0, 0, 0],
    config: { tension: 200, friction: 50 },
  });

  return {
    position,
    rotation,
    mesh,
    geometry,
    material,
    uProgress,
    setUProgress,
    texture,
    setTexture,
  };
}
