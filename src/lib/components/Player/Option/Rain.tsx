import PlayerOption from "../PlayerOption";
const rainOptions = {
  kind: "background",
  background: true,
  id: "rain",
};
export default function RainPlayerOption() {
  return <PlayerOption presets={rainOptions} title="Rain" />;
}
