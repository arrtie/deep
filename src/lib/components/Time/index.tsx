import { Playback } from "../../Playback";
import TimeController from "./TimeController";

export default function TimeView({ playback }: { playback: Playback }) {
  if (playback?.stopwatchStream == null) {
    return "Stopwatch waiting on playback";
  }
  return <TimeController stopwatchStream={playback.stopwatchStream} />;
}
