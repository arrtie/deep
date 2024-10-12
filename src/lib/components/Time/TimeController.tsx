import { useEffect, useState } from "preact/hooks";
import { interval, map, Observable, of, startWith, switchMap } from "rxjs";
import { StopwatchState } from "../../Stopwatch";
import { TimeView } from "./TimeView";

export default function TimeController({
  stopwatchStream,
}: {
  stopwatchStream: Observable<StopwatchState | null>;
}) {
  const [state, setState] = useState<StopwatchState | null>(null);

  useEffect(() => {
    const stopwatchStateStream = stopwatchStream.pipe(
      switchMap((currState) => {
        if (currState == null) {
          return of(null);
        }
        if (currState.state === "playing") {
          return interval(100).pipe(
            startWith(0),
            map((curr) => {
              return {
                ...currState,
                delta: currState.delta + curr * 100,
              };
            })
          );
        }
        return of(currState);
      })
    );
    const stopwatchSub = stopwatchStateStream.subscribe({
      next: (nextState) => {
        setState(nextState);
      },
    });
    return () => stopwatchSub.unsubscribe();
  }, [stopwatchStream]);

  if (state == null) {
    return null;
  }

  const timeInMs = state == null ? 0 : state.delta;
  return <TimeView timeInMs={timeInMs} />;
}
