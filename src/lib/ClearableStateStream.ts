import { Subject, map, merge, scan } from "rxjs";
import { subscriptionWrapper } from "../utils/subscriptionWrapper";

export default function ClearableStateStream<T>() {
  const add$ = new Subject<T>();
  const clear$ = new Subject<T | undefined>();

  const add =
    <T>(value: T) =>
    (state: T[]) =>
      [...state, value];

  const clear = () => (): T[] => [];

  const stateStream = merge(add$.pipe(map(add)), clear$.pipe(map(clear))).pipe(
    scan((state: T[], innerFn: (oldState: T[]) => T[]) => {
      return innerFn(state);
    }, [])
  );

  return {
    add(a: T) {
      add$.next(a);
    },
    clear() {
      clear$.next(undefined);
    },
    stateStream,
    subscribe: subscriptionWrapper(stateStream),
  };
}
