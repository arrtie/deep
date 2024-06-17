// for each config in PlaybackQueueConfig
// create an element to display:
// it's name
// if it's a background

import { PlaybackBase } from "../orchestrate/orchestrate";
import { clearPlaybackQueue } from "../streams/PlaybackQueue";

export default function PlaybackViewer({
  userPlaybackOptions,
}: {
  userPlaybackOptions: PlaybackBase[];
}) {
  return (
    <section>
      {userPlaybackOptions.map((option) => (
        <div>
          <p>{option.src}</p>
          <p>{option.interval}</p>
        </div>
      ))}
      <button type="button" onClick={() => clearPlaybackQueue()}>
        CLEAR
      </button>
    </section>
  );
}
