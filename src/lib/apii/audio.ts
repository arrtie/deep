export async function getAudio(path: string, ctx: AudioContext) {
  return fetch(path)
    .then((data) => data.arrayBuffer())
    .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer));
}
