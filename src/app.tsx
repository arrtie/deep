import { useCallback, useState } from "preact/hooks";
import "./app.css";
import ArdioGroup from "./lib/components/Ardio/ArdioGroup";
import useController from "./lib/components/Controller/useController";
import Ready from "./lib/components/Ready";
import { PlaybackBasePartial, makePlaybackBase } from "./lib/orchestrate";
import { consentToPlayback } from "./lib/soundOptons/observables";

const constantRain: PlaybackBasePartial = {
  src: "assets/rain.mp4",
  loop: true,
};

const intervalRoar: PlaybackBasePartial = {
  src: "assets/roar.mp3",
  interval: 1000 * 60 * 5,
};

const playbacksrcs = [constantRain, intervalRoar].map(makePlaybackBase);

export function App() {
  const [playState, setPlayState] = useState("querying");
  const lC = useController();

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
      {playState === "querying" ? (
        <Ready
          onClick={() => {
            setPlayState("paused");
            consentToPlayback();
          }}
        />
      ) : (
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
      )}
      <aside style={{ visibility: "hidden" }}>
        <ArdioGroup playbacksrcs={playbacksrcs} />
      </aside>
    </main>
  );
}
