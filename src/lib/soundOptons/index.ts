import { HowlOptions } from "howler";

interface SoundSetup extends HowlOptions {
  title: string;
}
const idToSoundSetup: Record<string, SoundSetup> = {
  rain: { src: "assets/rain.mp4", loop: true, title: "Rain" },
  whitenoise: {
    src: "assets/white-noise-03.mp3",
    loop: true,
    title: "Whitenoise",
  },
  bell: { src: "assets/note_g.mp3", loop: false, title: "Bell 1" },
  e_note: { src: "assets/c2_e.mp3", loop: false, title: "Bell 2" },
  g_note: { src: "assets/c2_g.mp3", loop: false, title: "Bell 3" },
};

export type SoundId = keyof typeof idToSoundSetup;

export function getSoundSetup(id: SoundId) {
  return idToSoundSetup[id];
}

export function getSoundTitle(id: SoundId) {
  return idToSoundSetup[id].title;
}

export function getIntervalSoundSetupAll() {
  return Array.from(Object.entries(idToSoundSetup))
    .map(([index, value]) => {
      return { id: index, ...value };
    })
    .filter((value) => value.loop === false);
}

export function getSoundOptionsFromId(id: SoundId) {
  const { src, loop } = getSoundSetup(id);
  return {
    src,
    loop,
  };
}
