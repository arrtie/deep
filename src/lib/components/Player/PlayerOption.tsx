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
    const playbackBase: PlaybackBase = {
      src,
      interval: parseInt(intervalInput.value),
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
        backgroundColor: "purple",
        padding: "16px",
        boxShadow: "6px 6px 6px black",
      }}
    >
      <h5>{title}</h5>
      <label>
        interval: {/* plays this sound on an interval; in seconds  */}
        <input type="number" name="interval" />
      </label>
      <button type="submit">Add</button>
    </form>
  );
}
