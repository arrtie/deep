import { Howl } from "howler";
import { getSoundOptionsFromId, SoundId } from ".";
import { makeSound } from "./soundAdapter";
export const soundMap = new Map<SoundId, Howl>();
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
    const newSound = makeSound(options);
    soundMap.set(id, newSound);
    return newSound;
  },
  toString() {
    return `keys: ${soundMap.keys()} \n values: ${soundMap.values()}`;
  },
};
