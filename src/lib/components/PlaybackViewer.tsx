// for each config in PlaybackQueueConfig
// create an element to display:
// it's name
// if it's a background

import { useMemo } from "preact/hooks";
import { PlaybackBase } from "../orchestrate/orchestrate";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";

const titleMap = new Map([
  ["assets/whitenoise.mp4", "Whitenoise"],
  ["assets/little-bell.wav", "Bell"],
  ["assets/rain.mp4", "Rain"],
]);

export default function PlaybackViewer() {
  const userPlaybackOptions = usePlaybackOptions();
  const [bg, opt] = useMemo(() => {
    const _bg: PlaybackBase[] = [];
    const _opt: PlaybackBase[] = [];
    userPlaybackOptions.forEach((option) => {
      if (option.interval === 0) {
        _bg.push(option);
        return;
      }
      _opt.push(option);
    });
    return [_bg, _opt];
  }, [userPlaybackOptions]);
  return (
    // <section
    //   style={{
    //     display: "flex",
    //     justifyContent: "flex-start",
    //     alignItems: "flex-start",
    //     flexDirection: "column",
    //   }}
    // >
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            padding: "8px",
          }}
        >
          BG:
        </div>
        {bg.map((option) => (
          <p
            style={{
              width: "fit-content",
              borderRadius: "4px",
              padding: "8px",
              backgroundColor: "hotpink",
            }}
          >
            {titleMap.get(option.src)}
          </p>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            padding: "8px",
          }}
        >
          OPT:
        </div>
        {opt.map((option) => (
          <p
            style={{
              width: "fit-content",
              borderRadius: "4px",
              padding: "8px",
              backgroundColor: "blue",
            }}
          >
            {titleMap.get(option.src)}x{option.interval}min.
          </p>
        ))}
      </div>
    </>
    // </section>
  );
}
