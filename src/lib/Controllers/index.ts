import {
  Subject,
  from,
  interval as intervalRx,
  map,
  merge,
  switchMap,
  take,
} from "rxjs";
import { ConfigAggregator, Sound, SoundConfig } from "../../types";
import { soundManager } from "../SoundManager";

export const fakeController = {
  play() {
    console.log("fake play");
  },
  pause() {
    console.log("fake pause");
  },
} as const;

export type PlayPauseController = typeof fakeController;

function makeSoundPlayable(sound: Sound) {
  return {
    play() {
      sound.play();
    },
    pause() {
      sound.pause();
    },
  };
}

function convertConfigToController(config: SoundConfig): PlayPauseController {
  const sound = soundManager.get(config.id);
  return makeSoundPlayable(sound);
}

function createIntervalStream(intConfig: SoundConfig) {
  const { interval, delay, repetitions } = intConfig;
  if (interval == null || delay == null || repetitions == null) {
    throw new Error("wrong sound config; should be interval");
  }
  const intervalStream = intervalRx(interval * 1000).pipe(
    // startWith(convertConfigToController(intConfig)),
    map(() => convertConfigToController(intConfig)),
    take(repetitions)
  );
  return intervalStream;
}

// stream for Controllers.
const controllersSubject = new Subject<ConfigAggregator>();

export function releaseControllersToPlayStream(configAgg: ConfigAggregator) {
  return controllersSubject.next(configAgg);
}
const controllerStream = controllersSubject.pipe(
  switchMap((configAgg) => {
    const bgControllers = from(configAgg.bg.map(convertConfigToController));
    const intControllers = configAgg.int.map(createIntervalStream);
    return merge([bgControllers, ...intControllers]);
  })
);
const playStream = controllerStream.pipe(switchMap((newStream) => newStream));

export function subscribeToPlayStream() {
  return playStream.subscribe({
    next: (value: PlayPauseController) => {
      console.log("Plaaystream: ", value);
      value.play();
    },
  });
}
