import { Howl } from "howler";
import { makeSound } from "./soundAdapter";
export const soundMap = new Map<SoundId, Howl>();
export type SoundId = keyof typeof idToSrc;

export const idToSrc = {
  rain: { src: "assets/rain.mp4", loop: true },
  whitenoise: { src: "assets/whitenoise.mp4", loop: true },
  bell: { src: "assets/little-bell.wav", loop: false },
};

export function getSoundOptionsFromId(id: SoundId) {
  return idToSrc[id];
}

export const soundManager = {
  get(id: SoundId) {
    const sound = soundMap.get(id);
    if (sound != null) {
      return sound;
    }
    return this.addSound(id);
  },
  addSound(id: SoundId) {
    const options = getSoundOptionsFromId(id);
    const newSound = makeSound(options.src);
    soundMap.set(id, newSound);
    return newSound;
  },
  toString() {
    return `keys: ${soundMap.keys()} \n values: ${soundMap.values()}`;
  },
};
