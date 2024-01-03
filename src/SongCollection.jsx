import { useEffect, useState, useContext } from "react";
import { TextureLoader } from "three";

import { AppContext } from "./appContext";
import Cube from "./Song";

export default function CubeGroup({
  radius,
  handleCubeClick,
  isAnimationFinished,
  resetCamera,
}) {
  const [textures, setTextures] = useState([]);
  const [cubeContents, setCubeContents] = useState([]);

  useEffect(() => {
    const texturePaths = [
      "./img/amanecer.jpg",
      "./img/wednesday.jpg",
      "./img/mentiras.jpg",
      "./img/homenaje.jpg",
      "./img/boca.jpg",
      "./img/farewell.jpg",
      "./img/piggy.jpg",
      "./img/airports.jpg",
      "./img/ghosts.jpg",
      "./img/solo.jpg",
      "./img/nino.jpg",
      "./img/birthday.jpg",
      "./img/requiem.jpg",
      "./img/burakumin.jpg",
      "./img/blueice.jpg",
      "./img/equatorial.jpg",
      "./img/edad.jpg",
      "./img/fake.jpg",
      "./img/tigre.jpg",
      "./img/iraq.jpg",
      "./img/short.jpg",
      "./img/urbania.jpg",
      "./img/tear.jpg",
      "./img/atmosphera.jpg",
      "./img/tenagumakao.jpg",
    ];

    const loader = new TextureLoader();
    const loadedTextures = texturePaths.map((path) => loader.load(path));
    setTextures(loadedTextures);

    const contents = [
      {
        title: "Amanecer en el mar",
        author: "Incierto",
        album: "Grito",
        year: "2018",
        paragraph:
          "This is one of the last tracks I ever recorded. At the time I thought it signified the highest point in my music career. It was inspired by recent events on the Mediterranean sea, when it seemed an atrocious amount of people were dying every day trying to reach a better life.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/amanecer.mp3",
      },
      {
        title: "Things to say on a wednesday morning",
        author: "Zygotus",
        album: "Glim.mer",
        year: "2006",
        paragraph:
          "A fan favourite, I made this song in just a couple of days, in a frantic moment of inspiration. The muse only touches you with her magic a few times during a lifetime. My mom keeps asking me why I don’t make music like this anymore.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/wednesday-morning.mp3",
      },
      {
        title: "Mentiras para ilusos",
        author: "Incierto",
        album: "El Ciclo de la Vida",
        year: "2017",
        paragraph:
          " Inspired by my long-standing fascination with quantum mechanics and the nature of the universe, 'Quantum Echoes' combines elements of downtempo and ambient music to create an otherworldly atmosphere. Ethereal synths and minimalist beats echo across a universe of sound, suggesting the interconnectedness of all things and the vastness of the cosmos. It's a sonic manifestation of my contemplative moments spent stargazing, pondering the mysteries of the universe.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/mentiras.mp3",
      },
      {
        title: "Homenaje",
        year: "2017",
        author: "Incierto",
        album: "El Ciclo de la Vida",
        paragraph:
          "From a young age, I was captivated by the power of the human voice. 'Vox Illumination' is a testament to that fascination, celebrating the art of vocal manipulation. Processed vocals, transformed into transcendent melodies, weave through a labyrinth of deep bass lines and intricate beats. The resulting sonic texture is a tribute to my early choir days, the layering of human voices, and the complex harmonies we would create.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/homenaje.mp3",
      },
      {
        title: "Boca, Voz, Grito",
        author: "Rdrk",
        album: "Historias del hambre",
        year: "2015",
        paragraph:
          "Growing up in a city renowned for its extensive underground network, I found a unique rhythmic pulse beneath the surface. 'Subterranean Pulse' is a sonic exploration into the heart of the earth, inspired by the subways' rhythm, the subterranean ecosystems, and the city's heartbeat. The deep, resonant bass represents this thrum, while higher synth patterns mimic life stirring beneath the urban surface.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/boca-voz-grito.mp3",
      },
      {
        title: "Farewell to None",
        year: "2005",
        author: "Zygotus",
        album: "Farewell to none",
        paragraph:
          "As a child, I was captivated by the colors of the northern lights dancing across the night sky. 'Neon Nebula' is a dynamic burst of color and sound that captures the vibrant energy of those lights. This track pulses with lively synth and progressive beats, merging the awe-inspiring beauty of a cosmic light show with the captivating energy of a supernova.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/farewell.mp3",
      },
      {
        title: "Piggy Bites",
        author: "Piggy Bites",
        year: "2017",
        album: "Piggy Bites",
        paragraph:
          " Growing up in a bustling metropolis, I found solace in quiet parks nestled amidst the urban chaos. 'Synthetic Serenity' captures this sense of peace amid turmoil. Soft, undulating synth chords and gentle, rhythmic percussion lull the listener into a state of calm, while ambient sounds provide an organic touch to the synthesized composition, mirroring my experiences of finding tranquility in nature amidst the city's cacophony.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/piggy.mp3",
      },
      {
        title: "Airports",
        author: "Zygotus",
        year: "2006",
        album: "Glim.mer",
        paragraph:
          " Growing up in a bustling metropolis, I found solace in quiet parks nestled amidst the urban chaos. 'Synthetic Serenity' captures this sense of peace amid turmoil. Soft, undulating synth chords and gentle, rhythmic percussion lull the listener into a state of calm, while ambient sounds provide an organic touch to the synthesized composition, mirroring my experiences of finding tranquility in nature amidst the city's cacophony.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/airports.mp3",
      },
      {
        title: "Black Ghosts of The Archway",
        author: "Zygotus",
        year: "2005",
        album: "Farewell to none",
        paragraph:
          "My early music education in classical piano melded with my passion for technology in 'Cybernetic Sonata'. This track blends classical melodies with electronic rhythms, creating a fusion of old and new that captures my personal and artistic journey. The sophisticated air maintained throughout the track is a nod to my classical roots, while the heart-pounding beats reflect my immersion into the world of electronic music.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/ghosts.mp3",
      },
      {
        title: "Solo Quieren Jugar",
        author: "Incierto",
        year: "2019",
        album: "Tiza negra",
        paragraph:
          "Inspired by my lifelong dream of space exploration, 'Astral Aura' is a musical journey through the stars. Ethereal soundscapes, celestial synths, and dreamy rhythms encapsulate the beauty of a cosmic voyage, making for a surreal and transcendent listening experience. This track embodies my curiosity and fascination with the cosmos, serving as a sonic exploration of my own 'space odyssey'.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/soloquierenjugar.mp3",
      },
      {
        title: "Un Niño",
        author: "Rdrk",
        year: "2015",
        album: "Historias del hambre",
        paragraph:
          "Growing up near the ocean, I was always captivated by the rhythmic flow of the tides. 'Techno Tides' captures this natural rhythm in the context of our digital age. Thumping bass and hypnotic beats roll like waves in a digital ocean, embodying the ebb and flow of life as a modern music artist and the inevitable tides of technological change.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/nino.mp3",
      },
      {
        title: "Birthday Present",
        author: "Zygotus",
        year: "2007",
        album: "Glim.mer",
        paragraph:
          "Inspired by my urban upbringing, 'Grid Groove' pays homage to the city's grids and the vibrant life within them. With bustling beats, soaring synths, and pulsating bass, this track reflects the heart and soul of urban living, capturing the essence of city streets that formed my early experiences and influenced my music.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/birthday.mp3",
      },
      {
        title: "Requiem",
        author: "Zygotus",
        year: "2017",
        album: "El Ciclo de la Vida",
        paragraph:
          "As an artist navigating the digital world, I've often marveled at our virtual interconnectedness. 'Binary Bliss' is a melodic meditation on this digital existence. The repetitive, soothing rhythms paired with floating arpeggios echo the binary code underpinning our virtual world, symbolizing my fascination with the convergence of music and technology.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/requiem.mp3",
      },
      {
        title: "Burakumin",
        author: "Zygts",
        year: "2008",
        album: "Late Recordings",
        paragraph:
          "This high-energy track is a celebration of joy and abandon. Its infectious rhythms, catchy hook, and buoyant synths create a surge of positivity reflecting my optimistic outlook on life. 'Electro Euphoria' is about the thrill of performing live, the joy of connecting with an audience, and the shared ecstasy of a crowd moving in unison to the beat.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/burakumin.mp3",
      },
      {
        title: "He Eyes Blue Ice",
        author: "Zygts",
        year: "2007",
        album: "Late Recordings",
        paragraph:
          "This downtempo track is a serene yet poignant ode to the day's end. Inspired by countless evenings spent coding, its warm synth pads and subtle beats evoke the feeling of watching the sun set over a cityscape. 'Silicon Sunset' captures the peace that comes with the conclusion of a productive day and the anticipation of the creative possibilities the next day holds.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/heeyes.mp3",
      },
      {
        title: "Equatorial Coordinates",
        author: "Max Gluckman",
        year: "2009",
        album: "minmax()",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/equatorial.mp3",
      },
      {
        title: "Edad Sin Piedad",
        author: "Incierto",
        year: "2017",
        album: "Edad sin piedad",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/edad.mp3",
      },
      {
        title: "#FakeNews",
        author: "Incierto",
        year: "2017",
        album: "Incierto",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/fakenews.mp3",
      },
      {
        title: "Tigre en El Ártico",
        author: "Rdrk",
        year: "2015",
        album: "Historias del hambre",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Requiem For Iraq",
        author: "Zygotus",
        year: "2005",
        album: "Farewell to none",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },

      {
        title: "Short Giraffes",
        author: "Max Gluckman",
        year: "2009",
        album: "minmax()",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Urbania",
        author: "Zygotus",
        year: "2003",
        album: "Early Recordings",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Love Will Tear Us Apart",
        author: "Zygotus",
        year: "2005",
        album: "Late Recordings",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Atmosphera (Part 4)",
        author: "Zygotus",
        year: "2005",
        album: "Early Recordings",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
      {
        title: "Tenagumakao",
        author: "Incierto",
        year: "2018",
        album: "Grito",
        paragraph:
          "Drawing inspiration from my fascination with virtual reality, 'Harmonic Hologram' fuses lush melodies with dynamic beats to create a vivid 3D soundscape. This track immerses listeners in a multi-layered sonic experience that mirrors the multi-dimensional landscapes of VR, reflecting my ongoing exploration of the intersections between music, technology, and perception.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/audio.mp3",
      },
    ];
    setCubeContents(contents);
  }, []);

  const { setActiveCube, activeCube } = useContext(AppContext);

  const handleBackClick = () => {
    setActiveCube(null);
  };

  return textures.map((texture, index) => (
    <Cube
      key={index}
      index={index}
      radius={radius}
      isActive={index === activeCube}
      texture={textures[index]}
      content={cubeContents[index]}
      onClick={handleCubeClick}
      onBackClick={handleBackClick}
      resetCamera={resetCamera}
      isAnimationFinished={isAnimationFinished}
    />
  ));
}
