import { NextObserver, Observable, Subject } from "rxjs";

export function subscriptionWrapper<T>(obs: Observable<T> | Subject<T>) {
  return function (observer: NextObserver<T>) {
    return obs.subscribe(observer);
  };
}
