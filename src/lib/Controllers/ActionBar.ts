import { useEffect, useState } from "preact/hooks";
import { map } from "rxjs";
import {
  PlayPauseController,
  fakeController,
  releaseControllersToPlayStream,
} from ".";
import { Controller } from "../../types";
import { configAggregatorStream } from "../ConfigurationOptions";
type ActionBarController = Controller;

/**
 * emits an ActionBarController
 */
export const actionBarControllerStream = configAggregatorStream.pipe(
  map((configAggregator) => {
    console.log("configAggStream emission: ", configAggregator);
    return {
      pause() {
        console.log("actionbarpause");
      },
      play() {
        console.log("actionbarplay");
        releaseControllersToPlayStream(configAggregator);
      },
    };
  })
); // returns a controller on each composerStream emission ( your audio elements are loaded!)

export default function useActionBarController() {
  const [controller, setController] =
    useState<PlayPauseController>(fakeController);

  useEffect(() => {
    const sub = actionBarControllerStream.subscribe({
      next: (actionBarController: ActionBarController) => {
        console.log("New Action Bar Controller", actionBarController);
        setController(actionBarController);
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return controller;
}
