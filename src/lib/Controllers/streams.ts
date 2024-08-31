import { Subject, mergeWith } from "rxjs";
import { PlayPauseController } from ".";
import { makeAddTo } from "../../utils/makeAddTo";

// stream for Controllers.
const bgControllerSubject = new Subject<PlayPauseController>();

const intervalSubject = new Subject<PlayPauseController>();
const addToIntervalSubject = makeAddTo(intervalSubject);

const intervalControllerSteam = intervalSubject;

const playStream = bgControllerSubject.pipe(mergeWith(intervalControllerSteam));

export function emitBGControllersToPlayStream(
  bgControllers: PlayPauseController[]
) {
  debugger;
  bgControllers.forEach((bgController) => {
    bgControllerSubject.next(bgController);
  });
}

export function subscribeToPlayStream() {
  return playStream.subscribe({
    next: (value: PlayPauseController) => {
      console.log("Plaaystream: ", value);
      value.play();
    },
  });
}
