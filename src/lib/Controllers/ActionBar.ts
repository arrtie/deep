import { map, scan } from "rxjs";
import { ObserverLike } from ".";
import { userSelectionStream } from "../ConfigurationOptions/UserSelection";
import { Playback } from "../Playback/Playback";
/**
 * @method play triggers emit from bgControllers and intrvControllers
 */
export type ActionBarController = {
  play: () => void; // trigger the start of playing all the sounds
  pause: () => void;
};

interface PreviousCurrent {
  prev: Playback | null;
  current: Playback | null;
}
/**
 * emits an ActionBarController
 */
export const actionBarControllerStream = userSelectionStream.pipe(
  map((userSelectionConfigs) => {
    console.log("userSelectionConfigs: ", userSelectionConfigs);
    return new Playback(userSelectionConfigs);
  }),
  scan(
    (acc: PreviousCurrent, newVal: Playback) => {
      if (acc.prev != null) {
        acc.prev.destroy();
      }
      return { current: newVal, prev: acc.current };
    },
    { prev: null, current: null }
  ),
  map((prevAndCurr: PreviousCurrent) => {
    if (prevAndCurr.current == null) {
      throw new Error("missing current?");
    }
    return prevAndCurr.current;
  })
);

export function subscribeToActionBarControllerStream(
  observer: ObserverLike<ActionBarController>
) {
  return actionBarControllerStream.subscribe(observer);
}
