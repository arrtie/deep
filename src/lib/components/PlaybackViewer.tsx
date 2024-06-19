// for each config in PlaybackQueueConfig
// create an element to display:
// it's name
// if it's a background

import { PlaybackBase } from "../orchestrate/orchestrate";
import { clearPlaybackQueue } from "../streams/PlaybackQueue";

const titleMap = new Map([
  ["assets/whitenoise.mp4", "Whitenoise"],
  ["assets/little-bell.wav", "Bell"],
  ["assets/rain.mp4", "Rain"],
]);

export default function PlaybackViewer({
  userPlaybackOptions,
}: {
  userPlaybackOptions: PlaybackBase[];
}) {
  return (
    <section style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        {userPlaybackOptions.map((option) => (
          <div
            style={{
              flex: "1 1 auto",
              borderRadius: "4px",
              margin: "8px",
              padding: "8px",
              backgroundColor: "steelblue",
            }}
          >
            <p>{titleMap.get(option.src)}</p>
            {option.interval === 0 ? null : (
              <p>Repeat every {option.interval} min.</p>
            )}
          </div>
        ))}
      </div>
      {userPlaybackOptions.length === 0 ? null : (
        <aside style={{ flex: "1 1 auto" }}>
          <button type="button" onClick={() => clearPlaybackQueue()}>
            CLEAR
          </button>
        </aside>
      )}
    </section>
  );
}
