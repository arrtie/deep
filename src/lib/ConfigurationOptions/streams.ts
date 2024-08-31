import { Subject, interval, map, share, take } from "rxjs";
import { SoundConfig } from ".";
import { makeAddTo } from "../../utils/makeAddTo";
import { SoundId } from "../SoundManager";
export type Sound = Howl;
export const bgConfigSubject = new Subject<SoundConfig>();

export const addBGConfig = makeAddTo(bgConfigSubject);
export const bgConfigStream = bgConfigSubject.pipe(share());

const intervalConfigSubject = new Subject<SoundConfig>();
const addToIntervalConfigSubject = makeAddTo(intervalConfigSubject);

function createIntervalStream(id: SoundId, delay: number, repetitions: number) {
  return interval(delay).pipe(
    map(() => id),
    take(repetitions)
  );
}
