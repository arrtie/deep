import { useEffect, useState } from "preact/hooks";
import { Observer } from "rxjs";
import {
  UserSelectionConfigs,
  userSelectionStream,
} from "../ConfigurationOptions/UserSelection";

export default function usePlaybackOptions(): UserSelectionConfigs | null {
  const [options, setOptions] = useState<UserSelectionConfigs | null>(null);
  useEffect(() => console.log("options: ", options), [options]);
  useEffect(() => {
    const observer: Partial<Observer<UserSelectionConfigs | null>> = {
      next(configProps: UserSelectionConfigs | null) {
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
