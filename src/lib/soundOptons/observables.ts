import { Subject, combineLatest, fromEvent, map, take, tap } from "rxjs";
import { setup } from "../components/ControlCenter";
import { AudioSourceNode } from "./addAudio";
const clickStream = fromEvent(window, "click");
export const initSubject = new Subject<HTMLAudioElement>();
export const setupStream = combineLatest([
  clickStream.pipe(take(1)),
  initSubject,
]).pipe(
  tap((props) => console.log("tap: ", props)),
  map(([, el]) => {
    const { audioCtx } = setup();
    console.log("audioCtx: ", audioCtx);
    return new AudioSourceNode(el, audioCtx);
  })
);
