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
      "./img/edad.jpg",
      "./img/boca.jpg",
      "./img/farewell.jpg",
      "./img/piggy.jpg",
      "./img/airports.jpg",
      "./img/ghosts.jpg",
      "./img/solo.jpg",
      "./img/nino.jpg",
      "./img/atmosphera.jpg",
      "./img/requiem.jpg",
      "./img/burakumin.jpg",
      "./img/blueice.jpg",
      "./img/equatorial.jpg",

      "./img/fake.jpg",
      "./img/tigre.jpg",
      "./img/iraq.jpg",
      "./img/short.jpg",
      "./img/urbania.jpg",
      "./img/tear.jpg",
      "./img/birthday.jpg",
      "./img/tenagumakao.jpg",
    ];

    const loader = new TextureLoader();
    const loadTexture = (path) => new Promise((resolve) => loader.load(path, resolve));
    const texturePromises = texturePaths.map(loadTexture);

    Promise.all(texturePromises).then((loadedTextures) => {
      setTextures(loadedTextures);
      setCubeContents(contents);

      // Retrasa el evento resourcesLoaded para simular un tiempo de carga más largo
      setTimeout(() => {
        window.dispatchEvent(new Event("resourcesLoaded"));
      }, 1000); // Retrasa por 3000 milisegundos (3 segundos)
    });

    const contents = [
      {
        title: "Amanecer en el mar",
        author: "Incierto",
        album: "Grito",
        year: "2018",
        paragraph:
          "This is one of the last songs I ever recorded in my life. When I finished it, I felt I was at my musical peak. I was on a roll, releasing track after track, and almost everything I did gave me satisfaction. I thought that maybe, just maybe this was finally my time to shine (it wasn't).",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/amanecer.mp3",
      },
      {
        title: "Things to say on a wednesday morning",
        author: "Zygotus",
        album: "Glim.mer",
        year: "2006",
        paragraph:
          "By far my most popular song among family and friends. I made it in just a couple of days, in a frantic rush of inspiration. The muse only touches you with her magic a few times during a lifetime. My mom keeps asking me why I don’t make music like this anymore.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/glim-mer",
        audioFileUrl: "./audio/wednesday-morning.mp3",
      },
      {
        title: "Mentiras para ilusos",
        author: "Incierto",
        album: "El Ciclo de la Vida",
        year: "2017",
        paragraph:
          "Making music has often been a painful process, like giving birth to a child. This track, however, was made during a time when that process was peak joy for me. I had lots of fun recording this track and even more fun playing it live. ",
        songUrl: "https://incierto.bandcamp.com/album/el-ciclo-de-la-vida",
        audioFileUrl: "./audio/mentiras.mp3",
      },
      {
        title: "Homenaje",
        year: "2017",
        author: "Incierto",
        album: "El Ciclo de la Vida",
        paragraph:
          "When I started my new project Incierto, I had a clear goal in mind: Moving away from the “teen angst” that had punctured much of my musical output with Zygotus towards a lighter, better humoured persona without losing the mysterious aura. It took me a few tentative attempts but in “Homenaje”, with its silly lyrics in homage to nature, I felt I had for the first time achieved that goal.",
        songUrl: "https://incierto.bandcamp.com/album/el-ciclo-de-la-vida",
        audioFileUrl: "./audio/homenaje.mp3",
      },
      {
        title: "Edad Sin Piedad",
        author: "Incierto",
        year: "2017",
        album: "Edad sin piedad",
        paragraph:
          "Incierto as a project was a completely new way of making music, of searching for sounds, a different way of being, even. It meant forgetting much of what I had been doing in the past. At the beginning it was a lot of trial and error, but when I finished this track I thought: this is the sound of Incierto.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/edad.mp3",
      },
      {
        title: "Boca, Voz, Grito",
        author: "Rdrk",
        album: "Historias del hambre",
        year: "2015",
        paragraph:
          "Years after recoding the last time as Zygotus, I realized all my songs were in english, and it felt a little phony. I hardly ever listened to music in my native language, so writing them in english felt more natural at the time. I decided to re-record some of my favourite past songs, this time in Spanish, using the my new-found style with Rdrk. In the end, unfortunately, I only managed to complete this one song.",
        songUrl: "https://rdrk.bandcamp.com/album/historias-del-hambre",
        audioFileUrl: "./audio/boca-voz-grito.mp3",
      },
      {
        title: "Farewell to None",
        year: "2005",
        author: "Zygotus",
        album: "Farewell to none",
        paragraph:
          "Musically speaking, I have been most prolific in the hardest times, and boy was this a hard time to be alive. Dazed and confused, lost in a foreign country, with no purpose in life, in this track you can hear the cracks trying to contain the blast from within. In that moment I remember wishing I had a band, or better resources, to convey that feeling of existential dread. I thought I did a pretty good job regardless of my technical limitations.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/farewell-to-none",
        audioFileUrl: "./audio/farewell.mp3",
      },
      {
        title: "Piggy Bites",
        author: "Piggy Bites",
        year: "2017",
        album: "Piggy Bites",
        paragraph:
          "Apart from a few sporadic collaborations, I've always been very reclusive when it comes to making music. After playing live in a bar, my bass player friend Varian approached me and proposed to start a band together. We only recorded a handful of songs, but it was extremely refreshing to have the chance of getting out of myself and musically connect with a kindred soul.",
        songUrl: "https://www.youtube.com/watch?v=uKapjZGFfWg",
        audioFileUrl: "./audio/piggy.mp3",
      },
      {
        title: "Airports",
        author: "Zygotus",
        year: "2006",
        album: "Glim.mer",
        paragraph:
          "There was a time when I found myself constantly waiting in an airport. It seemed to me a rather unreal place, where all kinds of emotions, of sadness, joy and boredom, permeated every inch of its walls. This song was my dedication to that bizarre place.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/glim-mer",
        audioFileUrl: "./audio/airports.mp3",
      },
      {
        title: "Black Ghosts of The Archway",
        author: "Zygotus",
        year: "2005",
        album: "Farewell to none",
        paragraph:
          "At a party I was approached by some university friends, surprised because they had somehow heard this track. They didn't know I made music and they really liked it. From that moment on, I thought that maybe it was time to stop keeping this hobby so secret!",
        songUrl: "https://zygotusmusic.bandcamp.com/album/farewell-to-none",
        audioFileUrl: "./audio/ghosts.mp3",
      },
      {
        title: "Solo Quieren Jugar",
        author: "Incierto",
        year: "2019",
        album: "Tiza negra",
        paragraph:
          "This is the last song I have ever recorded in my life. It is also one of the songs I am most satisfied with. If there is one that brings together all the roads I have travelled for more than 2 decades, every style, every transformation... it is undoubtedly this one.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/soloquierenjugar.mp3",
      },
      {
        title: "Un Niño",
        author: "Rdrk",
        year: "2015",
        album: "Historias del hambre",
        paragraph:
          "By the time I recorded Un Niño (”A Kid”), I already felt much more comfortable using my mother tongue. I thought I had managed to get to a more sincere, more starkly autobiographical point. There are a lot of raw emotions in this song, and I liked being able to get them out in this way.",
        songUrl: "https://rdrk.bandcamp.com/album/historias-del-hambre",
        audioFileUrl: "./audio/nino.mp3",
      },
      {
        title: "Birthday Present",
        author: "Zygotus",
        year: "2006",
        album: "Glim.mer",
        paragraph:
          "This song marked for me musically and personally, the end of an era. It was also the last time I made music under the pseudonym Zygotus. Everything was going to change from that moment on, but I hadn't realised it yet. Somehow, though, this track captures that moment of shift beautifully.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/glim-mer",
        audioFileUrl: "./audio/birthday.mp3",
      },
      {
        title: "Requiem",
        author: "Incierto",
        year: "2017",
        album: "El Ciclo de la Vida",
        paragraph:
          "One of my goals with Incierto was to be able to make 3-4 minute songs, almost pop songs, something that had always been particularly difficult for me. Possibly the only time in my life when I have been 100% satisfied with the result. For me, this song is perfect, in the sense that it sounds exactly the way I want, and I wouldn’t change one bit of it.",
        songUrl: "https://incierto.bandcamp.com/album/incierto",
        audioFileUrl: "./audio/requiem.mp3",
      },
      {
        title: "Burakumin",
        author: "Zygts",
        year: "2008",
        album: "Late Recordings",
        paragraph:
          "One thing I had always had trouble with was writing lyrics. The writing process used to slow down the musical expression that was sometimes too intense to contain. So on this occasion I decided to pick up the microphone and just blurt out the first nonsensical sounds that popped into my head, to keep the animal inside me from going to sleep.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/zygts-late-recordings",
        audioFileUrl: "./audio/burakumin.mp3",
      },
      {
        title: "He Eyes Blue Ice",
        author: "Zygts",
        year: "2007",
        album: "Late Recordings",
        paragraph:
          "Zygotus was over. Now I was Zygts, his older and more experimental brother. Not knowing what to expect, each track was an exciting blank canvas on which to try new things. At that time my raw voice, free from saying anything meaningful at all, became one of the most important forces in this search for new ways.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/zygts-late-recordings",
        audioFileUrl: "./audio/heeyes.mp3",
      },
      {
        title: "Equatorial Coordinates",
        author: "Max Gluckman",
        year: "2009",
        album: "minmax()",
        paragraph:
          "I had started the new Max Gluckman project as an excuse to look for different sounds. I wanted to explore new terrains closer to techno music and other more danceable rhythms. The new venture ended up being very short, but I had a blast doing it.",
        songUrl: "https://maxgluckman.bandcamp.com/album/minmax",
        audioFileUrl: "./audio/equatorial.mp3",
      },
      {
        title: "#FakeNews",
        author: "Incierto",
        year: "2017",
        album: "Incierto",
        paragraph:
          "I don't think I've ever made more joyful and luminous music. So bright that I never felt comfortable with it and never played it live. Although it did get some airplay online and was played on a couple of amateur radio stations. It just didn't feel like me. So when I finished it I went back to making depressing songs, which is what I was good at.",
        songUrl: "https://incierto.bandcamp.com/album/incierto",
        audioFileUrl: "./audio/fakenews.mp3",
      },
      {
        title: "Tigre en El Ártico",
        author: "Rdrk",
        year: "2015",
        album: "Historias del hambre",
        paragraph:
          "One of my biggest disappointments. I had high hopes for this song, thinking that it might be the one that would catapult me to a wider (not so tiny?) audience, but it never turned out exactly the way i wanted it to. I recorded the vocals a hundred times. I got stuck. Then I gave up. Often the best results come when expectations are the lowest.",
        songUrl: "https://rdrk.bandcamp.com/album/historias-del-hambre",
        audioFileUrl: "./audio/tigre.mp3",
      },
      {
        title: "Circle Sounds",
        author: "Zygts",
        year: "2006",
        album: "Late Recordings",
        paragraph:
          "In the early days of the internet, before social media, I participated in some collaborations with people on the other side of the screen. In this case it was with a guy who played the bagpipes and apparently admired my music. The mix of styles was a lot of fun, I would have liked to have done more.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/zygts-late-recordings",
        audioFileUrl: "./audio/circle.mp3",
      },

      {
        title: "Short Giraffes",
        author: "Max Gluckman",
        year: "2009",
        album: "minmax()",
        paragraph:
          "Making techno music (or whatever this was) was incredibly liberating for me. I found it refreshing to start with just a few sounds and work out something close to improvisation, without limits or expectations. Although I've rarely gone back to doing things in this style, this playful attitude has ended up helping my creative process in one way or another ever since.",
        songUrl: "https://maxgluckman.bandcamp.com/album/minmax",
        audioFileUrl: "./audio/giraffes.mp3",
      },
      {
        title: "Urbania",
        author: "Zygotus",
        year: "2003",
        album: "Early Recordings",
        paragraph:
          "Urbania was the first track I ever recorded, although I had been composing music in some form or another since I was a child. I was armed only with my Yamaha synthesiser, as my only recording equipment was the audio editing software that came with Windows 98 and a couple of home-made cables. Truly a feat for the ages.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/early-recordings",
        audioFileUrl: "./audio/urbania.mp3",
      },
      {
        title: "Love Will Tear Us Apart",
        author: "Zygotus",
        year: "2005",
        album: "Late Recordings",
        paragraph:
          "As a fun creative exercise, I have always had in mind to make extremely different covers of other people’s work, but rarely managed to complete them (Michael Jackson's Billy Jean is still half done). I found doing this one by Joy Division a lot of fun, although I wouldn't bet on their good reaction to it.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/zygts-late-recordings",
        audioFileUrl: "./audio/love.mp3",
      },
      {
        title: "Atmosphera (Part 4)",
        author: "Zygotus",
        year: "2005",
        album: "Early Recordings",
        paragraph:
          "The Zygotus era had sucked all the creative energy out of me. Every song ended up being a painful experience. So when I put the matter to rest, I just wanted to experiment, improvise and try new stuff with no clear goal in mind. It was a liberating process that culminated in my “Atmospheras” series.",
        songUrl: "https://zygotusmusic.bandcamp.com/album/early-recordings",
        audioFileUrl: "./audio/atmosphera.mp3",
      },
      {
        title: "Tenagumakao",
        author: "Incierto",
        year: "2018",
        album: "Grito",
        paragraph:
          "One of the weapons I had acquired after my several transformations and experiments was not to think too much about something if I couldn't figure out what I needed. In this case, I wanted to sing something but I didn't know what lyrics to put in my voice, so I just made it up. That word ended up being the title of the song, too.",
        songUrl: "https://incierto.bandcamp.com/album/grito",
        audioFileUrl: "./audio/tenagumakao.mp3",
      },
    ];
    setCubeContents(contents);

    window.dispatchEvent(new Event("resourcesLoaded")); // Notifica a Experience
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
