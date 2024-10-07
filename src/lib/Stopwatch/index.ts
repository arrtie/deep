import { BehaviorSubject, Observable, scan, share, Subject } from "rxjs";

export interface StopwatchState {
  state: "playing" | "paused" | "stopped";
  delta: number;
  startTime: number | null;
}

const startState = {
  state: "stopped" as const,
  delta: 0,
  startTime: null,
};

export type StopwatchSubject = BehaviorSubject<Partial<StopwatchState>>;
type StopwatchUpdater = (acc: StopwatchState) => StopwatchState;

function makeStopwatch(subject: Observable<StopwatchUpdater>) {
  return subject.pipe(
    scan((acc: StopwatchState | null, updater: StopwatchUpdater) => {
      return updater(acc ?? startState);
    }, null),
    share()
  );
}

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
        startTime: Date.now(),
        state: "playing" as const,
      };
    }
    updaterSubject.next(makePlay);
  }

  function pause() {
    function makePause(currentState: StopwatchState) {
      if (currentState.startTime == null) {
        return currentState;
      }

      return {
        delta: currentState.delta + (Date.now() - currentState.startTime),
        startTime: null,
        state: "paused" as const,
      };
    }
    updaterSubject.next(makePause);
  }

  function reset() {
    function makeReset() {
      return {
        delta: 0,
        startTime: null,
        state: "stopped" as const,
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
