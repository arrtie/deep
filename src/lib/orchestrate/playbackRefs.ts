import { PlaybackRef } from "./orchestrate";

const playbackRefMap = new Map<string, PlaybackRef>();

export function getPlaybackRefArray() {
  return Array.from(playbackRefMap.entries()).map(([, val]) => val);
}

export function addPlaybackRef(ref: PlaybackRef) {
  playbackRefMap.set(ref.src, ref);
}

export function addPlaybackRefs(refs: PlaybackRef[]) {
  playbackRefMap.clear();
  refs.forEach((ref) => addPlaybackRef(ref));
}
