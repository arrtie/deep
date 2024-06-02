import { Subject, combineLatest, map, take, tap } from "rxjs";
import { setup } from "../components/ControlCenter";
import { nodesAreLoaded } from "../orchestrate";
const hasConsented = new Subject<boolean>();
export const audioSubject = new Subject<HTMLAudioElement[]>();

export const setupStream = combineLatest([
  hasConsented.pipe(
    take(1),
    map(() => setup())
  ),
  audioSubject,
]).pipe(
  tap((props) => console.log("tap: ", props)),
  map(([context, audioNodes]) => {
    const { audioCtx } = context;
    console.log("audioCtx: ", audioCtx);
    return nodesAreLoaded(audioNodes, audioCtx);
  })
);

// get array of PlaybackConfig
// for each PlaybackConfig:
// put the AudioNode in AudioSourceNodes
// return array of PlaybackImage
//

export function consentToPlayback() {
  hasConsented.next(true);
}

export function domAudioReady(audioRefs: HTMLAudioElement[]) {
  console.trace("Audiorefs: ", audioRefs);
  audioSubject.next(audioRefs);
}
