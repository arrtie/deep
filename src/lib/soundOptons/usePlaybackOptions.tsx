import { useEffect, useState } from "preact/hooks";
import { Observer } from "rxjs";
import {
  OrchestrateConfigProp,
  subscribeToOrchConfigStream,
} from "../orchestrate";

export default function usePlaybackOptions(): OrchestrateConfigProp[] {
  // subscribe to stream
  // set playbackOptionState on event
  const [options, setOptions] = useState<OrchestrateConfigProp[]>([]);

  useEffect(() => {
    const observer: Observer<OrchestrateConfigProp[]> = {
      next(configProps: OrchestrateConfigProp[]) {
        setOptions([...configProps]);
      },
      error(error) {
        console.warn("whoops", error);
      },
      complete() {
        console.warn("youll never see me");
      },
    };
    const subscription = subscribeToOrchConfigStream(observer);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return options;
}
