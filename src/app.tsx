import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import "./app.css";
import Ardio from "./lib/components/Ardio";
import {
  Composer,
  PlaybackPartial,
  addPlaybackPath,
  getPlaybackPaths,
  makeConfig,
} from "./lib/orchestrate";
import {
  consentToPlayback,
  domAudioReady,
  setupStream,
} from "./lib/soundOptons/observables";

const constantRain: PlaybackPartial<string> = {
  src: "assets/rain.mp4",
  loop: true,
};

const intervalRoar: PlaybackPartial<string> = {
  src: "assets/roar.mp3",
  interval: 1000 * 60 * 5,
};

[constantRain, intervalRoar].forEach(
  (configPartial: PlaybackPartial<string>) => {
    addPlaybackPath(makeConfig(configPartial));
  }
);

export function App() {
  const [controller, setController] = useState<Composer>();
  const [playState, setPlayState] = useState("querying");

  const localController = useMemo(() => {
    if (controller == null) {
      return {
        play() {
          console.log("fake play");
        },
        pause() {
          console.log("fake pause");
        },
      };
    }
    return controller;
  }, [controller]);
  const lC = localController;

  useEffect(() => {
    const sub = setupStream.subscribe({
      next: (controller: Composer) => {
        console.log("NEXTED!", controller);
        setController(controller);
        setPlayState("paused");
        sub.unsubscribe();
      },
    });
    const nodesAndNulls: (HTMLAudioElement | null)[] = getPlaybackPaths().map(
      (config) => config.ref.current
    );
    const justAudio: HTMLAudioElement[] = nodesAndNulls.filter(
      (nodeOrNull): nodeOrNull is HTMLAudioElement => {
        return nodeOrNull !== null;
      }
    );

    domAudioReady(justAudio);
    return sub.unsubscribe;
  }, []);

  const play = () => {
    lC.play();
    setPlayState("playing");
  };

  const pause = useCallback(() => {
    lC.pause();
    setPlayState("paused");
  }, [controller]);

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
        <section>
          <label>
            <button
              onClick={() => {
                setPlayState("paused");
                consentToPlayback();
              }}
            >
              Ready?
            </button>
          </label>
        </section>
      ) : (
        <section>
          <div>
            <label htmlFor="roars">Want Roars every 5 minutes?</label>
            <input
              id="roars"
              type="checkbox"
              checked={false}
              onChange={(e) => {}}
            />
          </div>
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
        {getPlaybackPaths().map((config) => (
          <Ardio
            key={config.src}
            {...config}
            ref={config.ref}
            src={config.src}
          />
        ))}
      </aside>
    </main>
  );
}
