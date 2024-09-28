import { useEffect, useState } from "preact/hooks";
import { Observer } from "rxjs";
import {
  UserSelectionConfigs,
  userSelectionStream,
} from "../ConfigurationOptions/UserSelection";

export default function usePlaybackOptions(): UserSelectionConfigs | null {
  // subscribe to stream
  // set playbackOptionState on event
  const [options, setOptions] = useState<UserSelectionConfigs | null>(null);
  useEffect(() => console.log("options: ", options), [options]);
  useEffect(() => {
    const observer: Partial<Observer<UserSelectionConfigs>> = {
      next(configProps: UserSelectionConfigs) {
        setOptions(configProps);
      },
    };
    const subscription = userSelectionStream.subscribe(observer);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return options;
}
