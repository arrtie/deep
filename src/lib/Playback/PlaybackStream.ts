import { map, scan, share } from "rxjs";
import { Playback } from ".";
import { userSelectionStream } from "../ConfigurationOptions/UserSelection";

interface PreviousCurrent {
  prev: Playback | null;
  current: Playback | null;
}

export const playbackStream = userSelectionStream.pipe(
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
  }),
  share()
);
