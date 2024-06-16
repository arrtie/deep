import { BehaviorSubject, combineLatest, map, tap } from "rxjs";
import { setup } from "../components/ControlCenter";
import { fakeController, nodesAreLoaded } from "../orchestrate";

const hasConsented = new BehaviorSubject<boolean>(false);
export const audioSubject = new BehaviorSubject<HTMLAudioElement[]>([]);

// when the user has consented
// and audioSubject has audio elements
// emit new composer
export const composerStream = combineLatest([
  hasConsented.pipe(map((consentGiven) => (consentGiven ? setup() : null))),
  audioSubject,
]).pipe(
  tap((props) => console.log("tap: ", props)),
  map(([context, audioNodes]) => {
    if (context == null || audioNodes.length === 0) {
      return fakeController;
    }
    const { audioCtx } = context;
    return nodesAreLoaded(audioNodes, audioCtx);
  })
);

export function consentToPlayback() {
  hasConsented.next(true);
}

export function domAudioReady(audioRefs: HTMLAudioElement[]) {
  audioSubject.next(audioRefs);
}
