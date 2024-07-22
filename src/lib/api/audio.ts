export async function getAudio(path: string) {
  return fetch(path).then((data) => data.arrayBuffer());
}

export async function decodeAudioData(
  arrayBuffer: ArrayBuffer,
  ctx: AudioContext
) {
  return ctx.decodeAudioData(arrayBuffer);
}

export async function handleGetAudio(path: string, ctx: AudioContext) {
  return getAudio(path)
    .then((arrayBuffer) => decodeAudioData(arrayBuffer, ctx))
    .catch((error) => {
      console.warn(`error fetching "${path}"`, error);
      return null;
    });
}
