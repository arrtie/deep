import {
  Observable,
  Subject,
  interval,
  map,
  mergeScan,
  share,
  take,
} from "rxjs";
import { IntervalOnly, SoundConfig } from ".";
import { makeAddTo } from "../../utils/makeAddTo";
import { SoundId } from "../soundOptons/SoundManager";
export type Sound = Howl;
export const bgConfigSubject = new Subject<SoundConfig>();

export const addBGConfig = makeAddTo(bgConfigSubject);
export const bgConfigStream = bgConfigSubject.pipe(share());

const intervalConfigSubject = new Subject<IntervalOnly>();
export const addIntervalConfig = makeAddTo(intervalConfigSubject);

function createIntervalStream(id: SoundId, delay: number, repetitions: number) {
  return interval(delay).pipe(
    map(() => id),
    take(repetitions)
  );
}

const intervalConfigStream = intervalConfigSubject.pipe(share());
const intervalStream = intervalConfigStream.pipe(
  mergeScan((acc: Observable<SoundId>, value: IntervalOnly) => {
    return createIntervalStream(value.id, value.delay, value.repetitions);
  }, new Observable<SoundId>())
);
