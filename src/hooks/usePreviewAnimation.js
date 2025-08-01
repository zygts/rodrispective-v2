import { useRef, useCallback } from "react";
import { gsap } from "gsap";

export function usePreviewAnimation({ titleRef, authorRef, yearRef, setIsDivVisible }) {
  const tlPreview = useRef(null);

  const createTimeline = useCallback(() => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      tlPreview.current = gsap
        .timeline({ paused: true })
        .to([titleRef.current, authorRef.current, yearRef.current], {
          opacity: 1,
          x: 20,
          duration: 0.3,
          stagger: 0.12,
          ease: "power3.inOut",
        });
    }
  }, [titleRef, authorRef, yearRef]);

  const play = useCallback(() => {
    setIsDivVisible(true);
    createTimeline();
    tlPreview.current?.play();
  }, [createTimeline, setIsDivVisible]);

  const reverse = useCallback(() => {
    if (tlPreview.current) {
      tlPreview.current.eventCallback("onReverseComplete", () => {
        setIsDivVisible(false);
      });
      tlPreview.current.reverse();
    }
  }, [setIsDivVisible]);

  return { play, reverse };
}
