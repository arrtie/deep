import { OptionKind } from "../components/Player/PlayerOption";
import { SoundId } from "../soundOptons";
import { userSelection } from "./UserSelection";

export interface SoundConfig {
  delay: number;
  repetitions: number;
  id: SoundId;
}

export function submitUserConfigOption(config: SoundConfig, kind: OptionKind) {
  debugger;
  userSelection.addConfig(config, kind);
}

export function clearUserSelections() {
  userSelection.clearConfigs();
}
