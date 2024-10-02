import { useEffect, useState } from "preact/hooks";
import { map } from "rxjs";
import { fakeController } from ".";
import { ActionBarController, actionBarControllerStream } from "./ActionBar";

// returns a controller on each composerStream emission ( your audio elements are loaded!)
export default function useActionBarController({
  next: nextCallback,
}:
  | {
      next?: () => void;
    }
  | undefined = {}) {
  const [controller, setController] =
    useState<ActionBarController>(fakeController);

  useEffect(() => {
    const sub = actionBarControllerStream
      .pipe(
        map((project) => {
          return project;
        })
      )
      .subscribe({
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
