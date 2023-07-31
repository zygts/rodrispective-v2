import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (
  uniforms,
  textures,
  scrollableRef,
  camera,
  glitchAnimationRef
) => {
  useEffect(() => {
    let scrollAnimation = null;

    if (!uniforms || !textures[0] || !scrollableRef.current) {
      return;
    }

    const imageShowTime = 0.7; // 80% del tiempo
    const transitionTime = 0.3; // 20% del tiempo
    const scrollStartOffset = 0.15;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: scrollableRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0 && glitchAnimationRef.current) {
            uniforms.uGlitch.value = 0;
            glitchAnimationRef.current.kill();
            glitchAnimationRef.current = null;
          }
          let adjustedScroll =
            (self.progress - scrollStartOffset) / (1.0 - scrollStartOffset);
          adjustedScroll = gsap.utils.clamp(0.0, 1.0, adjustedScroll);
          uniforms.uScroll.value = adjustedScroll;

          const numImages = textures.length;
          const index = Math.min(
            Math.floor((progress / (imageShowTime + transitionTime)) * numImages),
            numImages - 1
          );
          const imageProgress = progress * numImages - index;

          if (imageProgress <= imageShowTime) {
            uniforms.currentTexture.value = textures[index];
            uniforms.nextTexture.value = textures[index];
            uniforms.mixValue.value = 0;
            // uniforms.uGlitch.value = 0;
          } else if (index < numImages - 1) {
            // Evita la transición si es la última textura
            const transitionProgress = (imageProgress - imageShowTime) / transitionTime;
            uniforms.currentTexture.value = textures[index];
            uniforms.nextTexture.value = textures[index + 1];
            uniforms.mixValue.value = transitionProgress;
            const glitchTransitionProgress = Math.min(transitionProgress * 2, 1);
            // uniforms.uGlitch.value = Math.sin(glitchTransitionProgress * Math.PI) * 0.1;
          }
        },
        onStart: () => {
          uniforms.currentTexture.value = textures[0];
          uniforms.nextTexture.value = textures[1];
          uniforms.mixValue.value = 0;
          // uniforms.uGlitch.value = 0;
        },
      },
    });

    if (camera) {
      timeline.add(
        gsap.to(camera, {
          zoom: 0.04,
          ease: "power1.inOut",
          onUpdate: () => camera.updateProjectionMatrix(),
        }),
        0
      );
    }

    scrollAnimation = timeline;

    return () => {
      if (scrollAnimation) {
        scrollAnimation.kill();
      }
    };
  }, [textures, uniforms, scrollableRef.current, camera, glitchAnimationRef]);
};
