import { useCallback } from "preact/hooks";
import { PlaybackBase } from "../../orchestrate/orchestrate";
import { addPlaybackOptionToQueue } from "../../streams/PlaybackQueue";

function makeSubmitHandler(src: string, background: boolean) {
  return function handleSubmit(e: Event) {
    e.preventDefault();
    const intervalInput: HTMLInputElement | null = (
      e.currentTarget as HTMLFormElement
    ).querySelector("input[name='interval']");
    if (intervalInput == null) {
      throw new Error("why no find interval input?");
    }
    const parsedInterval = parseInt(intervalInput.value);
    const playbackBase: PlaybackBase = {
      src,
      interval: Number.isNaN(parsedInterval) ? 0 : parsedInterval,
      loop: background,
    };
    addPlaybackOptionToQueue(playbackBase);
  };
}

export default function PlayerOption({
  presets: { background, src },
  title,
}: {
  presets: { background: boolean; src: string; interval: number };
  title: string;
}) {
  const onHandleSubmit = useCallback(
    (e: Event) => makeSubmitHandler(src, background)(e),
    [src, background]
  );
  return (
    <form
      onSubmit={onHandleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: background ? "purple" : "rebeccapurple",
        padding: "16px",
        boxShadow: "black 6px 6px",
      }}
    >
      <h5>{title}</h5>
      <label style={{ visibility: background ? "hidden" : "initial" }}>
        interval (in minutes):{" "}
        {/* plays this sound on an interval; in minutes  */}
        <input type="number" name="interval" />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}
