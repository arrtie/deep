import { Howl, HowlOptions } from "howler";

export function makeSound(options: HowlOptions) {
  return new Howl(options);
}
