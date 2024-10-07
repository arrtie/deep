import { Observable } from "rxjs";
import { Sound } from "../../types";
import useSubscribe from "../../utils/useSubscribe";
import { SoundConfig } from "../ConfigurationOptions";

export function minToMs(time: number) {
  return time * 1000 * 60;
}

export interface PlaybackProperties extends SoundConfig {
  repetitionsRemaining: number;
  offset: number;
  timeoutId: number | undefined;
  sound: Sound;
}

export function newTimeout(
  intervals: Map<number, PlaybackProperties>,
  uuid: number
) {
  const playbackProps = intervals.get(uuid);
  if (playbackProps == null) {
    throw new Error("why no playback props?");
  }
  const { offset, delay, repetitionsRemaining, sound } = playbackProps;
  const timeAmount = offset > 0 ? offset : minToMs(delay);
  const timeoutId = setTimeout(() => {
    sound.play();
    const newRepetitionsRemaining = repetitionsRemaining - 1;
    playbackProps.repetitionsRemaining = newRepetitionsRemaining;
    if (newRepetitionsRemaining > 0) {
      newTimeout(intervals, uuid);
    }
  }, timeAmount);

  playbackProps.timeoutId = timeoutId;
  playbackProps.offset = 0;
}

export function useStopwatchStream(
  stopwatchStream: Observable<{ currentTime: number }>
) {
  return useSubscribe(stopwatchStream);
}
