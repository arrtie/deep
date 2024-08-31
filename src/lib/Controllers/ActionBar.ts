import { map } from "rxjs";
import { ObserverLike, bgControllerAccumulator } from ".";
import { emitBGControllersToPlayStream } from "./streams";
/**
 * @method play triggers emit from bgControllers and intrvControllers
 */
export type ActionBarController = {
  play: () => void; // trigger the start of playing all the sounds
  pause: () => void;
};

/**
 * emits an ActionBarController
 */
export const actionBarControllerStream = bgControllerAccumulator.pipe(
  map((bgControllers) => {
    console.log("bgControllers: ", bgControllers);
    return {
      pause() {
        console.log("actionbarpause");
      },
      play() {
        console.log("actionbarplay");
        emitBGControllersToPlayStream(bgControllers);
      },
    };
  })
);

export function subscribeToActionBarControllerStream(
  observer: ObserverLike<ActionBarController>
) {
  return actionBarControllerStream.subscribe(observer);
}
