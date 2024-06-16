import { useEffect, useState } from "preact/hooks";
import { Composer, fakeController } from "../../orchestrate";
import { composerStream } from "../../soundOptons/observables";

// returns a controller on each composerStream emission ( your audio elements are loaded!)
export default function useController({
  next: nextCallback,
}:
  | {
      next?: () => void;
    }
  | undefined = {}) {
  const [controller, setController] = useState<Composer>(fakeController);

  useEffect(() => {
    const sub = composerStream.subscribe({
      next: (composer: Composer) => {
        console.log("NEXTED!", composer);
        setController(composer);
        if (nextCallback != null) {
          nextCallback();
        }
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return controller;
}
