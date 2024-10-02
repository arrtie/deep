import { StopwatchProps } from "../Playback/Playback";

export const fakeController = {
  play() {
    console.log("fake play");
  },
  pause() {
    console.log("fake pause");
  },
  subscribe(val: { next: (newVal: StopwatchProps) => void }) {
    console.log("PSYCH");
    return () => {};
  },
} as const;

export type PlayPauseController = typeof fakeController;

export type ObserverLike<T, K = void> = {
  next: (value: T) => K;
};
