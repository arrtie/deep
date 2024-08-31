import { Subject } from "rxjs";

export function makeAddTo<T>(subject: Subject<T>) {
  return function (value: T) {
    subject.next(value);
  };
}
