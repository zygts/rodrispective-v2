import { useEffect } from "react";

export function useAudioSetup(audioCtx, content, setAudio) {
  useEffect(() => {
    if (!audioCtx || !content?.audioFileUrl) return;

    const audioElement = document.createElement("audio");
    audioElement.src = content.audioFileUrl;
    audioElement.preload = "metadata";

    const track = audioCtx.createMediaElementSource(audioElement);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;

    track.connect(analyser);
    track.connect(audioCtx.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const getAverageVolume = () => {
      analyser.getByteFrequencyData(data);
      return data.reduce((sum, val) => sum + val, 0) / data.length;
    };

    setAudio({
      element: audioElement,
      getAverageVolume,
    });

    return () => {
      audioElement.pause();
      audioElement.src = "";
    };
  }, [audioCtx, content, setAudio]);
}
