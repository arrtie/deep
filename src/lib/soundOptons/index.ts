
export const idToSrc: Record<SoundId, HowlOptions = {
  rain: { src: "assets/rain.mp4", loop: true },
  whitenoise: { src: "assets/whitenoise.mp4", loop: true },
  bell: { src: "assets/note_g.mp3", loop: false, fade: 3000 },
};

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
]);export type SoundId = keyof typeof idToSrc;

