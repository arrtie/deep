import { useEffect, useState } from "preact/hooks";
import { PlaybackBase } from "../orchestrate/orchestrate";
import { subscribeToPlaybackQueue } from "../streams/PlaybackQueue";

export default function usePlaybackOptions(): PlaybackBase[] {
  // subscribe to stream
  // set playbackOptionState on event
  const [options, setOptions] = useState<PlaybackBase[]>([]);
  useEffect(() => {
    const subscription = subscribeToPlaybackQueue({
      next(playbackBases: PlaybackBase[]) {
        setOptions([...playbackBases]);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return options;
}
