import {
  interval,
  map,
  NEVER,
  Observable,
  scan,
  share,
  Subject,
  switchMap,
  tap,
} from "rxjs";
import { Sound } from "../../types";
import useSubscribe from "../../utils/useSubscribe";
import { SoundConfig } from "../ConfigurationOptions";

export function minToMs(time: number) {
  return time * 1000 * 60;
}

export interface PlaybackProperties extends SoundConfig {
  repetitionsRemaining: number;
  offset: number;
  timeoutId: number | undefined;
  sound: Sound;
}

const stopwatchProps = {
  paused: true,
  current: 0,
  speed: 1000,
};

export interface StopwatchState {
  paused: boolean;
  current: number;
  speed: number;
}

// export type StopwatchState = typeof stopwatchProps;
export type StopwatchProps = StopwatchState;
type StopwatchUpdater = (acc: StopwatchState) => StopwatchState;

function makeStopwatch(subject: Observable<StopwatchUpdater>) {
  return subject.pipe(
    scan(
      (acc: StopwatchState, updater: StopwatchUpdater) => updater(acc),
      stopwatchProps
    ),
    tap((val: StopwatchState) => console.log("new vals: ", val)),
    switchMap((currentState: StopwatchState) => {
      return currentState.paused
        ? NEVER
        : interval(currentState.speed).pipe(
            map((val: number) => {
              const current = currentState.current + val * currentState.speed;

              return {
                ...currentState,
                current: currentState.current + val * currentState.speed,
              };
            })
          );
    }),
    share()
  );
}

export type StopwatchSubject = Subject<Partial<StopwatchState>>;

export function makeStopwatchController() {
  const updaterSubject = new Subject<StopwatchUpdater>();
  const stopwatchStream = makeStopwatch(updaterSubject);

  function destroy() {
    updaterSubject.complete();
  }

  function play() {
    function makePlay(currentState: StopwatchState) {
      return {
        ...currentState,
        playing: true,
      };
    }
    updaterSubject.next(makePlay);
  }

  function pause() {
    function makePause(currentState: StopwatchState) {
      return {
        ...currentState,
        playing: false,
      };
    }
    updaterSubject.next(makePause);
  }
  function reset() {
    function makeReset({ speed }: StopwatchState) {
      return {
        speed,
        current: 0,
        paused: false,
      };
    }
    updaterSubject.next(makeReset);
  }

  return {
    play,
    pause,
    reset,
    stopwatchStream,
    destroy,
  };
}

export function newTimeout(
  intervals: Map<number, PlaybackProperties>,
  uuid: number
) {
  const playbackProps = intervals.get(uuid);
  if (playbackProps == null) {
    throw new Error("why no playback props?");
  }
  const { offset, delay, repetitionsRemaining, sound } = playbackProps;
  const timeAmount = offset > 0 ? offset : minToMs(delay);
  const timeoutId = setTimeout(() => {
    sound.play();
    const newRepetitionsRemaining = repetitionsRemaining - 1;
    playbackProps.repetitionsRemaining = newRepetitionsRemaining;
    if (newRepetitionsRemaining > 0) {
      newTimeout(intervals, uuid);
    }
  }, timeAmount);

  playbackProps.timeoutId = timeoutId;
  playbackProps.offset = 0;
}

export function useStopwatchStream(
  stopwatchStream: Observable<{ currentTime: number }>
) {
  return useSubscribe(stopwatchStream);
}
