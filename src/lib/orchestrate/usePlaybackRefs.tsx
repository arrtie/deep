import { useEffect, useState } from "preact/hooks";
import {
  PlaybackBase,
  PlaybackRef,
  Playbacksrc,
  addPlaybackRefs,
  addPlaybacksrc,
  makePlaybackRef,
  playbackSubject,
} from "../orchestrate";

export default function usePlaybackRefs(playbacksrcs: Playbacksrc[]) {
  const [playbackRefs, setplaybackRefs] = useState<PlaybackRef[]>([]);

  useEffect(() => {
    playbacksrcs.forEach(addPlaybacksrc);
    playbackSubject.subscribe({
      next(playback: PlaybackBase[]) {
        const localRefs = playback.map(makePlaybackRef);
        addPlaybackRefs(localRefs);
        setplaybackRefs(localRefs);
      },
    });
  }, []);
  return playbackRefs;
}
