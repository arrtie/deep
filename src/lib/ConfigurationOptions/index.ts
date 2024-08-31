import { SoundId } from "../SoundManager";
import { OptionKind } from "../components/Player/PlayerOption";
import { addBGConfig } from "./streams";

export type SoundConfig =
  | SoundOptions<LoopOptions>
  | SoundOptions<IntervalOptions>;

type LoopOptions = { loop: true };
type IntervalOptions = { delay: number; repetitions: number };
type SoundOptions<T> = { id: SoundId } & T;
export type LoopOnly = SoundOptions<LoopOptions>;
export type IntervalOnly = SoundOptions<IntervalOptions>;

export function submitUserConfigOption(config: SoundConfig, kind: OptionKind) {
  console.log("config option: ", kind);
  if (kind === "background") {
    // add to bbConfigAccum
    addBGConfig(config);
    return;
  }
  // add to interlvalConfigAccum
}
