import { useState, useEffect, useRef } from "react";
import { TextureLoader } from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import vertexShader from "./images.vert";
import fragmentShader from "./images.frag";

gsap.registerPlugin(ScrollTrigger);

const Images = ({ scrollableRef }) => {
  const [textures, setTextures] = useState([null, null, null, null, null]);
  const [uniforms, setUniforms] = useState(null);
  const scrollableHeight = useRef(null);

useEffect(() => {
  const loader = new TextureLoader();
  const textureFiles = [
    "frame3.jpg",
    "frame1.jpg",
    "frame2.jpg",
    "frame4.jpg",
    "frame5.jpg",
  ];

  const promises = textureFiles.map(
    (file) =>
      new Promise((resolve) => {
        loader.load(`./img/homepage/${file}`, resolve);
      })
  );

  Promise.all(promises).then((loadedTextures) => {
    setTextures(loadedTextures);
    setUniforms({
      currentTexture: { type: "t", value: loadedTextures[0] },
      nextTexture: { type: "t", value: loadedTextures[1] },
      mixValue: { value: 0.0 },
      uResolution: { value: { x: window.innerWidth, y: window.innerHeight } },
      uAspectRatio: { value: window.innerWidth / window.innerHeight },
    });
  });

  // Getting the height of the scrollable div.
  if (scrollableRef.current) {
    scrollableHeight.current = scrollableRef.current.scrollHeight;
  }
}, []);

useEffect(() => {
  const onResize = () => {
    if (uniforms) {
      uniforms.uResolution.value.x = window.innerWidth;
      uniforms.uResolution.value.y = window.innerHeight;
      uniforms.uAspectRatio.value = window.innerWidth / window.innerHeight;
    }
  };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, [uniforms]);

useEffect(() => {
  let scrollAnimation = null;

  if (!uniforms || !textures[0] || !scrollableRef.current) {
    return;
  }

  const numImages = textures.length;
  const imageShowTime = 0.8; // 80% del tiempo
  const transitionTime = 0.2; // 20% del tiempo

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: scrollableRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.floor(progress / (imageShowTime + transitionTime) * numImages);
        const imageProgress = (progress * numImages) - index;

        if (imageProgress <= imageShowTime) {
          uniforms.currentTexture.value = textures[index % numImages];
          uniforms.nextTexture.value = textures[index % numImages];
          uniforms.mixValue.value = 0;
        } else {
          uniforms.currentTexture.value = textures[index % numImages];
          uniforms.nextTexture.value = textures[(index + 1) % numImages];
          uniforms.mixValue.value = (imageProgress - imageShowTime) / transitionTime;
        }
      },
      onStart: () => {
        uniforms.currentTexture.value = textures[0];
        uniforms.nextTexture.value = textures[1];
        uniforms.mixValue.value = 0;
      }
    },
  });

  scrollAnimation = timeline;

  return () => {
    if (scrollAnimation) {
      scrollAnimation.kill();
    }
  };
}, [textures, uniforms, scrollableRef.current]);



if (!uniforms) {
  return null;
}

  return (
    <mesh position={[0, 0, 4]}>
      <planeGeometry args={[60, 38]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default Images;
