import PlayerOption from "../PlayerOption";
const presets = {
  background: false,
  src: "assets/little-bell.wav",
  interval: 0,
};
export default function LittleBellPlayerOption() {
  return <PlayerOption presets={presets} title="Little Bell" />;
}
