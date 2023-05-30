import { useEffect, useState } from "react";
import { TextureLoader } from "three";
import Cube from "./Cube";

export default function CubeGroup({
  active,
  setActive,
  radius,
  handleCubeClick,
  isAnimationFinished,
  resetCamera,
}) {
  const [textures, setTextures] = useState([]);
  const [cubeContents, setCubeContents] = useState([]);

  useEffect(() => {
    const texturePaths = [
      "./img/t1.jpg",
      "./img/t2.jpg",
      "./img/t3.jpg",
      "./img/t4.jpg",
      "./img/t5.jpg",
      "./img/t6.jpg",
      "./img/t7.jpg",
      "./img/t8.jpg",
      "./img/t9.jpg",
      "./img/t10.jpg",
      "./img/t11.jpg",
      "./img/t12.jpg",
      "./img/t13.jpg",
      "./img/t14.jpg",
      "./img/t15.jpg",
    ];

    const loader = new TextureLoader();
    const loadedTextures = texturePaths.map((path) => loader.load(path));
    setTextures(loadedTextures);

    const contents = [
      {
        title: "Amanecer en el mar",
        paragraph:
          "Inspired by late-night coding sessions during my early years as a programmer, 'Digital Dreams' is a vibrant journey through a pulsing cybernetic dreamscape. Synthesized melodies, reminiscent of the twinkling constellations I would gaze at from my rooftop, intertwine with futuristic beats and echo the rhythmic typing that fueled my creative process. This hypnotic dance floor anthem is a testament to those evenings that blurred the lines between reality and imagination, serving as a metaphor for my journey into the world of electronic music production.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Things to say on a wednesday morning",
        paragraph:
          " As a child, I was fascinated by the radio's ability to transport stories and emotions across vast distances. 'Frequency Fables' reflects this early fascination. This track playfully explores electronic soundscapes, each fluctuating wavelength and layered harmonic intended to transport listeners on a sonic rollercoaster ride. Every beat, bass line, and melodic rift contributes to a rich, ever-evolving narrative that tells the story of my personal journey through the world of music.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Mentiras para ilusos",
        paragraph:
          " Inspired by my long-standing fascination with quantum mechanics and the nature of the universe, 'Quantum Echoes' combines elements of downtempo and ambient music to create an otherworldly atmosphere. Ethereal synths and minimalist beats echo across a universe of sound, suggesting the interconnectedness of all things and the vastness of the cosmos. It's a sonic manifestation of my contemplative moments spent stargazing, pondering the mysteries of the universe.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Homenaje",
        paragraph:
          "From a young age, I was captivated by the power of the human voice. 'Vox Illumination' is a testament to that fascination, celebrating the art of vocal manipulation. Processed vocals, transformed into transcendent melodies, weave through a labyrinth of deep bass lines and intricate beats. The resulting sonic texture is a tribute to my early choir days, the layering of human voices, and the complex harmonies we would create.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Boca / Voz / Grito",
        paragraph:
          "Growing up in a city renowned for its extensive underground network, I found a unique rhythmic pulse beneath the surface. 'Subterranean Pulse' is a sonic exploration into the heart of the earth, inspired by the subways' rhythm, the subterranean ecosystems, and the city's heartbeat. The deep, resonant bass represents this thrum, while higher synth patterns mimic life stirring beneath the urban surface.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Farewell to None",
        paragraph:
          "As a child, I was captivated by the colors of the northern lights dancing across the night sky. 'Neon Nebula' is a dynamic burst of color and sound that captures the vibrant energy of those lights. This track pulses with lively synth and progressive beats, merging the awe-inspiring beauty of a cosmic light show with the captivating energy of a supernova.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Piggy Bites",
        paragraph:
          " Growing up in a bustling metropolis, I found solace in quiet parks nestled amidst the urban chaos. 'Synthetic Serenity' captures this sense of peace amid turmoil. Soft, undulating synth chords and gentle, rhythmic percussion lull the listener into a state of calm, while ambient sounds provide an organic touch to the synthesized composition, mirroring my experiences of finding tranquility in nature amidst the city's cacophony.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Black Ghosts of the Archway",
        paragraph:
          "My early music education in classical piano melded with my passion for technology in 'Cybernetic Sonata'. This track blends classical melodies with electronic rhythms, creating a fusion of old and new that captures my personal and artistic journey. The sophisticated air maintained throughout the track is a nod to my classical roots, while the heart-pounding beats reflect my immersion into the world of electronic music.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Solo Quieren Jugar",
        paragraph:
          "Inspired by my lifelong dream of space exploration, 'Astral Aura' is a musical journey through the stars. Ethereal soundscapes, celestial synths, and dreamy rhythms encapsulate the beauty of a cosmic voyage, making for a surreal and transcendent listening experience. This track embodies my curiosity and fascination with the cosmos, serving as a sonic exploration of my own 'space odyssey'.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Un Niño",
        paragraph:
          "Growing up near the ocean, I was always captivated by the rhythmic flow of the tides. 'Techno Tides' captures this natural rhythm in the context of our digital age. Thumping bass and hypnotic beats roll like waves in a digital ocean, embodying the ebb and flow of life as a modern music artist and the inevitable tides of technological change.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Birthday Present",
        paragraph:
          "Inspired by my urban upbringing, 'Grid Groove' pays homage to the city's grids and the vibrant life within them. With bustling beats, soaring synths, and pulsating bass, this track reflects the heart and soul of urban living, capturing the essence of city streets that formed my early experiences and influenced my music.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Dame Misterio",
        paragraph:
          "As an artist navigating the digital world, I've often marveled at our virtual interconnectedness. 'Binary Bliss' is a melodic meditation on this digital existence. The repetitive, soothing rhythms paired with floating arpeggios echo the binary code underpinning our virtual world, symbolizing my fascination with the convergence of music and technology.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Burakumin",
        paragraph:
          "This high-energy track is a celebration of joy and abandon. Its infectious rhythms, catchy hook, and buoyant synths create a surge of positivity reflecting my optimistic outlook on life. 'Electro Euphoria' is about the thrill of performing live, the joy of connecting with an audience, and the shared ecstasy of a crowd moving in unison to the beat.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "He Eyes Blue Ice",
        paragraph:
          "This downtempo track is a serene yet poignant ode to the day's end. Inspired by countless evenings spent coding, its warm synth pads and subtle beats evoke the feeling of watching the sun set over a cityscape. 'Silicon Sunset' captures the peace that comes with the conclusion of a productive day and the anticipation of the creative possibilities the next day holds.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Equatorial Coordinates",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      // ...
    ];
    setCubeContents(contents);
  }, []);

  const handleBackClick = () => {
    setActive(null);
  };

  return textures.map((texture, index) => (
    <Cube
      key={index}
      index={index}
      radius={radius}
      isActive={index === active}
      texture={textures[index]}
      content={cubeContents[index]}
      onClick={() => {
        if (active === null) {
          handleCubeClick(index);
        }
      }}
      onBackClick={handleBackClick}
      resetCamera={resetCamera}
      isAnimationFinished={isAnimationFinished}
    />
  ));
}
