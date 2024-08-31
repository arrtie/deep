import { useEffect, useState } from "preact/hooks";
import { PlayPauseController, fakeController } from ".";
import { ActionBarController, actionBarControllerStream } from "./ActionBar";

// returns a controller on each composerStream emission ( your audio elements are loaded!)
export default function useController({
  next: nextCallback,
}:
  | {
      next?: () => void;
    }
  | undefined = {}) {
  const [controller, setController] =
    useState<PlayPauseController>(fakeController);

  useEffect(() => {
    const sub = actionBarControllerStream.subscribe({
      next: (actionBarController: ActionBarController) => {
        console.log("NEXTED!", actionBarController);
        setController(actionBarController);
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
