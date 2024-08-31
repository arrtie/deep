import { useEffect, useState } from "preact/hooks";
import { Observer, scan } from "rxjs";
import { SoundConfig } from "../ConfigurationOptions";
import { bgConfigStream } from "../ConfigurationOptions/streams";

export default function usePlaybackOptions(): SoundConfig[] {
  // subscribe to stream
  // set playbackOptionState on event
  const [options, setOptions] = useState<SoundConfig[]>([]);
  useEffect(() => console.log("options: ", options), [options]);
  useEffect(() => {
    const observer: Partial<Observer<SoundConfig[]>> = {
      next(configProps: SoundConfig[]) {
        setOptions([...configProps]);
      },
    };
    const subscription = bgConfigStream
      .pipe(
        scan<SoundConfig, SoundConfig[]>((acc, current) => {
          acc.push(current);
          return acc;
        }, [])
      )
      .subscribe(observer);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return options;
}
