export function makeAudio(path: string): HTMLAudioElement {
  const newMediaElement = document.createElement("audio");
  newMediaElement.src = path;
  document.body.append(newMediaElement);
  return newMediaElement;
}
