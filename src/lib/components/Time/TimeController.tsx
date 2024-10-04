import { Observable } from "rxjs";
import useSubscribe from "../../../utils/useSubscribe";
import { StopwatchState } from "../../Playback/utils";

export default function TimeController({
  stopwatchStream,
}: {
  stopwatchStream: Observable<StopwatchState>;
}) {
  const stopwatchState = useSubscribe(stopwatchStream);
  if (stopwatchState?.current == null) {
    return "No stopwatch state yet";
  }
  const timeInMs = stopwatchState.current;

  return <div>Time is: {timeInMs}</div>;
}
