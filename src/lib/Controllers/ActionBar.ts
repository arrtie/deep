import { map } from "rxjs";
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

/**
 * emits an ActionBarController
 */
export const actionBarControllerStream = userSelectionStream.pipe(
  map((userSelectionConfigs) => {
    console.log("userSelectionConfigs: ", userSelectionConfigs);
    return new Playback(userSelectionConfigs);
  })
);

export function subscribeToActionBarControllerStream(
  observer: ObserverLike<ActionBarController>
) {
  return actionBarControllerStream.subscribe(observer);
}
