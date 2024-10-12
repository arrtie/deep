import { getIntervalSoundSetupAll } from "../../../soundOptons";
import PlayerOption from "../PlayerOption";
const options = getIntervalSoundSetupAll();
export default function IntervalOptions() {
  return options.map((option) => {
    const presets = {
      kind: "interval",
      id: option.id,
      interval: 0,
    };
    return <PlayerOption presets={presets} title={option.title} />;
  });
}
