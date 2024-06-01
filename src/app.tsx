import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import "./app.css";
import { AudioSourceNode } from "./lib/soundOptons/addAudio";
import { initSubject, setupStream } from "./lib/soundOptons/observables";
// export const paths = ["public/assets/rain.mp4"];
export const paths = [
  "assets/rain.mp4",
  // "public/assets/whitenoise.mp4",
  // "public/assets/roar.mp3",
];

export function App() {
  const [constrollers, setControllers] = useState<AudioSourceNode>();
  const [loaded, setLoaded] = useState(false);

  const [playState, setPlayState] = useState("loading");

  // useEffect(() => {
  //   function init() {
  //     console.log("INITED!");
  //     initSubject.next(paths);
  //     window.removeEventListener("click", init);
  //   }
  //   window.addEventListener("click", init);

  //   return () => {
  //     window.removeEventListener("click", init);
  //   };
  // }, []);

  useEffect(() => {
    const sub = setupStream.subscribe({
      next: (node: AudioSourceNode) => {
        console.log("NEXTED!", node);
        setControllers(node);
        setPlayState("paused");
        sub.unsubscribe();
      },
    });
    if (audioRef.current != null) {
      initSubject.next(audioRef.current);
    }
    return sub.unsubscribe;
  }, []);

  console.log("constrollers: ", constrollers);

  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   if (audioRef.current != null) {
  //     const newElement = document.createElement("audio");
  //     newElement.src = "assets/rain.mp4";
  //     newElement.controls = true;
  //     audioRef.current.appendChild(newElement);
  //     setLoaded(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (audioRef.current != null) {
  //     const nodes = audioContainer?.querySelectorAll("audio");
  //     if (nodes == null) {
  //       return;
  //     }
  //     Array.from(nodes).map((audio) => {
  //       initSubject.next(audio);
  //     });
  //   }
  // }, []);

  const play = () => {
    // audioContainer?.querySelectorAll("audio").forEach((controller) => {
    //   controller.play();
    // });
    constrollers?.play();
    setPlayState("playing");
  };

  const pause = useCallback(() => {
    constrollers?.pause();
    setPlayState("paused");
  }, [constrollers]);
  // const play = useCallback(() => {
  //   constrollers.forEach((controller) => {
  //     controller.play();
  //     debugger;
  //     setPlayState("playing");
  //   });
  // }, [constrollers]);

  // const pause = useCallback(() => {
  //   constrollers.forEach((controller) => {
  //     controller.pause();
  //     setPlayState("paused");
  //   });
  // }, [constrollers]);

  return (
    <main>
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
          onChange={(e) => {
            // if (controller?.volumeControl != null) {
            //   controller?.volumeControl(parseFloat(e.currentTarget.value));
            // }
          }}
        />
      </section>
      <section>
        <audio ref={audioRef} src="assets/rain.mp4" controls />
      </section>
    </main>
  );
}
