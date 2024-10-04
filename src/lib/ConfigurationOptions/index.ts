import { OptionKind } from "../components/Player/PlayerOption";
import { SoundId } from "../soundOptons";
import { UserSelection } from "./UserSelection";

// export type SoundConfig =
//   | SoundOptions<LoopOptions>
//   | SoundOptions<IntervalOptions>;
export interface SoundConfig {
  delay: number;
  repetitions: number;
  id: SoundId;
}
type LoopOptions = { loop: true };
type IntervalOptions = { delay: number; repetitions: number };
type SoundOptions<T> = { id: SoundId } & T;
export type LoopOnly = SoundOptions<LoopOptions>;
export type IntervalOnly = SoundOptions<IntervalOptions>;

export function submitUserConfigOption(config: SoundConfig, kind: OptionKind) {
  UserSelection.addConfig(config, kind);
}

export function clearUserSelections() {
  UserSelection.clearConfigs();
}
