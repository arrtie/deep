import { Subject, map, scan, share } from "rxjs";
import { ConfigAggregator, OptionKind, SoundConfig } from "../../types";
import { getKindById } from "../SoundManager";

export function submitUserConfigOption(config: SoundConfig, kind: OptionKind) {
  if (kind === "background") {
    submitConfig({ ...config, loop: true });
    return;
  }
  submitConfig(config);
}

function addConfigHandler(config: SoundConfig) {
  return function (state: ConfigAggregator): ConfigAggregator {
    if (getKindById(config.id) === "background") {
      state.bg = [...state.bg, config];
    } else {
      state.int = [...state.int, config];
    }
    return state;
  };
}
const configSubject = new Subject<SoundConfig>();

export function submitConfig(config: SoundConfig) {
  configSubject.next(config);
}
const addConfigHandlerStream = configSubject.pipe(map(addConfigHandler));
const configHandlerStream = addConfigHandlerStream;

export const configAggregatorStream = configHandlerStream.pipe(
  scan<(state: ConfigAggregator) => ConfigAggregator, ConfigAggregator>(
    (acc, handler) => handler(acc),
    { bg: [], int: [] }
  ),
  share()
);
