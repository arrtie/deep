import { useEffect, useState } from "preact/hooks";
import { Subscription } from "rxjs";
import { Playback } from "../../Playback";
import { ActionBarButtons } from "./ActionBarButtons";

export default function ActionBar({
  playback,
  reset,
}: {
  playback: Playback | null;
  reset: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  if (playback == null) {
    return <p>Action Bar Placeholder</p>;
  }
  useEffect(() => {
    let sub: null | Subscription = null;
    if (playback != null) {
      sub = playback.stopwatchStream.subscribe({
        next: (stopwatchState) => {
          if (stopwatchState?.state !== "playing") {
            setPlaying(false);
            return;
          }
          setPlaying(true);
        },
      });
      return () => {
        if (sub != null) {
          sub.unsubscribe();
        }
      };
    }
  }, [playback]);

  return (
    <ActionBarButtons
      play={() => playback.play()}
      pause={() => playback.pause()}
      playing={playing}
      disabled={false}
      reset={() => reset()}
    />
  );
}
