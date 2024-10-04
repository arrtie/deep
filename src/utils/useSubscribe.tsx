import { useEffect, useState } from "preact/hooks";
import { Observable } from "rxjs";

export default function useSubscribe<T>(stream: Observable<T>) {
  const [controller, setController] = useState<T | null>(null);

  useEffect(() => {
    const sub = stream.subscribe({
      next: (theT: T) => {
        setController(theT);
      },
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return controller;
}
