import { HowlOptions } from "howler";

export const idToSrc: Record<string, HowlOptions> = {
  rain: { src: "assets/rain.mp4", loop: true },
  whitenoise: { src: "assets/white-noise-03.mp3", loop: true },
  bell: { src: "assets/note_g.mp3", loop: false },
};
export type SoundId = keyof typeof idToSrc;

export function getSoundOptionsFromId(id: SoundId) {
  return idToSrc[id];
}

export const titleMap = new Map([
  ["assets/whitenoise.mp4", "Whitenoise"],
  ["assets/note_g.mp3", "Bell"],
  ["assets/rain.mp4", "Rain"],
  ["whitenoise", "Whitenoise"],
  ["bell", "Bell"],
  ["rain", "Rain"],
]);
