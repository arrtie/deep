import { useCallback, useState } from "preact/hooks";
import usePlaybackOptions from "../soundOptons/usePlaybackOptions";
import { clearPlaybackQueue } from "../streams/PlaybackQueue";
import useController from "./Controller/useController";

export default function ActionBar() {
  const userPlaybackOptions = usePlaybackOptions();
  const hasOptions = userPlaybackOptions.length > 0;
  const lC = useController();
  const [playState, setPlayState] = useState("querying");

  const play = useCallback(() => {
    lC.play();
    setPlayState("playing");
  }, [lC]);

  const pause = useCallback(() => {
    lC.pause();
    setPlayState("paused");
  }, [lC]);

  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {userPlaybackOptions.length === 0 ? (
        <div />
      ) : (
        <button
          style={{ display: hasOptions ? "inline-block" : "none" }}
          type="button"
          onClick={() => clearPlaybackQueue()}
        >
          CLEAR
        </button>
      )}
      <button
        disabled={hasOptions === false}
        type="button"
        onClick={() => (playState === "playing" ? lC.play() : lC.pause())}
      >
        {playState === "playing" ? "PAUSE" : "PLAY"}
      </button>
    </section>
  );
}
