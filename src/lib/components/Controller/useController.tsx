import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { Composer, getPlaybackRefArray } from "../../orchestrate";
import { composerStream, domAudioReady } from "../../soundOptons/observables";

const fakeMethods = {
  play() {
    console.log("fake play");
  },
  pause() {
    console.log("fake pause");
  },
};

// returns a controller on each composerStream emission
export default function useController({
  next: nextCallback,
}:
  | {
      next?: () => void;
    }
  | undefined = {}) {
  const [controller, setController] = useState<Composer>();

  useEffect(() => {
    const sub = composerStream.subscribe({
      next: (composer: Composer) => {
        console.log("NEXTED!", controller);
        setController(composer);
        if (nextCallback != null) {
          nextCallback();
        }
        sub.unsubscribe();
      },
    });

    const justAudio: HTMLAudioElement[] = getPlaybackRefArray()
      .map((config) => config.ref.current)
      .filter((nodeOrNull): nodeOrNull is HTMLAudioElement => {
        return nodeOrNull !== null;
      });
    if (justAudio.length > 0) {
      domAudioReady(justAudio);
    }
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const isAudioSet = useRef(false);
  useEffect(() => {
    const justAudio: HTMLAudioElement[] = getPlaybackRefArray()
      .map((config) => config.ref.current)
      .filter((nodeOrNull): nodeOrNull is HTMLAudioElement => {
        return nodeOrNull !== null;
      });

    if (justAudio.length > 0) {
      domAudioReady(justAudio);
      isAudioSet.current = true;
    }
  });

  return useMemo(
    () => (controller == null ? fakeMethods : controller),
    [controller]
  );
}
