import { SoundId } from "../lib/SoundManager";

export type ObserverLike<T, K = void> = {
  next: (value: T) => K;
};

export type OptionKind = "background" | "interval";

export type ConfigAggregator = {
  bg: SoundConfig[];
  int: SoundConfig[];
};
export type SoundConfig = {
  loop?: boolean;
  delay?: number;
  repetitions?: number;
  interval?: number;
  id: SoundId;
};
export type LoopConfig = SoundConfig & { loop: boolean };
export type IntervalConfig = SoundConfig & {
  delay: number;
  repetitions: number;
  interval: number;
};
export type Sound = Howl;

export type Controller = {
  play: () => void;
  pause: () => void;
};
