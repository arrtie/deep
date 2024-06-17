import { useCallback, useState } from "preact/hooks";
import usePlaybackOptions from "../../soundOptons/usePlaybackOptions";
import ArdioGroup from "../Ardio/ArdioGroup";
import PlaybackViewer from "../PlaybackViewer";
import AudioPlayer from "../Player/Player";
import useController from "./useController";

export default function Controller() {
  const [playState, setPlayState] = useState("querying");
  const lC = useController();
  const userPlaybackOptions = usePlaybackOptions();

  const play = useCallback(() => {
    lC.play();
    setPlayState("playing");
  }, [lC]);

  const pause = useCallback(() => {
    lC.pause();
    setPlayState("paused");
  }, [lC]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <section>
        <AudioPlayer />
      </section>
      <PlaybackViewer userPlaybackOptions={userPlaybackOptions} />
      <section>
        {playState !== "playing" ? (
          <button className={"button"} onClick={play}>
            play
          </button>
        ) : (
          <button className={"button"} onClick={pause}>
            pause
          </button>
        )}
        <label for="volume">VOL</label>
        <input
          type="range"
          id="volume"
          class="control-volume"
          min="0"
          max="2"
          value="1"
          list="gain-vals"
          step="0.01"
          data-action="volume"
        />
      </section>
      <aside style={{ visibility: "hidden" }}>
        <ArdioGroup playbackBases={userPlaybackOptions} />
      </aside>
    </main>
  );
}
