import { Howl } from "howler";
import { makeSound } from "./soundOptons/soundAdapter";
export const soundMap = new Map<SoundId, Howl>();
export type SoundId = keyof typeof idToSrc;

export const idToSrc = {
  rain: { src: "assets/rain.mp4", loop: true, kind: "background" },
  whitenoise: { src: "assets/whitenoise.mp4", loop: true, kind: "background" },
  bell: { src: "assets/little-bell.wav", loop: false, kind: "interval" },
};

export function getSoundOptionsFromId(id: SoundId) {
  return idToSrc[id];
}

export function getKindById(soundId: SoundId) {
  return getSoundOptionsFromId(soundId).kind;
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
