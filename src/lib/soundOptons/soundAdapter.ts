import { Howl } from "howler";

export function makeSound(src: string) {
  return new Howl({
    src: [src],
  });
}
