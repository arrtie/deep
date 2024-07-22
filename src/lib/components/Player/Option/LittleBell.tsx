import PlayerOption from "../PlayerOption";
const presets = {
  kind: "interval",
  src: "interval-default",
  interval: 0,
};
export default function LittleBellPlayerOption() {
  return <PlayerOption presets={presets} title="Little Bell" />;
}
